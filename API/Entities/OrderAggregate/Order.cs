using System.ComponentModel.DataAnnotations;

namespace API.Entities.OrderAggregate
{
    public class Order
    {
        public int Id { get; set; }
        public string BuyerId { get; set; } // user's username
        [Required]
        public ShippingAddress ShippingAddress { get; set; } // owned prop
        public DateTime OrderDate { get; set; } = DateTime.Now;
        public List<OrderItem> OrderItems { get; set; }
        public long Subtotal { get; set; }
        public long DeliveryFee { get; set; }
        public OrderStatus OrderStatus { get; set; } = OrderStatus.PENDING;

        public long GetTotal()
        {
            return Subtotal + DeliveryFee;
        }
    }
}


/* [Required] added to stop error:
 * The entity type 'ShippingAddress' is an optional dependent using table sharing without any required non shared property that could be used to identify whether the entity exists. If all nullable properties contain a null value in database then an object instance won't be created in the query. Add a required property to create instances with null values for other properties or mark the incoming navigation as required to always create an instance.
 * https://docs.microsoft.com/en-us/ef/core/what-is-new/ef-core-6.0/breaking-changes#nested-optionals
 */