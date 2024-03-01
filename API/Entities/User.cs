using Microsoft.AspNetCore.Identity;

namespace API.Entities
{
    // 1 to 1 : one user to one address
    public class User : IdentityUser<int> // normally uses string as primary key
    {
        public UserAddress Address { get; set; }
    }
}
