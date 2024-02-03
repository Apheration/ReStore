using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Extensions
{
        //extension method to extend IQueryable


    public static class ProductExtensions
    {
        public static IQueryable<Product> Sort(this IQueryable<Product> query, string orderBy)
        {
            if(string.IsNullOrWhiteSpace(orderBy)) return query.OrderBy(p => p.Name);

            // case price:
            // query = query.OrderBy(p => p.Price)
            // etc
            //concise way of using switch statement if all cases change one variable
            query = orderBy switch
            { // if orderBy = "price", "priceDesc", default: name
                "price" => query.OrderBy(p => p.Price),
                "priceDesc" => query.OrderByDescending(p => p.Price),
                _ => query.OrderBy(p => p.Name)
            };

            return query;
        }

        public static IQueryable<Product> Search(this IQueryable<Product> query, string searchTerm)
        {
            if (string.IsNullOrWhiteSpace(searchTerm)) return query;

            var lowerCaseSearchTerm = searchTerm.Trim().ToLower();

            return query.Where(p=>p.Name.ToLower().Contains(lowerCaseSearchTerm));
        }

        public static IQueryable<Product> Filter(this IQueryable<Product> query, string brands, string types)
        {
            var brandList = new List<string>();
            var typeList = new List<string>();

            // if not null convert from IEnumerable to List and add to list
            if (!string.IsNullOrWhiteSpace(brands)) 
                brandList.AddRange(brands.ToLower().Split(",").ToList());

            if (!string.IsNullOrWhiteSpace(types))
                typeList.AddRange(types.ToLower().Split(",").ToList());

            // if count is == 0,  brandList.Count == 0 condition is always TRUE so 
            // going over item
            // where clause filters but going over it again (with query) doesn't reassign values only futher filters
            query = query.Where(p => brandList.Count == 0 || brandList.Contains(p.Brand.ToLower()));
            query = query.Where(p => typeList.Count == 0 || typeList.Contains(p.Type.ToLower()));

            return query;

        }
    }
}


