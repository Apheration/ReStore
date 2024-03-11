using API.dtos;
using System.ComponentModel.DataAnnotations;

namespace API.Entities.OrderAggregate
{
    public class OrderDto
    {
        public int Id { get; set; }
        public string BuyerId { get; set; } // user's username
        [Required]
        public ShippingAddress ShippingAddress { get; set; } // owned prop
        public DateTime OrderDate { get; set; } 
        public List<OrderItemDto> OrderItems { get; set; }
        public long Subtotal { get; set; }
        public long DeliveryFee { get; set; }
        public string OrderStatus { get; set; }

        public  long Total { get; set; }
    }
}
