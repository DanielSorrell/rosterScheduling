namespace RosterBackendAPI.Models
{
    /*
     * Model for finding employees available to work shifts for user defined day(s) and position(s) 
     */
    public class FindEmployees
    {
        public string[] Days { get; set; }

        public string[] Positions { get; set; }
    }
}
