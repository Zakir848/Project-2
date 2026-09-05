namespace ECommerceAfternoon.Server.Entities
{
    public class Wishlist
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public int UserId { get; set; }
        public Product Product { get; set; } = null!;
    }
}
