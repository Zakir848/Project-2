using ECommerceAfternoon.Server.Entities;
using ECommerceAfternoon.Server.Repository;
using ECommerceAfternoon.Server.Services;
using Moq;
using System.Collections;
namespace ECommerce.Test.Services
{
    public class CartServicesTest
    {
        private Mock<ICartRepository> _cartRepositoryMock = null!;
        private CartService _cartService = null!;

        [SetUp]
        public void Setup()
        {
            _cartRepositoryMock = new Mock<ICartRepository>();
            _cartService = new CartService(_cartRepositoryMock.Object);
        }

        [Test]
        public async Task Get_Should_Show_User_CartItems()
        {
            // Arrange
            var cart = new Cart
            {
                Id = 1,
                UserId = 1,
            };

            _cartRepositoryMock
                .Setup(x => x.GetCartByUserIdAsync(cart.UserId))
                .ReturnsAsync(cart);

            //Act
            var result = await _cartService.GetCartByUserIdAsync(cart.UserId);

            //Assert
            Assert.That(result, Is.Not.Null);

        }

        [Test]
        public async Task GetAllCartItems_Should_Return_Items_For_Given_User()
        {
            // Arrange
            const int userId = 1;

            var cart = new Cart
            {
                Id = 1,
                UserId = userId
            };

            var items = new List<CartItem>
            {
                new CartItem()
                {
                    Id = 1,
                    CartId = cart.Id,
                    Cart = cart,
                    ProductId = 1,
                    Quantity = 2
                },
                new CartItem()
                {
                    Id = 2,
                    CartId = cart.Id,
                    Cart = cart,
                    ProductId = 2,
                    Quantity = 3
                }
            };

            _cartRepositoryMock
                .Setup(x => x.GetAllCartItemsAsync(userId))
                .ReturnsAsync(items);

            // Act
            var result = await _cartService.GetAllCartItems(userId);

            // Assert

            Assert.That(result, Is.Not.Null);
            Assert.That(result.Count, Is.EqualTo(2));
            Assert.That(result.All(x => x.Cart.UserId == userId), Is.True);
            Assert.That(result[0].Id, Is.EqualTo(1));
            Assert.That(result[1].Id, Is.EqualTo(2));


            _cartRepositoryMock.Verify(
                x => x.GetAllCartItemsAsync(userId),
                Times.Once);
        }

        [Test]
        public async Task Get_CartItem_UpdateQuantityAsync_ReturnsUpdatedQuantity()
        {
            //Arrange
            var cartItem = new CartItem
            {
                Id = 1,
                ProductId = 1,
                Product = new Product
                {
                    Id = 1,
                    Name = "Test",
                    Stock = 50,
                    Price = 70,
                },
                Cart = new Cart
                {
                    Id = 1,
                    UserId = 1
                },
                CartId = 1,
                Quantity = 1
            };

            _cartRepositoryMock
                .Setup(x => x.UpdateQuantityAsync(1, 1))
                .ReturnsAsync(cartItem);

            _cartRepositoryMock
                .Setup(x => x.GetProductByIdAsync(1))
                .ReturnsAsync(cartItem.Product);

            _cartRepositoryMock
                .Setup(x => x.SaveChangesAsync())
                .ReturnsAsync(true);


            //Act
            var result = await _cartService.UpdateQuantityAsync(1, 1, 10);


            //Assert
            Assert.That(result, Is.EqualTo(true));
            Assert.That(cartItem.Quantity, Is.EqualTo(10));


            _cartRepositoryMock.Verify(x => x.SaveChangesAsync(), Times.Once);
        }

        [Test]
        public async Task Get_Should_Return_Null_When_Cart_Does_Not_Exists()
        {
            //Arrange
            _cartRepositoryMock
                .Setup(x => x.GetCartByUserIdAsync(999))
                .ReturnsAsync((Cart?)null);

            //Act

            var result = await _cartService.GetCartByUserIdAsync(999);

            //Assert
            Assert.That(result, Is.Null);
        }

        //[Test]
        //public async Task Get
    }
}
