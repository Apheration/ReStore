using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities
{
    [Table("BasketItems")] // in migrations will change to BasketItems instead of class/model name
    public class BasketItem
    {
        public int Id { get; set; }
        public int Quantity { get; set; }
        
        // navigation props
        public int ProductId { get; set; }
        public Product Product { get; set; }

        // fully defining the relationship - BasketItem cannot exist without Basket
        public int BasketId { get; set; }
        public Basket Basket { get; set; }
    }
}