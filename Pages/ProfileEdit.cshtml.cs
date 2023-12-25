using Checkers.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace Checkers.Pages
{
    public class ProfileEditModel : Shared.LayoutModel
    {
        public User Player { get; private set; }
        public IActionResult OnGet()
        {
            Player = GetUser();
            return Player != null ? Page() : RedirectToPage("/Index");
        }
        public IActionResult OnPostEdit(string username, bool passwordchanged, string password, string reppassword, string email)
        {
            int id = HttpContext.Session.GetInt32("userid").Value;
            UsersContext context = HttpContext.RequestServices.GetService<UsersContext>();
            if (passwordchanged)
            {
                if (!string.IsNullOrWhiteSpace(password) && password == reppassword)
                {
                    context.ChangeUser(id, password, username, email);
                    return RedirectToPage("/Profile/" + id);
                }
                else
                    return Page();
            }
            else
            {
                context.ChangeUser(id, username, email);
                return RedirectToPage("/Profile/" + id);
            }
        }

        public User GetUser()
        {
            int? id = HttpContext.Session.GetInt32("userid");
            if (id.HasValue)
            {
                UsersContext context = HttpContext.RequestServices.GetService<UsersContext>();
                return context.GetUser(id.Value);
            }
            else
                return null;
        }
    }
}
