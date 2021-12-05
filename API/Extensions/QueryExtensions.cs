using System;
using System.Linq;
using API.Entities;
 
namespace API.Extensions
{
    public static class QueryableExtensions
    {
        public static IQueryable<Message> MarkUnreadAsRead(this IQueryable<Message> query, string currentUsername)
        {
            var unreadMessages = query.Where(m => m.DateRead == null
                && m.RecipientUsername == currentUsername);
 
            if (unreadMessages.Any())
            {
                foreach (var message in unreadMessages)
                {
                    message.DateRead = DateTime.UtcNow;
                }
            }
 
            return query;
        }

        // public static IQueryable<Photo> ApprovePhoto(this IQueryable<Photo> query, int id)
        // {
        //     var photoforApproval = query.Where(p => !p.isApproved && p.Id == id).SingleOrDefault();
 
        //     if (photoforApproval != null)
        //     {
        //         photoforApproval.isApproved = true;
               
        //     }
 
        //     return query;
        // }
    }
}
