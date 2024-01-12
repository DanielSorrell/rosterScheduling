namespace RosterBackendAPI.Models
{
    public class NewEmployee
    {
        public Employee Employee { get; set; }

        public string[] Positions { get; set; }
    }
}
