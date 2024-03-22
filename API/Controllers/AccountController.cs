using API.Data;
using API.dtos;
using API.Entities;
using API.Extensions;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class AccountController : BaseApiController
    {
        private readonly UserManager<User> _userManager;
        private readonly TokenService _tokenService;
        private readonly StoreContext _context;
        private readonly ILogger<AccountController> _logger;

        // some depency injections
        public AccountController(UserManager<User> userManager, TokenService tokenService, StoreContext context, ILogger<AccountController> logger)
        {
            this._userManager = userManager;
            this._tokenService = tokenService;
            this._context = context;
            this._logger = logger;
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            // find username, if not null or pwd incorrect return unauthorized
            var user = await _userManager.FindByNameAsync(loginDto.Username);
            if (user == null || !await _userManager.CheckPasswordAsync(user, loginDto.Password))
                return Unauthorized();

            var userBasket = await RetrieveBasket(loginDto.Username); // may be null
            var anonBasket = await RetrieveBasket(Request.Cookies["buyerId"]); // may be null

            // if we have anon basket and then login, have 2 baskets. transfer anon basket to user's and remove anon basket instance
            // ...I think? check logic.
            // change anon basket to username buyerId 
            if (anonBasket != null) // we have a non-logged in basket
            {   
                // if we have a current user basket, remove it.
                if(userBasket != null) _context.Baskets.Remove(userBasket);
                _logger.LogError("we already have a basket here, removing it to transfer anon basket to user who just signed in");
                // transfer anon basket to user by assigning its buyerId to the now logged in username as buyerId
                anonBasket.BuyerId = user.UserName;
                Response.Cookies.Delete("buyerId");
                await _context.SaveChangesAsync();
            }

            // do we have anon (wasn't logged in) basket? otherwise we are already logged in, use that basket instead.
            return new UserDto
            {
                Email = user.Email,
                Token = await _tokenService.GenerateToken(user),
                // return basket to user
                // object not referenced or whatever error if not using null propogation userBasket?
                Basket = anonBasket != null ? anonBasket.MapBasketToDto() : userBasket?.MapBasketToDto()
            };

        }

        [HttpPost("register")]
        public async Task<ActionResult> Register(RegisterDto registerDto)
        {
            var user = new User { UserName = registerDto.Username, Email = registerDto.Email };
            var result = await _userManager.CreateAsync(user, registerDto.Password);

            if(!result.Succeeded)
            {
                // iterate over all reported errors
                foreach (var error in result.Errors)
                {
                    // used to associate an error with a specific model property
                    ModelState.AddModelError(error.Code, error.Description);
                }

                return ValidationProblem();
            }

            await _userManager.AddToRoleAsync(user, "Member");

            // successful request
            return StatusCode(201);
        }

        // will protect endpoint - i.e. can't put before login before user isn't logged in yet can't 
        // check if authorized
        // can put [Authorize] at top of controller (constructor) to apply to all endpoints
        [Authorize]
        [HttpGet("currentUser")] // get token from database (need to be authenticated)
        public async Task<ActionResult<UserDto>> GetCurrentUser()
        {
            // get our username claim
            var user = await _userManager.FindByNameAsync(User.Identity.Name);
            var userBasket = await RetrieveBasket(User.Identity.Name); 



            return new UserDto
            {
                Email = user.Email,
                Token = await _tokenService.GenerateToken(user),
                Basket = userBasket?.MapBasketToDto()
            };
        }

        [Authorize]
        [HttpGet("savedAddress")]
        public async Task<ActionResult<UserAddress>> GetSavedAddress()
        {
            // access to our users table
            // select where username = identity.name, pull the user address from selection
            return await _userManager.Users
                .Where(x => x.UserName == User.Identity.Name)
                .Select(user => user.Address)
                .FirstOrDefaultAsync();
        }

        private async Task<Basket> RetrieveBasket(string buyerId)
        {
            // no BuyerId so no basket
            if(string.IsNullOrEmpty(buyerId))
            {
                Response.Cookies.Delete("buyerId");
                return null;
            }
            return await _context.Baskets
                .Include(i => i.Items) // get basket items
                .ThenInclude(p => p.Product) // then get products
                .FirstOrDefaultAsync(x => x.BuyerId == buyerId); // username, return object or null as default
        }
    }
}
