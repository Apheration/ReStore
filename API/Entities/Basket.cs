namespace API.Entities
{
    public class Basket
    {
        public int Id { get; set; }
        public string BuyerId { get; set; } // who's basket belongs to who
        public List<BasketItem> Items { get; set; } = new();

        public void AddItem(Product product, int quantity)
        {
            if (Items.All(item => item.ProductId != product.Id)) // if item not already in list
            {
                Items.Add(new BasketItem { Product = product, Quantity = quantity });
            }

            //find item in Items via productId
            var existingItem = Items.FirstOrDefault(item => item.ProductId == product.Id);
            //item exists, add 1 quantity
            if (existingItem != null)  existingItem.Quantity += quantity; 
        }

        public void RemoveItem(int productId, int quantity)
        {
            var item = Items.FirstOrDefault(item => item.ProductId == productId);
            if (item == null) return;
            item.Quantity -= quantity;
            if(item.Quantity == 0) Items.Remove(item); 
        }
    }
}
