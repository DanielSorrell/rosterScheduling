using Microsoft.EntityFrameworkCore;
using RosterBackendAPI.Models;

namespace RosterBackendAPI.Data
{
    public class RosterBackendAPIDbContext : DbContext
    {
        public RosterBackendAPIDbContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<Employee> Employees { get; set; }

        public DbSet<Position> Positions { get; set; }
    }
}
