using System;

namespace API.Interfaces
{
    public interface IEmailService
    {
        Task SendEmailAsync(Email email);
    }
}
