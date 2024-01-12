namespace RosterBackendAPI.Models
{
    public class Position
    {
        public Guid Id { get; set; }

        public Guid EmployeeID { get; set; }

        public string Title { get; set; }

        public double Rate { get; set; }
    }
}
