using System;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using API.Services;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class PhotoRepository : IPhotoRepository
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        public PhotoRepository(DataContext context, IMapper mapper)
        {
            _mapper = mapper;
            _context = context;
        }

        public void RejectPhoto(Photo photo)
        {
            _context.Photos.Remove(photo);
        }

        // public void ApprovePhoto(int id)
        // {
        //     _context.Photos.ApprovePhoto(id);
        // }

        public async Task<Photo> GetPhoto(int id)
        {
            return await _context.Photos
                .IgnoreQueryFilters()
                .Include(p => p.AppUser)
                .SingleOrDefaultAsync(x => x.Id == id);
        }

        public async Task<PagedList<PhotoForApprovalDto>> GetUnapprovedPhotos(PhotoParams photoParams)
        {
            var query = _context.Photos
                .IgnoreQueryFilters()
                .Where(p => p.isApproved == false)
                .ProjectTo<PhotoForApprovalDto>(_mapper.ConfigurationProvider)
                .AsQueryable();

            return await PagedList<PhotoForApprovalDto>.CreateAsync(query, photoParams.PageNumber, photoParams.PageSize);
        }
    }
}
