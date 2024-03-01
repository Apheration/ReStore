namespace API.Entities.OrderAggregate
{
    public class OrderItem
    {
        public int Id { get; set; }
        // owned property, will see ItemOrdered in OrderItem table
        public ProductItemOrdered ItemOrdered { get; set; }
        public long Price { get; set; }
        public int Quantity { get; set; }
    }
}
