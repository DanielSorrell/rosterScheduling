using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RosterBackendAPI.Migrations
{
    /// <inheritdoc />
    public partial class Employees : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Employees",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    PreferredName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    FirstName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    LastName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Address = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    NumOfAvailDaysAWeek = table.Column<int>(type: "int", nullable: false),
                    EverydayAvailability = table.Column<bool>(type: "bit", nullable: false),
                    MondayAvailability = table.Column<bool>(type: "bit", nullable: false),
                    TuesdayAvailability = table.Column<bool>(type: "bit", nullable: false),
                    WednesdayAvailability = table.Column<bool>(type: "bit", nullable: false),
                    ThursdayAvailability = table.Column<bool>(type: "bit", nullable: false),
                    FridayAvailability = table.Column<bool>(type: "bit", nullable: false),
                    SaturdayAvailability = table.Column<bool>(type: "bit", nullable: false),
                    SundayAvailability = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Employees", x => x.Id);
                });

            migrationBuilder.CreateTable(
               name: "Employees",
               columns: table => new
               {
                   Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                   PreferredName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                   FirstName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                   LastName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                   Address = table.Column<string>(type: "nvarchar(max)", nullable: true),
                   NumOfAvailDaysAWeek = table.Column<int>(type: "int", nullable: false),
                   EverydayAvailability = table.Column<bool>(type: "bit", nullable: false),
                   MondayAvailability = table.Column<bool>(type: "bit", nullable: false),
                   TuesdayAvailability = table.Column<bool>(type: "bit", nullable: false),
                   WednesdayAvailability = table.Column<bool>(type: "bit", nullable: false),
                   ThursdayAvailability = table.Column<bool>(type: "bit", nullable: false),
                   FridayAvailability = table.Column<bool>(type: "bit", nullable: false),
                   SaturdayAvailability = table.Column<bool>(type: "bit", nullable: false),
                   SundayAvailability = table.Column<bool>(type: "bit", nullable: false)
               },
               constraints: table =>
               {
                   table.PrimaryKey("PK_Employees", x => x.Id);
               });

            migrationBuilder.CreateTable(
                name: "Position",
                columns: table => new
                {
                    Title = table.Column<string>(type: "uniqueidentifier", nullable: false),
                    Rate = table.Column<double>(type: "double", nullable: true),
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Positions", x => x.Title);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {

        }
    }
}
