using Checkers.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace Checkers.Pages
{
    public class UsersModel : Shared.LayoutModel
    {
        public List<User> Users { get; private set; } = new();
        public void OnGet()
        {
            UsersContext context = HttpContext.RequestServices.GetService<UsersContext>();
            Users = context.GetAllUsers();
        }
    }
}
