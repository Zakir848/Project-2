using ECommerceAfternoon.Server.Entities;

namespace ECommerceAfternoon.Server.Services
{
    public interface IRefreshTokenService
    {
        RefreshToken Generate(int userId);
    }
}
