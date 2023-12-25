using MySql.Data.MySqlClient;

namespace Checkers.Models
{
    public class UsersContext
    {
        public string ConnectionString { get; set; }

        public UsersContext(string connectionString)
        {
            ConnectionString = connectionString;
        }

        public MySqlConnection GetConnection() => new MySqlConnection(ConnectionString);

        public List<User> GetAllUsers()
        {
            List<User> users = new();
            using (MySqlConnection conn = GetConnection())
            {
                conn.Open();
                MySqlCommand cmd = new("SELECT * FROM Users ", conn);
                using MySqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    users.Add(new User
                    {
                        ID = reader.GetInt32("ID"),
                        Login = reader.GetString("Login"),
                        Password = reader.GetString("Password"),
                        Email = reader.GetString("Email"),
                        Name = reader.GetString("Name"),
                        PlayedGames = reader.GetInt32("PlayedGames"),
                        WinsGames = reader.GetInt32("WinsGames")
                    });
                }
            }
            return users;
        }
        public int GetUser(string login, string password)
        {
            using MySqlConnection conn = GetConnection();
            conn.Open();
            MySqlCommand cmd = new($"SELECT ID, Password FROM Users WHERE Users.Login = '{login}'", conn);
            using MySqlDataReader reader = cmd.ExecuteReader();
            if (reader.HasRows)
            {
                reader.Read();
                if (reader.GetString("Password") == password)
                    return reader.GetInt32("ID");
                else
                    return -1;
            }
            else
                return -2;
        }
        public User GetUser(int id)
        {
            using MySqlConnection conn = GetConnection();
            conn.Open();
            MySqlCommand cmd = new($"SELECT * FROM Users WHERE Users.ID = {id}", conn);
            using MySqlDataReader reader = cmd.ExecuteReader();
            while (reader.Read())
            {
                return new User
                {
                    ID = reader.GetInt32("ID"),
                    Login = reader.GetString("Login"),
                    Password = reader.GetString("Password"),
                    Email = reader.GetString("Email"),
                    Name = reader.GetString("Name"),
                    PlayedGames = reader.GetInt32("PlayedGames"),
                    WinsGames = reader.GetInt32("WinsGames")
                };
            }
            return null;
        }
        public bool AddNewUser(string login, string password, string email, out int id)
        {
            using MySqlConnection conn = GetConnection();
            conn.Open();
            MySqlCommand cmd = new("", conn);

            id = -2;
            cmd.CommandText = $"SELECT * FROM Users WHERE Users.Login = '{login}'";
            using (MySqlDataReader reader = cmd.ExecuteReader())
                if (reader.HasRows)
                    return false;

            id = 0;
            cmd.CommandText = $"SELECT ID FROM Users ORDER BY ID";
            using (MySqlDataReader reader = cmd.ExecuteReader())
                while (reader.Read())
                    if (id == reader.GetInt32("ID"))
                        id++;
                    else
                        break;

            cmd.CommandText = $"INSERT Users VALUES ({id}, '{login}', '{password}', '{email}', '{login}', {0}, {0})";
            cmd.ExecuteNonQuery();
            return true;
        }

        public void ChangeUser(int id, bool isPlayerWin)
        {
            using MySqlConnection conn = GetConnection();
            conn.Open();
            MySqlCommand cmd = new("", conn);

            int games, wins;
            cmd.CommandText = $"SELECT PlayedGames, WinsGames FROM Users WHERE Users.ID = '{id}'";
            using (MySqlDataReader reader = cmd.ExecuteReader())
            {
                reader.Read();
                games = reader.GetInt32("PlayedGames");
                wins = reader.GetInt32("WinsGames");
            }

            games++;
            if (isPlayerWin)
                wins++;
            cmd.CommandText = $"UPDATE Users SET PlayedGames = {games}, WinsGames = {wins} WHERE Users.ID = '{id}'";
            cmd.ExecuteNonQuery();
        }

        public void ChangeUser(int id, string name, string email)
        {
            using MySqlConnection conn = GetConnection();
            conn.Open();
            MySqlCommand cmd = new($"UPDATE Users SET Name = '{name}', Email = '{email}' WHERE Users.ID = '{id}'", conn);
            cmd.ExecuteNonQuery();
        }
        public void ChangeUser(int id, string password, string name, string email)
        {
            using MySqlConnection conn = GetConnection();
            conn.Open();
            MySqlCommand cmd = new($"UPDATE Users SET Password = '{password}', Name = '{name}', Email = '{email}' WHERE Users.ID = '{id}'", conn);
            cmd.ExecuteNonQuery();
        }

        public void RemoveUser(int id)
        {
            using MySqlConnection conn = GetConnection();
            conn.Open();
            MySqlCommand cmd = new($"DELETE FROM Users WHERE Users.ID = '{id}'", conn);
            cmd.ExecuteNonQuery();
        }
    }
    public class User
    {
        private UsersContext context;
        public int ID { get; set; }
        public string Login { get; set; }
        public string Password { get; set; }
        public string Email { get; set; }
        public string Name { get; set; }
        public int PlayedGames { get; set; }
        public int WinsGames { get; set; }
    }
}
