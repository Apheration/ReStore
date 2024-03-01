
using Microsoft.EntityFrameworkCore;

/// Snapshot of item when ordered
/// if properties of item changed since then
/// user will see old properties of what they actually ordered
/// used right now in OrderItem class so will show up in OrderItem table
namespace API.Entities.OrderAggregate
{
    [Owned]
    public class ProductItemOrdered
    {
        public int ProductId { get; set; }
        public string Name { get; set; }
        public string PictureUrl { get; set; }
    }
}
