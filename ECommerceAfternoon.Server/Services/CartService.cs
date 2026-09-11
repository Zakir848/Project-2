using ECommerceAfternoon.Server.DTOs.Cart;
using ECommerceAfternoon.Server.Entities;
using ECommerceAfternoon.Server.Repository;

namespace ECommerceAfternoon.Server.Services
{
    public class CartService : ICartService
    {
        private readonly ICartRepository _repository;

        public CartService(ICartRepository repository)
        {
            _repository = repository;
        }

        public async Task<bool> AddToCartAsync(int userId, AddToCartDto dto)
        {
            if (dto.Quantity <= 0)
                return false;

            var product = await _repository.GetProductByIdAsync(dto.ProductId);

            if (product is null || product.Stock < dto.Quantity)
                return false;          

            var cart = await _repository.GetCartByUserIdAsync(userId);

            if (cart is null)
            {
                cart = new Cart
                {
                    UserId = userId,                    
                };

                await _repository.CreateAsync(cart);
            }

            cart.Items ??= new List<CartItem>();

            var existingItem = cart.Items?
                .FirstOrDefault(x => x.ProductId == dto.ProductId && x.Cart.UserId == userId);

            if (existingItem is not null)
            {
                if (existingItem.Quantity + dto.Quantity > product.Stock)
                    return false;

                existingItem.Quantity += dto.Quantity;
            }
            else
            {
                cart.Items?.Add(new CartItem
                {
                    ProductId = dto.ProductId,
                    Quantity = dto.Quantity
                });
            }

            return await _repository.SaveChangesAsync();
        }

        public async Task<Cart> CreateCartAsync(Cart cart)
        {
            var newCart = await _repository.CreateAsync(cart);
            await _repository.SaveChangesAsync();
            return newCart;
        }

        public async Task<bool> DeleteCartAsync(int userId,int productId)
        {
            var cartItem = await _repository.GetCartItemAsync(userId, productId);
                        
            if (cartItem is null) 
                return false;

            _repository.Delete(cartItem);

            return await _repository.SaveChangesAsync();
        }

        public async Task<bool> DeleteAllCartItemsAsync(int userId)
        {
            var userCart = await _repository.GetCartAsync(userId);

            if (userCart is null)
                return false;

            _repository.ClearCart(userCart);

            return await _repository.SaveChangesAsync();
        }

        public async Task<List<CartItem>> GetAllCartItems(int userId)
        {
            return await _repository.GetAllCartItemsAsync(userId);
        }

        public async Task<Cart?> GetCartByUserIdAsync(int userId)
        {
            return await _repository.GetCartByUserIdAsync(userId);
        }

        public async Task<bool> SaveChangesAsync()
        {
            return await _repository.SaveChangesAsync();
        }

        public async Task<Cart> UpdateCartAsync(Cart cart)
        {
            _repository.Update(cart);

            await _repository.SaveChangesAsync();

            return cart;
        }

        public async Task<bool> UpdateQuantityAsync(int userId, int productId, int quantity)
        {
            if (quantity <= 0)
                return false;

           var product = await _repository.GetProductByIdAsync(productId);

            if(product is null)
                return false;

            if (quantity > product?.Stock)
                return false;

            var cartItem = await _repository.UpdateQuantityAsync(userId,productId);

            if (cartItem is null)
                return false;
                       

            cartItem.Quantity = quantity;

            return await _repository.SaveChangesAsync();
        }
    }
}
