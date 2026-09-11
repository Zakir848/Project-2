using ECommerceAfternoon.Server.Data;
using ECommerceAfternoon.Server.Entities;
using Microsoft.EntityFrameworkCore;

namespace ECommerceAfternoon.Server.Repository
{
    public class CartRepository : ICartRepository
    {
        private readonly AppDbContext _context;

        public CartRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<CartItem>> GetAllCartItemsAsync(int userId)
        {
            return await _context.CartItems.ToListAsync();
        }

        public async Task<Cart?> GetCartByUserIdAsync(int userId)
        {
            return await _context.Carts
                .Include(i => i.Items)
                .ThenInclude(p => p.Product)
                .FirstOrDefaultAsync(c => c.UserId == userId);
        }

        public async Task<Cart> CreateAsync(Cart cart)
        {
            await _context.Carts.AddAsync(cart);

            return cart;
        }

        public void Delete(CartItem cartItem)
        {
            _context.CartItems.Remove(cartItem);
        }

        public void Update(Cart cart)
        {
            _context.Carts.Update(cart);
        }

        public async Task<bool> SaveChangesAsync()
        {
            return (await _context.SaveChangesAsync() > 0);
        }

        public async Task<Product?> GetProductByIdAsync(int productId)
        {
            return await _context.Products.FirstOrDefaultAsync(p => p.Id == productId);
        }

        public async Task<CartItem?> UpdateQuantityAsync(int userId, int productId)
        {

            var item = await GetCartItemAsync(userId, productId);

            _context.CartItems.Update(item!);

            return item;
        }

        public async Task<CartItem?> GetCartItemAsync(int userId, int productId)
        {
            return await _context.CartItems
                .Include(i=> i.Cart)
                .Include(p=> p.Product)
                .FirstOrDefaultAsync(f=> f.ProductId == productId && f.Cart.UserId == userId);
        }

        public async Task<Cart?> GetCartAsync(int userId)
        {
            return await _context.Carts.FirstOrDefaultAsync(f => f.UserId == userId);
        }

        public void ClearCart(Cart cart)
        {
            _context.Carts.RemoveRange(cart);
        }
    }
}
