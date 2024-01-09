using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class StoreContext : DbContext
    {
        public StoreContext(DbContextOptions options) : base(options) // will pass options up to base class
        {

        }

        public DbSet<Product> Products {  get; set; } // will represent table in database 

        public DbSet<Basket> Baskets { get; set; }
    }
}
