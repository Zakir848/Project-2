namespace ECommerceAfternoon.Server.DTOs.Product
{
    public class ProductListDto
    {
        public int Id { get; set; }

        public string Name { get; set; } = string.Empty;
        public int Stock { get; set; }
        public int CategoryId { get; set; }
        public int ViewCount { get; set; } = 0;
        public string ImageUrl { get; set; } = string.Empty;
        public string CategoryName { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public decimal DiscountPrecent { get; set; }
        public decimal DiscountPrice { get; set; }

    }
}
