using API.Entities.OrderAggregate;

namespace API.dtos
{
    public class CreateOrderDto
    {
        public bool SaveAddress { get; set; }
        public ShippingAddress ShippingAddress { get; set; }
    }
}
