﻿using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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

        [HttpGet]
        public async Task<ActionResult<List<Product>>> GetProducts()
        {
            return await _context.Products.ToListAsync(); // 200 response code?
        }

        [HttpGet("{id}")] // api/products/
        public async Task<ActionResult<Product>> GetProduct(int id) 
        {
            var product = await _context.Products.FindAsync(id); // find value with given primary key
            if (product == null) return NotFound();

            return product;
        }
    }
}
