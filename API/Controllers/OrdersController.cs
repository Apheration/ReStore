using API.Data;
using API.dtos;
using API.Entities;
using API.Entities.OrderAggregate;
using API.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Authorize]
    public class OrdersController : BaseApiController
    {
        private readonly StoreContext _context;
        public OrdersController(StoreContext context) 
        {
            this._context = context;
        }

        [HttpGet]
        public async Task<ActionResult<List<OrderDto>>> GetOrders()
        {
            return await _context.Orders
                .ProjectOrderToOrderDto()
                .Where(x => x.BuyerId == User.Identity.Name)
                .ToListAsync();
        }
        //                      Name - for first param of CreatedAtRoute (scroll down)
        [HttpGet("{id}", Name = "GetOrder")]
        public async Task<ActionResult<OrderDto>> GetOrder(int id)
        {
            return await _context.Orders
                .ProjectOrderToOrderDto()
                .Where(x => x.BuyerId == User.Identity.Name && x.Id == id)
                .FirstOrDefaultAsync();
        }

        [HttpPost]
        public async Task<ActionResult<Order>> CreateOrder(CreateOrderDto orderDto)
        {
            var basket = await _context.Baskets
                .RetrieveBasketWithItems(User.Identity.Name)
                .FirstOrDefaultAsync();

            if (basket == null) return BadRequest(new ProblemDetails { Title = "Could not locate basket" });

            var items = new List<OrderItem>();

            // check each item as we add them as order items
            foreach (var item in basket.Items) 
            {
                // get product id
                var productItem = await _context.Products.FindAsync(item.ProductId);
                // create new ProductItemOrdered object for each item
                var itemOrdered = new ProductItemOrdered
                {
                    ProductId = productItem.Id,
                    Name = productItem.Name,
                    PictureUrl = productItem.PictureUrl
                };
                var orderItem = new OrderItem
                {
                    ItemOrdered = itemOrdered,
                    Price = productItem.Price,
                    Quantity = item.Quantity
                };
                items.Add(orderItem);
                productItem.QuantityInStock -= item.Quantity;
            }

            var subtotal = items.Sum(item => item.Price * item.Quantity);
            // if subtotal > $100, fee is 0 otherwise $5
            var deliveryFee = subtotal > 10000 ? 0 : 500;

            var order = new Order
            {
                OrderItems = items,
                BuyerId = User.Identity.Name,
                ShippingAddress = orderDto.ShippingAddress,
                Subtotal = subtotal,
                DeliveryFee = deliveryFee
            };

            _context.Orders.Add(order);
            _context.Baskets.Remove(basket);

            if (orderDto.SaveAddress)
            {
                var user = await _context.Users
                    .Include(i => i.Address)
                    .FirstOrDefaultAsync(x => x.UserName == User.Identity.Name);
                var address = new UserAddress
                {
                    FullName = orderDto.ShippingAddress.FullName,
                    Address1 = orderDto.ShippingAddress.Address1,
                    Address2 = orderDto.ShippingAddress.Address2,
                    City = orderDto.ShippingAddress.City,
                    State = orderDto.ShippingAddress.State,
                    Zip = orderDto.ShippingAddress.Zip,
                    Country = orderDto.ShippingAddress.Country
                };
                // user already being tracked by context - var user = await _context.Users
                user.Address = address;
            //   _context.Update(user);
            }
            // true if 1 or more changes are saved (we wrote something to the database)
            var result = await _context.SaveChangesAsync() > 0;
            // creates 201 status code with first parameter as URI
            if(result) return CreatedAtRoute("GetOrder", new { id = order.Id }, order.Id);

            return BadRequest("Problem creating order");
        }
    }
}
