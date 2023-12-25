using Checkers.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using MySql.Data.MySqlClient;

namespace Checkers.Pages
{
    public class GameModel : Shared.LayoutModel
    {
        public User Player { get; private set; }
        public IActionResult OnGet()
        {
            int? id = HttpContext.Session.GetInt32("userid");
            if (id.HasValue)
            {
                try
                {
                    UsersContext context = HttpContext.RequestServices.GetService<UsersContext>();
                    Player = context.GetUser(id.Value);
                    return Page();
                }
                catch (MySqlException)
                {
                    return RedirectToPage("/Error");
                }
            }
            else
            {
                Player = new User { Name = "Гость" };
                    return Page();
            }
        }
    }
}
