using ECommerceAfternoon.Server.Data;
using ECommerceAfternoon.Server.DTOs.Wishlist;
using ECommerceAfternoon.Server.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace ECommerceAfternoon.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class UserController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UserController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("profile")]
        public IActionResult Profile()
        {
            return Ok(new
            {
                message = "You are authenticated.",
                userId = User.FindFirst(
                    ClaimTypes.NameIdentifier
                )?.Value,

                email = User.FindFirst(
                    ClaimTypes.Email
                )?.Value,

                role = User.FindFirst(
                   ClaimTypes.Role
                )?.Value
            });
        }

        [HttpPost("add-wishlist")]
        public async Task<ActionResult<CreateWishlistDto>> Create(int productId)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userIdClaim))
            {
                return Unauthorized("User not found.");
            }

            var currentUserId = int.Parse(userIdClaim);


            var productExists = await _context.Products.AnyAsync(i => i.Id == productId);

            if (!productExists)
            {
                return NotFound("Product not found.");
            }

            var alreadyExists = await _context.Wishlist
                .Where(w => w.ProductId == productId && w.UserId == currentUserId)
                .FirstOrDefaultAsync();

            if (alreadyExists != null)
            {
                _context.Wishlist.Remove(alreadyExists);
                await _context.SaveChangesAsync();
                return Ok("Product removed from wishlist.");
            }

            var wishlist = new Wishlist
            {
                ProductId = productId,
                UserId = currentUserId,
            };

            _context.Wishlist.Add(wishlist);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetWishlist), new { id = wishlist.Id }, wishlist);
        }

        [HttpGet("wishlist")]
        public async Task<ActionResult<WishlistDto>> GetWishlist()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            var currentUserId = int.Parse(userIdClaim!);

            var wishlist = await _context.Wishlist
                .AsNoTracking()
                .Where(u => u.UserId == currentUserId)
                .Include(x => x.Product)
                .ThenInclude(x => x.Category)
                .Select(x => new WishlistDto
                {
                    UserId = x.UserId,
                    ProductId = x.ProductId,
                    ProductName = x.Product.Name,
                    ProductDiscountPrecent = x.Product.DiscountPrecent,
                    ProductPrice = x.Product.Price,
                    ProductDiscountPrice = x.Product.DiscountPrecent > 0 ? x.Product.Price - (x.Product.Price * (x.Product.DiscountPrecent / 100)) : x.Product.Price,
                    ProductStock = x.Product.Stock,
                    ProductImageUrl = x.Product.ImageUrl,
                    ProductCategoryName = x.Product.Category.Name,
                }).ToListAsync();

            if (wishlist == null || wishlist.Count == 0)
            {
                return NotFound("Wishlist is empty.");
            }

            return Ok(wishlist);
        }

    }
}
