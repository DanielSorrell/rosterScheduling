using Microsoft.EntityFrameworkCore;
using RosterBackendAPI.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<RosterBackendAPIDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("Azure")));

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

/*
var local = "local";

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: local,
                      policy =>
                      {
                          policy.WithOrigins("http://localhost:4200");
                      });
});

app.UseCors(local);
*/

app.UseCors(policy => policy.WithOrigins("http://localhost:4200").AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin());

app.UseAuthorization();

app.MapControllers();

app.Run();
