using System;
using System.Text;
using API.DTOs;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;

namespace API.Controllers
{
    public class EmailController : BaseApiController
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly IEmailService _emailService;
        public EmailController(UserManager<AppUser> userManager, IEmailService emailService)
        {
            _emailService = emailService;
            _userManager = userManager;
        }

        // [HttpPost("send-test")]
        // public async Task<ActionResult> SendTest(ConfirmationEmailDto emailDto)
        // {
        //     var message = new Email();
        //     message.ToEmail = emailDto.ToEmail;
        //     message.Subject = "Test with html";
        //     message.Body = "This is a test email <a href='https://www.google.com' target='_blank'> Google </a>";
        //     try
        //     {
        //         await _emailService.SendEmailAsync(message);
        //         return Ok();
        //     }
        //     catch (Exception ex)
        //     {
        //         var serverError = StatusCode(Microsoft.AspNetCore.Http.StatusCodes.Status500InternalServerError, "Failed to send email");
        //         return serverError;
        //         throw (ex);
        //     }

        // }

        [HttpPost("send-email-confirmation")]
        public async Task<ActionResult> SendConfirmationLink(ConfirmationEmailDto emailDto)
        {
            var user = await _userManager.FindByEmailAsync(emailDto.ToEmail);

            if (user == null)
                return BadRequest("No user found for " + emailDto.ToEmail);

            if (user.EmailConfirmed == true)
                return BadRequest(emailDto.ToEmail + " is already confirmed");

            var confirmToken = await _userManager.GenerateEmailConfirmationTokenAsync(user);
            byte[] tokenGeneratedBytes = Encoding.UTF8.GetBytes(confirmToken);
            var tokenEncoded = WebEncoders.Base64UrlEncode(tokenGeneratedBytes);
            var param = new Dictionary<string, string>
            {
                {"token", tokenEncoded },
                {"email", user.Email }
            };
            var callback = QueryHelpers.AddQueryString(emailDto.ClientURI, param);

            var HtmlBody = string.Format("<h2><a href='{0}'; target='_blank';>Click me to confirm your email!</a></h2>", callback);

            var message = new Email();
            message.ToEmail = emailDto.ToEmail;
            message.Subject = "Email Confirmation";
            message.Body = HtmlBody;
            try
            {
                await _emailService.SendEmailAsync(message);
                return Ok();
            }
            catch (Exception ex)
            {
                var serverError = StatusCode(Microsoft.AspNetCore.Http.StatusCodes.Status500InternalServerError, "Failed to send email");
                return serverError;
                throw (ex);
            }

        }

        [HttpPost("send-password-reset")]
        public async Task<ActionResult> SendResetLink(ForgotPasswordDto forgotPasswordDto)
        {
            var user = await _userManager.FindByEmailAsync(forgotPasswordDto.ToEmail);

            if (user == null)
                return BadRequest("No user found for " + forgotPasswordDto.ToEmail);

            // if (user.EmailConfirmed == true)
            //     return BadRequest(emailDto.ToEmail + " is already confirmed");

            var resetToken = await _userManager.GeneratePasswordResetTokenAsync(user);
            byte[] tokenGeneratedBytes = Encoding.UTF8.GetBytes(resetToken);
            var tokenEncoded = WebEncoders.Base64UrlEncode(tokenGeneratedBytes);
            var param = new Dictionary<string, string>
            {
                {"token", tokenEncoded },
                {"email", user.Email }
            };
            var callback = QueryHelpers.AddQueryString(forgotPasswordDto.ClientURI, param);

            var HtmlBody = string.Format("<h2><a href='{0}'; target='_blank';>Click here to reset you password!</a></h2>", callback);

            var message = new Email();
            message.ToEmail = forgotPasswordDto.ToEmail;
            message.Subject = "Password Reset";
            message.Body = HtmlBody;
            try
            {
                await _emailService.SendEmailAsync(message);
                return Ok();
            }
            catch (Exception ex)
            {
                var serverError = StatusCode(Microsoft.AspNetCore.Http.StatusCodes.Status500InternalServerError, "Failed to send email");
                return serverError;
                throw (ex);
            }

        }
    }
}
