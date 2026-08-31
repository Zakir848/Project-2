using ECommerceAfternoon.Server.Entities;

namespace ECommerceAfternoon.Server.Services
{
    public interface IJwtService
    {
        Task<string> GenerateAccessTokenAsync(ApplicationUser user);
        DateTime GetAccessTokenExpiration();
    }
}
