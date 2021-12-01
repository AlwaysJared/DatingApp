using System.Threading.Tasks;
using API.Enitities;

namespace API.Interfaces
{
    public interface ITokenService
    {
        Task<string> CreateToken(AppUser user);
    }
}