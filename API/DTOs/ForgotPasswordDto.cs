using System;

namespace API.DTOs
{
    public class ForgotPasswordDto
    {
        public string ToEmail { get; set; }
        public string ClientURI { get; set; }
    }
}
