using API.Data;
using API.Entities;
using API.Extensions;
using API.RequestHelpers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace API.Controllers
{
    // [ApiController] etc in BaseApiController
    public class ProductsController : BaseApiController
    {
        private readonly StoreContext _context; //underscore for private readonly field

        public ProductsController(StoreContext context) // "create and assign field context (for dependency injection)
        {
            this._context = context;
        }

        [HttpGet]                                     // [FromQuery] telling API to get from query ?= not in an object in body of request
        public async Task<ActionResult<PagedList<Product>>> GetProducts([FromQuery]ProductParams productParams)
        {
            var query = _context.Products
                .Sort (productParams.OrderBy)
                .Search(productParams.SearchTerm)
                .Filter(productParams.Brands, productParams.Types)
                .AsQueryable();


            var products = await PagedList<Product>.ToPagedList(query,
                productParams.PageNumber, productParams.PageSize);

            Response.AddPaginationHeader(products.MetaData); // should be serialized in JSON with camelCase

            return products;

        }

        [HttpGet("{id}")] // api/products/{id}
        public async Task<ActionResult<Product>> GetProduct(int id) 
        {
            var product = await _context.Products.FindAsync(id); // find value with given primary key
            if (product == null) return NotFound();

            return product;
        }

        
        [HttpGet("filters")]
        public async Task<IActionResult> GetFilters()
        {
            var brands = await _context.Products.Select(p => p.Brand).Distinct().ToListAsync();
            var types = await _context.Products.Select(p => p.Type).Distinct().ToListAsync();

            return Ok(new {brands, types});

        }
    }
}
