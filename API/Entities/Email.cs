using System;
using Microsoft.AspNetCore.Http;

namespace API.Entities
{
    public class Email
    {
        public Email()
        {
        }
        public Email(string to, string subject, string body, List<IFormFile> attachments)
        {
            ToEmail = to;
            Subject = subject;
            Body = body;
            Attachments = attachments;
        }

        public string ToEmail { get; set; }
        public string Subject { get; set; }
        public string Body { get; set; }
        public List<IFormFile> Attachments { get; set; }
    }
}
