using Checkers.Models;
using Microsoft.AspNetCore.Mvc;

namespace Checkers.Contollers
{
    [Controller]
    public class GameEndController : Controller
    {
        [HttpGet]
        [Route("GameEnd")]
        public void SaveGameResult(bool isPlayerWin)
        {
            int? id = HttpContext.Session.GetInt32("userid");
            if (id.HasValue)
            {
                UsersContext context = HttpContext.RequestServices.GetService<UsersContext>();
                context.ChangeUser(id.Value, isPlayerWin);
            }
        }
    }
}
