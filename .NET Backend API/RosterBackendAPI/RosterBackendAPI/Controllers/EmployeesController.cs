using Microsoft.AspNetCore.Mvc;
using RosterBackendAPI.Data;
using Microsoft.EntityFrameworkCore;
using RosterBackendAPI.Models;
using System.Reflection;
using System.Collections.Generic;
using System.Diagnostics;

namespace RosterBackendAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmployeesController : Controller
    {
        private readonly RosterBackendAPIDbContext _RosterBackendAPIDbContext;
        public EmployeesController(RosterBackendAPIDbContext rosterBackendAPIDbContext)
        {
            _RosterBackendAPIDbContext = rosterBackendAPIDbContext;
        }

        /*
         * Returns all employees found in the database
         */
        [HttpGet]
        public async Task<IActionResult> GetAllEmployees()
        {
            var employees = await _RosterBackendAPIDbContext.Employees.ToListAsync();
            return Ok(employees);
        }

        /*
         * Takes a position title, finds all employees qualified for the matching position, and returns them 
         */
        [HttpGet]
        [Route("findByQualifiedPosition/{positionTitle}")] //Title of position to find qualified employees for
        public async Task<IActionResult> FindEmployeesByQualifiedPosition([FromRoute] string positionTitle)
        {
            var qualifiedEmployees =
                from Employee in _RosterBackendAPIDbContext.Employees
                from Position in _RosterBackendAPIDbContext.Positions.Where(x =>
                    x.Title == positionTitle &&
                    Employee.Id == x.EmployeeID)
                select new
                {
                    Employee.Id,
                    Employee.PreferredName,
                    Employee.FirstName,
                    Employee.LastName,
                    Employee.NumOfAvailDaysAWeek,
                    Employee.EverydayAvailability,
                    Employee.MondayAvailability,
                    Employee.TuesdayAvailability,
                    Employee.WednesdayAvailability,
                    Employee.ThursdayAvailability,
                    Employee.FridayAvailability,
                    Employee.SaturdayAvailability,
                    Employee.SundayAvailability,
                };

            if(qualifiedEmployees.Any())
            {
                return Ok(qualifiedEmployees);
            } else
            {
                return NotFound();
            }
        }

        /*
         * Takes a set of available days during the week and position titles to find employees available for those shifts and returns them  
         */
        [HttpPost("find")]
        public async Task<IActionResult> FindEmployees([FromBody] FindEmployees findEmployeesRequest) //Object containing the days of the week and positions for those days to find available employees
        {
            Dictionary<Guid, HashSet<string>> availableEmployees = new Dictionary<Guid, HashSet<string>>();

            foreach (string position in findEmployeesRequest.Positions)
            {
                var matchingPositions =
                    from Employee in _RosterBackendAPIDbContext.Employees
                    from Position in _RosterBackendAPIDbContext.Positions.Where(x =>
                        x.Title == position &&
                        Employee.Id == x.EmployeeID)
                    select new
                    {
                        Employee.Id,
                        Employee.PreferredName,
                        Employee.FirstName,
                        Employee.LastName,
                        Employee.NumOfAvailDaysAWeek,
                        Employee.EverydayAvailability,
                        Employee.MondayAvailability,
                        Employee.TuesdayAvailability,
                        Employee.WednesdayAvailability,
                        Employee.ThursdayAvailability,
                        Employee.FridayAvailability,
                        Employee.SaturdayAvailability,
                        Employee.SundayAvailability,
                    };

                foreach (var employee in matchingPositions)
                {

                    HashSet<string> positions = new HashSet<string>();
                    Boolean flag = false;

                        //If the current employee is not available for at least one of the available days, flag employee as unavailable
                        foreach (string day in findEmployeesRequest.Days)
                        {
                            switch (day)
                            {
                                case "Mon":
                                    if (!Convert.ToBoolean(employee.MondayAvailability))
                                    {
                                        flag = true;
                                    }
                                    break;
                                case "Tue":
                                    if (!Convert.ToBoolean(employee.TuesdayAvailability))
                                    {
                                        flag = true;
                                    }
                                    break;
                                case "Wed":
                                    if (!Convert.ToBoolean(employee.WednesdayAvailability))
                                    {
                                        flag = true;
                                    }
                                    break;
                                case "Thu":
                                    if (!Convert.ToBoolean(employee.ThursdayAvailability))
                                    {
                                        flag = true;
                                    }
                                    break;
                                case "Fri":
                                    if (!Convert.ToBoolean(employee.FridayAvailability))
                                    {
                                        flag = true;
                                    }
                                    break;
                                case "Sat":
                                    if (!Convert.ToBoolean(employee.SaturdayAvailability))
                                    {
                                        flag = true;
                                    }
                                    break;
                                case "Sun":
                                    if (!Convert.ToBoolean(employee.SundayAvailability))
                                    {
                                        flag = true;
                                    }
                                    break;
                            }
                        }

                    if(flag)
                    {
                        availableEmployees.Remove(employee.Id);
                    } else
                    {
                        if (availableEmployees.ContainsKey(employee.Id))
                        {
                            availableEmployees[employee.Id].Add(position);
                        }
                        else
                        {
                            HashSet<string> positionList = new HashSet<string>();
                            positionList.Add(position);
                            availableEmployees.Add(employee.Id, positionList);
                        }
                    }
                }
            }

            return Ok(availableEmployees);
        }

        /*
         * Takes a new user defined employee, adds it to the database, and returns the employee 
         */
        [HttpPost("add")]
        public async Task<IActionResult> AddEmployee([FromBody] NewEmployee employeeRequest) //Object containing new employee information
        {
            employeeRequest.Employee.Id = Guid.NewGuid();
            await _RosterBackendAPIDbContext.SaveChangesAsync();
            foreach(string position in employeeRequest.Positions)
            {
                var positionInfo = _RosterBackendAPIDbContext.Positions.FirstOrDefault(x => x.Title == position);
                var newPosition = new Position
                {
                    EmployeeID = employeeRequest.Employee.Id,
                    Id = Guid.NewGuid(),
                    Title = positionInfo.Title,
                    Rate = positionInfo.Rate
                };
                await _RosterBackendAPIDbContext.Positions.AddAsync(newPosition);
                await _RosterBackendAPIDbContext.SaveChangesAsync();
            }
            
            return Ok(employeeRequest.Employee);
        }

        /*
         * Takes an employee id, finds the matching employee in the database, and returns the employee 
         */
        [HttpGet]
        [Route("{id:Guid}")] //Employee id of the employee to find
        public async Task<IActionResult> GetEmployee([FromRoute]Guid id) 
        {
            var employee = await _RosterBackendAPIDbContext.Employees.FirstOrDefaultAsync(x => x.Id == id);
            if(employee == null)
            {
                return NotFound();
            }

            return Ok(employee);
        }

        /*
         * Takes an employee id and user updated employee, finds the matching employee in the database, saves the updated employee, and returns the employee  
         */
        [HttpPut]
        [Route("update/{id:Guid}")] //Employee id of the employee to update
        public async Task<IActionResult> UpdateEmployee([FromRoute] Guid id, Employee updateEmployeeRequest)
        {
            var employee = await _RosterBackendAPIDbContext.Employees.FindAsync(id);

            if (employee == null)
            {
                return NotFound();
            }

            employee.PreferredName = updateEmployeeRequest.PreferredName;
            employee.FirstName = updateEmployeeRequest.FirstName;
            employee.LastName = updateEmployeeRequest.LastName;
            employee.Address = updateEmployeeRequest.Address;
            employee.NumOfAvailDaysAWeek = updateEmployeeRequest.NumOfAvailDaysAWeek;

            await _RosterBackendAPIDbContext.SaveChangesAsync();
            return Ok(employee);
        }

        /*
         * Takes an employee id, finds the matching employee in the database, and deletes the employee from the database
         */
        [HttpDelete]
        [Route("delete/{id:Guid}")] //Employee id of the employee to delete
        public async Task<IActionResult> DeleteEmployee([FromRoute] Guid id)
        {
            _RosterBackendAPIDbContext.Positions.RemoveRange(_RosterBackendAPIDbContext.Positions.Where(x => x.EmployeeID == id));
            _RosterBackendAPIDbContext.SaveChanges();

            var employee = await _RosterBackendAPIDbContext.Employees.FindAsync(id);
            if (employee == null)
            {
                return NotFound();
            }

            _RosterBackendAPIDbContext.Employees.Remove(employee);
            await _RosterBackendAPIDbContext.SaveChangesAsync();
            return Ok();
        }
    }
}
