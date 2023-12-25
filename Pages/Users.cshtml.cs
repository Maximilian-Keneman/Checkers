using Checkers.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using MySql.Data.MySqlClient;

namespace Checkers.Pages
{
    public class UsersModel : Shared.LayoutModel
    {
        public List<User> Users { get; private set; } = new();
        public IActionResult OnGet()
        {
            try
            {
                UsersContext context = HttpContext.RequestServices.GetService<UsersContext>();
                Users = context.GetAllUsers();
                return Page();
            }
            catch (MySqlException)
            {
                return RedirectToPage("/Error");
            }
        }
    }
}
