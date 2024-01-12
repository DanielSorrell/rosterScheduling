namespace RosterBackendAPI.Models
{
    public class EmployeeReturn
    {
        public Guid Id { get; set; }

        public HashSet<string> Positions { get; set; }
    }
}
