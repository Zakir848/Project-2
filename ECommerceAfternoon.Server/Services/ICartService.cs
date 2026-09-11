using ECommerceAfternoon.Server.DTOs.Cart;
using ECommerceAfternoon.Server.Entities;

namespace ECommerceAfternoon.Server.Services
{
    public interface ICartService
    {
        Task<List<CartItem>> GetAllCartItems(int userId);
        Task<Cart?> GetCartByUserIdAsync(int cartId);
        Task<Cart> CreateCartAsync(Cart cart);
        Task<Cart> UpdateCartAsync(Cart cart);
        Task<bool> UpdateQuantityAsync(int userId,int productId,int quantity);
        Task<bool> DeleteCartAsync(int userId,int productId);
        Task<bool> AddToCartAsync(int userId, AddToCartDto dto);
        Task<bool> DeleteAllCartItemsAsync(int userId);
        Task<bool> SaveChangesAsync();
    }
}
