using Checkers.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace Checkers.Pages.Shared
{
    public class LayoutModel : PageModel
    {
        public IActionResult OnPostSignIn(string login, string password)
        {
            UsersContext context = HttpContext.RequestServices.GetService<UsersContext>();
            int id = context.GetUser(login, password);
            if (id >= 0)
            {
                HttpContext.Session.SetInt32("userid", id);
                return RedirectToPage("Index");
            }
            else
            {
                // TestString = id switch
                // {
                //     -1 => "Wrong password",
                //     -2 => "Wrong login",
                //     _ => "Something wrong"
                // };
                return Page();
            }
        }
        public IActionResult OnPostRegister(string login, string password, string repeatPassword, string email)
        {
            UsersContext context = HttpContext.RequestServices.GetService<UsersContext>();
            if (password == repeatPassword && context.AddNewUser(login, password, email, out int id))
            {
                HttpContext.Session.SetInt32("userid", id);
                return RedirectToPage("Index");
            }
            else
            {
                // TestString = id switch
                // {
                //     -1 => "Wrong password",
                //     -2 => "Wrong login",
                //     _ => "Something wrong"
                // };
                return Page();
            }
        }

        public string GetUserName()
        {
            int? id = HttpContext.Session.GetInt32("userid");
            if (id.HasValue)
            {
                UsersContext context = HttpContext.RequestServices.GetService<UsersContext>();
                return context.GetUser(id.Value).Name;
            }
            else
                return "Quest";
        }
    }
}
