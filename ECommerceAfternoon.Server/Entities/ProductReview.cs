namespace ECommerceAfternoon.Server.Entities
{
    public class ProductReview
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public int UserId { get; set; }
        public ApplicationUser User { get; set; } = null!;
        public string Commit { get; set; } = string.Empty;
        public double Rating { get; set; }
        public Product Product { get; set; } = null!;
        public DateTime CreateDate { get; set; } = DateTime.UtcNow;
    }
}
