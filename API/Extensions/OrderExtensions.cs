using API.Entities.OrderAggregate;
using Microsoft.EntityFrameworkCore;

namespace API.Extensions
{
    /// <summary>
    /// Pull out only the properties we're interested in
    /// So we don't need to use .Include to get every entity in the order
    /// </summary>
    public static class OrderExtensions
    {
       public static IQueryable<OrderDto> ProjectOrderToOrderDto(this IQueryable<Order> query)
        {
            return query
                .Select(order => new OrderDto
                {
                    Id = order.Id,
                    BuyerId = order.BuyerId,
                    OrderDate = order.OrderDate,
                    ShippingAddress = order.ShippingAddress,
                    DeliveryFee = order.DeliveryFee,
                    Subtotal = order.Subtotal,
                    OrderStatus = order.OrderStatus.ToString(),
                    Total = order.GetTotal(),
                    OrderItems = order.OrderItems.Select(item => new dtos.OrderItemDto
                    {
                        ProductId = item.ItemOrdered.ProductId,
                        Name = item.ItemOrdered.Name,
                        PictureUrl = item.ItemOrdered.PictureUrl,
                        Price = item.Price,
                        Quantity = item.Quantity
                    }).ToList()
                    // do not have to track query with EF because only using in Get methods
                }).AsNoTracking();
        }
    }
}
