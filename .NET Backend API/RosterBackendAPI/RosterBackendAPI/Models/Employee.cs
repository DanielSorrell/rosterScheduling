using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RosterBackendAPI.Models
{
    public class Employee
    {
        public Guid Id { get; set; }

        public string PreferredName { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }

        public string Address { get; set; }

        public int NumOfAvailDaysAWeek { get; set; }

        public bool EverydayAvailability { get; set; }

        public bool MondayAvailability { get; set; }

        public bool TuesdayAvailability { get; set; }

        public bool WednesdayAvailability { get; set; }

        public bool ThursdayAvailability { get; set; }

        public bool FridayAvailability { get; set; }

        public bool SaturdayAvailability { get; set; }

        public bool SundayAvailability { get; set; }
    }
}
