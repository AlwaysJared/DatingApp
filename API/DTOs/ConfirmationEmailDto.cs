using System;

namespace API.DTOs
{
    public class ConfirmationEmailDto
    {
        public string ToEmail { get; set; }
        public string ClientURI { get; set; }
    }
}
