using API.Entities;
using API.Entities.OrderAggregate;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class StoreContext : IdentityDbContext<User, Role, int> // all identity classes will use int for id
    {
        public StoreContext(DbContextOptions options) : base(options) // will pass options up to base class
        {

        }

        public DbSet<Product> Products {  get; set; } // will represent table in database 
        public DbSet<Basket> Baskets { get; set; }
        public DbSet<Order> Orders { get; set; } // will never get individual order item only entire order

        //alternate method to seed database
        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // one user with one address 1:1
            builder.Entity<User>()
                .HasOne(a => a.Address)
                .WithOne()
                .HasForeignKey<UserAddress>(a => a.Id)
                .OnDelete(DeleteBehavior.Cascade);

            // for our Roles table
            // no way to generate Id in programically
            builder.Entity<Role>()
                .HasData(
                    new Role { Id = 1, Name = "Member", NormalizedName = "MEMBER" },
                         new Role { Id = 2, Name = "Admin", NormalizedName = "ADMIN" }
                    );
        }
    }
}
