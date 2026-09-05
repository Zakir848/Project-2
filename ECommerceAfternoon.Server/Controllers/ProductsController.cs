using ECommerceAfternoon.Server.Data;
using ECommerceAfternoon.Server.DTOs.Product;
using ECommerceAfternoon.Server.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ECommerceAfternoon.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ProductsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll(
        [FromQuery] ProductQueryDto query)
        {
            var productsQuery = _context.Products
                .AsNoTracking()
                .Include(x => x.Category)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(query.Search))
            {
                productsQuery = productsQuery.Where(x =>
                    x.Name.Contains(query.Search) ||
                    x.Description.Contains(query.Search));
            }

            if (query.CategoryId.HasValue)
            {
                productsQuery = productsQuery.Where(x =>
                    x.CategoryId == query.CategoryId.Value);
            }

            if (query.MinPrice.HasValue)
            {
                productsQuery = productsQuery.Where(x =>
                    x.Price >= query.MinPrice.Value);
            }

            if (query.MaxPrice.HasValue)
            {
                productsQuery = productsQuery.Where(x =>
                    x.Price <= query.MaxPrice.Value);
            }

            productsQuery = query.Sort.ToLower() switch
            {
                "priceasc" =>
                    productsQuery.OrderBy(x => x.Price),

                "pricedesc" =>
                    productsQuery.OrderByDescending(x => x.Price),

                "nameasc" =>
                    productsQuery.OrderBy(x => x.Name),

                "namedesc" =>
                    productsQuery.OrderByDescending(x => x.Name),

                _ =>
                    productsQuery.OrderByDescending(x => x.CreatedAt)
            };

            var totalCount = await productsQuery.CountAsync();

            var pageSize = Math.Clamp(query.PageSize, 1, 50);

            var page = Math.Max(query.Page, 1);

            var products = await productsQuery
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(x => new ProductListDto
                {
                    Id = x.Id,
                    Name = x.Name,
                    Price = x.Price,
                    Stock = x.Stock,
                    ImageUrl = x.ImageUrl,
                    CategoryId = x.CategoryId,
                    CategoryName = x.Category.Name,
                    DiscountPrecent = x.DiscountPrecent,
                    DiscountPrice = x.Price - (x.Price * (x.DiscountPrecent / 100))
                })
                .ToListAsync();

            var totalPages = (int)Math.Ceiling(
                totalCount / (double)pageSize);

            var result = new PagedResultDto<ProductListDto>
            {
                Items = products,
                Page = page,
                PageSize = pageSize,
                TotalCount = totalCount,
                TotalPages = totalPages
            };

            return Ok(result);
        }

        [HttpGet("discounted")]
        public async Task<IActionResult> GetDiscountPrecent()
        {
            var discountedProducts = await _context.Products.Select(x => new ProductListDto
            {

            }).Where(d => d.DiscountPrecent > 0).ToListAsync();

            return Ok(discountedProducts);
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {   
            var avg = await _context.ProductReviews.Where(r => r.ProductId == id).AverageAsync(r => (float?)r.Rating) ?? 0.0;

            var product = await _context.Products
                .AsNoTracking()
                .Include(x => x.Category).Select(x => new ProductListDto
                {
                    Id = x.Id,
                    Name = x.Name,
                    Description = x.Description,
                    Stock = x.Stock,
                    Price = x.Price,
                    ViewCount = x.ViewCount,
                    ImageUrl = x.ImageUrl,
                    CategoryId = x.Category.Id,
                    CategoryName = x.Category.Name,
                    DiscountPrecent = x.DiscountPrecent,
                    DiscountPrice = x.Price - (x.Price * (x.DiscountPrecent / 100)),
                    RatingAvg = avg
                })
                .FirstOrDefaultAsync(x => x.Id == id);

            if (product is null)
                return NotFound();

            return Ok(product);
        }

        [HttpGet("{id:int}/reviews")]
        public async Task<IActionResult> GetReview(int id)
        {

            var product = await _context.Products.AnyAsync(i => i.Id == id);

            if (!product)
            {
                return NotFound();
            }
           
            var commits = _context.ProductReviews.Where(p => p.ProductId == id).
                Select(x => new ProductReviewListDto
                {
                    Id = x.Id,
                    UserId = x.UserId,
                    UserFirstName = x.User.FirstName,
                    UserLastName = x.User.LastName,                    
                    ProductId = x.Product.Id,
                    Commit = x.Commit,
                    Rating = x.Rating
                }).ToList();

            return Ok(commits);

        }

        [HttpPost("{id:int}/add-reviews")]
        public async Task<IActionResult> CreateReview(int id, [FromBody] CreateProductReviewDto dto)
        {

            var product = await _context.Products.FirstOrDefaultAsync(i => i.Id == id);

            if (product is null)
            {
                return NotFound("Product not found.");
            }

            var userExists = await _context.Users.FirstOrDefaultAsync(i => i.Id == dto.UserId);

            if (userExists == null)
            {
                return NotFound("User not found.");
            }

            var commits =  new ProductReview
            {
                UserId = userExists.Id,                
                Commit = dto.Commit,
                Rating = dto.Rating, 
                ProductId = product.Id,
            };

            _context.ProductReviews.Add(commits);

            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetReview), new { id = commits.Id }, commits);

        }

        [HttpPost]
        public async Task<IActionResult> Create(CreateProductDto dto)
        {
            var categoryExists = await _context.Categories
                .AnyAsync(x => x.Id == dto.CategoryId);

            if (!categoryExists)
                return BadRequest("Category does not exist.");

            var product = new Product
            {
                Name = dto.Name,
                Description = dto.Description,
                Price = dto.Price,
                Stock = dto.Stock,
                ImageUrl = dto.ImageUrl,
                CategoryId = dto.CategoryId
            };

            _context.Products.Add(product);

            await _context.SaveChangesAsync();

            return CreatedAtAction(
                nameof(GetById),
                new { id = product.Id },
                product
            );
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(
            int id,
            UpdateProductDto dto)
        {
            var product = await _context.Products
                .FirstOrDefaultAsync(x => x.Id == id);

            if (product is null)
                return NotFound();

            var categoryExists = await _context.Categories
                .AnyAsync(x => x.Id == dto.CategoryId);

            if (!categoryExists)
                return BadRequest("Category does not exist.");

            product.Name = dto.Name;
            product.Description = dto.Description;
            product.Price = dto.Price;
            product.Stock = dto.Stock;
            product.ImageUrl = dto.ImageUrl;
            product.CategoryId = dto.CategoryId;
            product.DiscountPrecent = dto.DiscountPrecent;

            await _context.SaveChangesAsync();

            return Ok(product);
        }

        [HttpPatch("{id:int}/update-discount")]
        public async Task<IActionResult> UpdateDiscount(int id, [FromBody] int discountPrecent)
        {
            var product = await _context.Products.SingleOrDefaultAsync(i => i.Id == id);

            if (product == null)
            {
                return NotFound();
            }

            product.DiscountPrecent = discountPrecent;

            await _context.SaveChangesAsync();

            return Ok(product);
        }

        [HttpPatch("{id:int}/incriment-view")]
        public async Task<IActionResult> IncrimentViewCount(int id)
        {
            var product = await _context.Products.SingleOrDefaultAsync(i => i.Id == id);

            if (product == null)
            {
                return NotFound();
            }

            product.ViewCount++;

            await _context.SaveChangesAsync();

            return Ok(new
            {
                product.Id,
                product.ViewCount
            });
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var product = await _context.Products
                .FirstOrDefaultAsync(x => x.Id == id);

            if (product is null)
                return NotFound();

            _context.Products.Remove(product);

            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
