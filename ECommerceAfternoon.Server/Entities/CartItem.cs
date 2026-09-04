namespace ECommerceAfternoon.Server.Entities
{
    public class CartItem
    {
        public int Id { get; set; }
        public int CartId { get; set; }
        public Cart Cart { get; set; }
        public int ProductId { get; set; }
        public Product Product { get; set; } = null!;
        public int Quantity { get; set; }
        public decimal SubTotal => (Product.Price - (Product.Price * (Product.DiscountPrecent / 100))) * Quantity;
    }
}
