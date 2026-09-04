using ECommerceAfternoon.Server.Entities;

namespace ECommerceAfternoon.Server.DTOs.Product
{
    public class ProductReviewListDto
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public int UserId { get; set; }
        public string UserFirstName { get; set; } = string.Empty;
        public string UserLastName { get; set; } = string.Empty;
        public string Commit { get; set; } = string.Empty;
        public double Rating { get; set; }
    }
}
