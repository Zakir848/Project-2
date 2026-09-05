namespace ECommerceAfternoon.Server.DTOs.Product
{
    public class CreateProductReviewDto
    {
        public int UserId { get; set; }
        public string Commit { get; set; } = string.Empty;
        public float Rating { get; set; }
    }
}
