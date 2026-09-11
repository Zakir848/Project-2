using ECommerceAfternoon.Server.Entities;

namespace ECommerceAfternoon.Server.Repository
{
    public interface ICartRepository
    {
        Task<List<CartItem>> GetAllCartItemsAsync(int userId);
        Task<Cart?> GetCartByUserIdAsync(int userId);
        Task<Product?> GetProductByIdAsync(int productId);
        Task<CartItem?> GetCartItemAsync(int userId, int productId);
        Task<Cart?> GetCartAsync(int userId);
        Task<Cart> CreateAsync(Cart cart);
        Task<CartItem> UpdateQuantityAsync(int userId, int productId);        
        void ClearCart(Cart cart);
        void Delete(CartItem cart);
        void Update(Cart cart);
        Task<bool> SaveChangesAsync();
    }
}
