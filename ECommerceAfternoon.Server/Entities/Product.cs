namespace ECommerceAfternoon.Server.Entities
{
    public class Product
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public int Stock { get; set; }
        public int ViewCount { get; set; } = 0;
        public int CategoryId { get; set; }
        public string ImageUrl { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public decimal DiscountPrecent { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public Category Category { get; set; } = null!;
        public ICollection<ProductReview> productReviews { get; set; } = null!;
    }
}
