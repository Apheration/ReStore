using System.ComponentModel.DataAnnotations;

namespace API.Entities
{
    public class Address
    {
        // TitleCase just a reminder of the term
        public string FullName { get; set; }
        public string Address1 { get; set; }
        public string Address2 { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string Zip { get; set; }
        public string Country { get; set; }
    }
}

