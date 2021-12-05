using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class AdminController : BaseApiController
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IPhotoService _photoService;
        public AdminController(UserManager<AppUser> userManager,
        IUnitOfWork unitOfWork,
        IPhotoService photoService)
        {
            _photoService = photoService;
            _unitOfWork = unitOfWork;
            _userManager = userManager;
        }

        [Authorize(Policy = "RequireAdminRole")]
        [HttpGet("users-with-roles")]
        public async Task<ActionResult> GetUsersWithRoles()
        {
            var users = await _userManager.Users
                .Include(r => r.UserRoles)
                .ThenInclude(r => r.Role)
                .OrderBy(u => u.UserName)
                .Select(u => new
                {
                    u.Id,
                    Username = u.UserName,
                    Roles = u.UserRoles.Select(r => r.Role.Name).ToList()
                })
                .ToListAsync();

            return Ok(users);
        }

        [HttpPost("edit-roles/{username}")]
        public async Task<ActionResult> EditRoles(string username, [FromQuery] string roles)
        {
            var selectedRoles = roles.Split(",").ToArray();

            var user = await _userManager.FindByNameAsync(username);

            if (user == null)
                return NotFound("Could not find user");

            var userRoles = await _userManager.GetRolesAsync(user);

            var result = await _userManager.AddToRolesAsync(user, selectedRoles.Except(userRoles));

            if (!result.Succeeded)
                return BadRequest("Failed to add to roles");

            result = await _userManager.RemoveFromRolesAsync(user, userRoles.Except(selectedRoles));

            if (!result.Succeeded)
                return BadRequest("Failed to remove from roles");

            return Ok(await _userManager.GetRolesAsync(user));
        }

        [Authorize(Policy = "ModeratePhotoRole")]
        [HttpGet("photos-to-moderate")]
        public async Task<ActionResult<IEnumerable<PhotoForApprovalDto>>> GetPhotosForModeration([FromQuery] PhotoParams photoParams)
        {
            var photos = await _unitOfWork.PhotoRepository.GetUnapprovedPhotos(photoParams);

            Response.AddPaginationHeader(photos.CurrentPage,
            photos.PageSize,
            photos.TotalCount,
            photos.TotalPages);

            return Ok(photos);
        }

        [Authorize(Policy = "ModeratePhotoRole")]
        [HttpPost("reject-photo/{id}")]
        public async Task<ActionResult> RejectPhoto(int id)
        {
            var username = User.GetUsername();

            var photo = await _unitOfWork.PhotoRepository.GetPhoto(id);

            if (photo == null)
                return NotFound("Photo not found");

            if (photo.PublicId != null)
            {
                var result = await _photoService.DeletePhotoAsync(photo.PublicId);
                if (result.Error != null) return BadRequest(result.Error.Message);
            }

            _unitOfWork.PhotoRepository.RejectPhoto(photo);

            if (await _unitOfWork.Complete())
                return Ok();

            return BadRequest("Failed to reject photo");
        }

        [Authorize(Policy = "ModeratePhotoRole")]
        [HttpPost("approve-photo/{id}")]
        public async Task<ActionResult> ApprovePhoto(int id)
        {
            // var user = await _unitOfWork.UserRepository.GetUserByUsernameAsync(User.GetUsername());

            // var photo = user.Photos.FirstOrDefault(x => x.Id == id);

            var photo = await _unitOfWork.PhotoRepository.GetPhoto(id);

            if (photo == null)
                return NotFound("photo id: " + id.ToString() + " not found");

            // _unitOfWork.PhotoRepository.ApprovePhoto(photo.Id);

            if(!photo.isApproved)
            {
                photo.isApproved = true;
            }

            var user = await _unitOfWork.UserRepository.GetUserByUsernameAsync(photo.AppUser.UserName);

            // var photos = user.Photos;

            if(!user.Photos.Any(x => x.IsMain))
                photo.IsMain = true;

            if (await _unitOfWork.Complete())
                return NoContent();

            return BadRequest("Failed to approve photo");
        }
    }
}
