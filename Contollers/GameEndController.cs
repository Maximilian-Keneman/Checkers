using Checkers.Models;
using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;

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
                try
                {
                    UsersContext context = HttpContext.RequestServices.GetService<UsersContext>();
                    context.ChangeUser(id.Value, isPlayerWin);
                }
                catch (MySqlException)
                {
                    return;
                }
            }
        }
    }
}
