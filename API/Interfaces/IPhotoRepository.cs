using System;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Helpers;

namespace API.Interfaces
{
    public interface IPhotoRepository
    {
        Task<PagedList<PhotoForApprovalDto>> GetUnapprovedPhotos(PhotoParams photoParams);

        Task<Photo> GetPhoto(int id);

        void RejectPhoto(Photo photo);
        // void ApprovePhoto(int id);
    }
}
