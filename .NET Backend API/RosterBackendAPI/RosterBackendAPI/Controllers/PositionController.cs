using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RosterBackendAPI.Data;
using RosterBackendAPI.Models;

namespace RosterBackendAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PositionController : Controller
    {
        private readonly RosterBackendAPIDbContext _RosterBackendAPIDbContext;
        public PositionController(RosterBackendAPIDbContext rosterBackendAPIDbContext)
        {
            _RosterBackendAPIDbContext = rosterBackendAPIDbContext;
        }

        /*
         * Takes a newly created position and adds it to the database
         */
        [HttpPost("add")]
        public async Task<IActionResult> AddPosition([FromBody] Position positionRequest)
        {
            positionRequest.Id = Guid.NewGuid();
            await _RosterBackendAPIDbContext.Positions.AddAsync(positionRequest);
            await _RosterBackendAPIDbContext.SaveChangesAsync();
            return Ok(positionRequest);
        }

        /*
         * Returns all unique position titles found in the database
         */
        [HttpGet]
        public async Task<IActionResult> GetAllPositions()
        {
            //Grab all positions then filter out the unique position titles 
            var positions = await _RosterBackendAPIDbContext.Positions.ToListAsync();
            HashSet<string> positionList = new HashSet<string>();
            HashSet<Position> positionsFormatted = new HashSet<Position>();
            foreach (var position in positions)
            {
                if (!positionList.Contains(position.Title))
                {
                    positionList.Add(position.Title);
                    positionsFormatted.Add(position);
                }
            }
            return Ok(positionsFormatted);
        }

        /*
         * Takes a position title, finds the position matching the same title in the database, and returns it
         */
        [HttpGet]
        [Route("{title}")] //Title of position to find and return
        public async Task<IActionResult> GetPosition([FromRoute] string title)
        {
            var position = _RosterBackendAPIDbContext.Positions.FirstOrDefault(x => x.Title == title);
            if(position == null)
            {
                return NotFound();
            } else {
                return Ok(position);
            }
        }

        /*
         * Takes an employee id, finds all positions matching employee id in the database, and returns them
         */
        [HttpGet]
        [Route("{id:Guid}")] //Id of employee to find positions for
        public async Task<IActionResult> GetPositionsByEmployee([FromRoute] Guid id)
        {
            var positions =
                from Position in _RosterBackendAPIDbContext.Positions.Where(x =>
                    x.EmployeeID == id)
                select Position;

            if(positions.Any()) { 
                return Ok(positions);
            } else
            {
                return NotFound();
            }
        }

        /*
         * Takes a user updated position, finds matching position in the database, saves the new position, and returns it  
         */
        [HttpPut]
        [Route("update/{positionTitle}")] //Title of position to find and update
        public async Task<IActionResult> UpdatePosition([FromRoute] string positionTitle, Position updatePositionRequest)
        {
            var positions =
               from Position in _RosterBackendAPIDbContext.Positions.Where(x =>
                   x.Title == positionTitle)
               select Position;

            foreach (var position in positions)
            {
                position.Title = updatePositionRequest.Title;
                position.Rate = updatePositionRequest.Rate;
            }

            if (positions == null)
            {
                return NotFound();
            }

            await _RosterBackendAPIDbContext.SaveChangesAsync();
            return Ok();
        }

        /*
         * Takes a position title and employee id, finds the matching position in the database, deletes position from database and returns the position
         */
        [HttpDelete]
        [Route("deleteEmployee/{id:Guid}/{title}")] //Employee id and position title
        public async Task<IActionResult> DeletePosition([FromRoute] Guid id, string title)
        {
            var position = _RosterBackendAPIDbContext.Positions.FirstOrDefault(x => x.Title == title && x.EmployeeID == id);

            if (position == null)
            {
                return NotFound();
            }

            _RosterBackendAPIDbContext.Positions.Remove(position);
            await _RosterBackendAPIDbContext.SaveChangesAsync();
            return Ok(position);
        }

        /*
         * Takes a position title, finds all positions with matching title in the database, and deletes them
         */
        [HttpDelete]
        [Route("delete/{title}")] //Title of positiion to delete
        public async Task<IActionResult> DeletePosition([FromRoute] string title)
        {
            var positions =
                from Position in _RosterBackendAPIDbContext.Positions.Where(x =>
                    x.Title == title)
                select Position;

            if (positions == null)
            {
                return NotFound();
            }

            _RosterBackendAPIDbContext.Positions.RemoveRange(positions);
            await _RosterBackendAPIDbContext.SaveChangesAsync();
            return Ok();
        }
    }
}
