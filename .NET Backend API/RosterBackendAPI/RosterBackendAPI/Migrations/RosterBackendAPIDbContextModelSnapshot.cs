﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using RosterBackendAPI.Data;

#nullable disable

namespace RosterBackendAPI.Migrations
{
    [DbContext(typeof(RosterBackendAPIDbContext))]
    partial class RosterBackendAPIDbContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "7.0.8")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);

            modelBuilder.Entity("RosterBackendAPI.Models.EmployeeQueryReturn", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("Address")
                        .HasColumnType("nvarchar(max)");

                    b.Property<bool>("EverydayAvailability")
                        .HasColumnType("int");

                    b.Property<string>("FirstName")
                        .HasColumnType("nvarchar(max)");

                    b.Property<bool>("FridayAvailability")
                        .HasColumnType("int");

                    b.Property<string>("LastName")
                        .HasColumnType("nvarchar(max)");

                    b.Property<bool>("MondayAvailability")
                        .HasColumnType("int");

                    b.Property<int>("NumOfAvailDaysAWeek")
                        .HasColumnType("int");

                    b.Property<string>("PreferredName")
                        .HasColumnType("nvarchar(max)");

                    b.Property<bool>("SaturdayAvailability")
                        .HasColumnType("int");

                    b.Property<bool>("SundayAvailability")
                        .HasColumnType("int");

                    b.Property<bool>("ThursdayAvailability")
                        .HasColumnType("int");

                    b.Property<bool>("TuesdayAvailability")
                        .HasColumnType("int");

                    b.Property<bool>("WednesdayAvailability")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.ToTable("EmployeeQueryReturn");
                });
#pragma warning restore 612, 618
        }
    }
}
