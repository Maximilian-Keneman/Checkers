using Checkers.Models;
using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;

namespace Checkers.Contollers
{
    [Controller]
    public class ProfileController : Controller
    {
        [Route("Profile/{id}")]
        public IActionResult Index(int id) => RedirectToPage("Profile", id);
        [Route("Profile/Friends")]
        public IActionResult Friends() => throw new NotImplementedException();
        [Route("Profile/Exit")]
        public IActionResult Exit()
        {
            HttpContext.Session.Remove("userid");
            return RedirectToPage("/Index");
        }
        [Route("Profile/Delete")]
        public IActionResult Delete()
        {
            try
            {
                int id = HttpContext.Session.GetInt32("userid").Value;
                UsersContext context = HttpContext.RequestServices.GetRequiredService<UsersContext>();
                context.RemoveUser(id);
                return Exit();
            }
            catch (MySqlException)
            {
                return RedirectToPage("/Error");
            }
        }
    }
}
