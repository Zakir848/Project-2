using ECommerceAfternoon.Server.Data;
using ECommerceAfternoon.Server.DTOs.Cart;
using ECommerceAfternoon.Server.Entities;
using ECommerceAfternoon.Server.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ECommerceAfternoon.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CartController : ControllerBase
    {
        private readonly ICartService _cartService;

        public CartController(ICartService cartService)
        {
            _cartService = cartService;
        }

        [HttpGet("{userId:int}")]
        public async Task<IActionResult> GetCart(int userId)
        {
            var cart = await _cartService.GetAllCartItems(userId);
            
            return Ok(cart);
        }

        [HttpPost("{userId:int}/items")]
        public async Task<IActionResult> AddToCart(int userId, AddToCartDto dto)
        {
            var result = await _cartService.AddToCartAsync(userId, dto);

            if (!result)
            {
                return BadRequest();
            }

            return Ok(result);

        }

        [HttpPut("{userId:int}/items/{productId:int}")]
        public async Task<IActionResult> UpdateQuantity(int userId, int productId, [FromQuery] int quantity)
        {
            var result = await _cartService.UpdateQuantityAsync(
                userId,
                productId,
                quantity);

            return Ok(result);
        }

        [HttpDelete("{userId:int}/items/{productId:int}")]
        public async Task<IActionResult> RemoveFromCart(int userId, int productId)
        {
            var result = await _cartService.DeleteCartAsync(userId, productId);

            if (!result)
                return NotFound("Cart item not found.");

            return NoContent();
        }

        [HttpDelete("{userId:int}")]
        public async Task<IActionResult> ClearCart(int userId)
        {
            var result = await _cartService.DeleteAllCartItemsAsync(userId);

            return NoContent();
        }
    }
}
