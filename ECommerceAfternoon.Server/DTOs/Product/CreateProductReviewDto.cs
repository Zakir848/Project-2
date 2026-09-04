namespace ECommerceAfternoon.Server.DTOs.Product
{
    public class CreateProductReviewDto
    {
        public int ProductId { get; set; }
        public int UserId { get; set; }
        public string Commit { get; set; } = string.Empty;
        public double Rating { get; set; }
    }
}
