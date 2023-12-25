using Checkers.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace Checkers.Pages
{
    public class ProfileModel : Shared.LayoutModel
    {
        public User Player { get; private set; }
        public bool HasPlayer => Player != null;
        public bool IsSelfUser { get; private set; }
        public void OnGet(int id)
        {
            UsersContext context = HttpContext.RequestServices.GetRequiredService<UsersContext>();
            Player = context.GetUser(id);
            int? userid = HttpContext.Session.GetInt32("userid");
            IsSelfUser = HasPlayer && userid.HasValue && userid.Value == Player.ID;
        }
    }
}
