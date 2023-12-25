using Checkers.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace Checkers.Pages
{
    public class GameModel : Shared.LayoutModel
    {
        public User Player { get; private set; }
        public void OnGet()
        {
            int? id = HttpContext.Session.GetInt32("userid");
            if (id.HasValue)
            {
                UsersContext context = HttpContext.RequestServices.GetService<UsersContext>();
                Player = context.GetUser(id.Value);
            }
            else
            {
                Player = new User { Name = "Гость" };
            }
        }
    }
}
