using ECommerceAfternoon.Server.DTOs.Product;

namespace ECommerceAfternoon.Server.DTOs.Wishlist
{
    public class CreateWishlistDto
    {
        public int ProductId { get; set; }
        public int UserId { get; set; }
        public ProductListDto Product { get; set; } = null!;
    }
}