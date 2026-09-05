namespace ECommerceAfternoon.Server.DTOs.Wishlist
{
    public class WishlistDto
    {
        public int ProductId { get; set; }
        public int UserId { get; set; }
        public int ProductStock { get; set; }
        public string ProductCategoryName { get; set; } = string.Empty;
        public string ProductName { get; set; } = string.Empty;
        public string ProductImageUrl { get; set; } = string.Empty;
        public decimal ProductDiscountPrecent { get; set; }
        public decimal ProductPrice { get; set; }
        public decimal ProductDiscountPrice { get; set; }
    }
}
