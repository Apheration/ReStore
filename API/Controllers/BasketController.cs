using API.Data;
using API.dtos;
using API.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class BasketController : BaseApiController
    {
        private readonly StoreContext _context; // assign value at initialization then immutable

        public BasketController(StoreContext context) 
        {
            this._context = context; // initialize _context from passed parameter context
        }

        [HttpGet(Name = "GetBasket")] // for createdatroute()
        public async Task<ActionResult<BasketDto>> GetBasket()
        {
            var basket = await RetrieveBasket();

            if (basket == null) return NotFound();
            return MapBasketToDto(basket);

        }


        [HttpPost] // api/basket?productId=3&quantity=2 getting method from parameters
        public async Task<ActionResult<BasketDto>> AddItemToBasket(int productId, int quantity)
        {
            var basket = await RetrieveBasket();
            if (basket == null) basket = CreateBasket();
            var product = await _context.Products.FindAsync(productId);
            if(product == null) return BadRequest(new ProblemDetails { Title = "Product Not Found"});
            basket.AddItem(product, quantity);

            var result = await _context.SaveChangesAsync() > 0; // checks if changes saved are > 0 (it worked)

            // CreatedAtRoute - creates a 201  header properly for our API
            // good for REST API, includes the lcation header of created resource e.g. /api/basket
            if (result) return CreatedAtRoute("GetBasket", MapBasketToDto(basket));

            return BadRequest(new ProblemDetails { Title = "Problem saving item to basket" });
        }

 
        [HttpDelete]
        public async Task<ActionResult> RemoveBasketItem(int productId, int quantity)
        {
            var basket = await RetrieveBasket();
            if (basket == null) return NotFound();
            basket.RemoveItem(productId, quantity);

            var result = await _context.SaveChangesAsync() > 0;
            if (result) return StatusCode(201);

            return BadRequest(new ProblemDetails { Title = "Problem removing item from basket" });
        }

        private async Task<Basket> RetrieveBasket()
        {
            var basket = await _context.Baskets
                .Include(i => i.Items) // get basket items
                .ThenInclude(p => p.Product) // then get products
                .FirstOrDefaultAsync(x => x.BuyerId == Request.Cookies["buyerId"]); // return object or null as default
            return basket;
        }

        private Basket CreateBasket()
        {
           var BuyerId = Guid.NewGuid().ToString(); //create unique identifier for each basket
           var cookieOptions = new CookieOptions { IsEssential = true, Expires = DateTime.Now.AddDays(30) }; //essential cookie, also useful for EU dialog for what types of cookies to accept
           Response.Cookies.Append("buyerId", BuyerId, cookieOptions); // add the new cookie
            var basket = new Basket { BuyerId = BuyerId };
            _context.Baskets.Add(basket); // add the new basket

            return basket;
        }

        private static BasketDto MapBasketToDto(Basket basket) //confusing
        {
            return new BasketDto
            {
                Id = basket.Id,
                BuyerId = basket.BuyerId,
                Items = basket.Items.Select(item => new BasketItemDto
                {
                    ProductId = item.ProductId,
                    Name = item.Product.Name,
                    Price = item.Product.Price,
                    PictureUrl = item.Product.PictureUrl,
                    Type = item.Product.Type,
                    Brand = item.Product.Brand,
                    Quantity = item.Quantity
                }).ToList()
            };
        }

    }
}
