namespace API.Entities.OrderAggregate
{
    public class Order
    {
        public int Id { get; set; }
        public string BuyerId { get; set; } // user's username
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
 