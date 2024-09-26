﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using NekkoChat.Server.Data;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace NekkoChat.Server.Migrations
{
    [DbContext(typeof(ApplicationDbContext))]
    [Migration("20240909015654_FixUserMesssagesTable")]
    partial class FixUserMesssagesTable
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.8")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            NpgsqlModelBuilderExtensions.UseIdentityByDefaultColumns(modelBuilder);

            modelBuilder.Entity("NekkoChat.Server.Models.AspNetUsers", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("text");

                    b.Property<string>("About")
                        .HasColumnType("text");

                    b.Property<int>("AccessFailedCount")
                        .HasColumnType("integer");

                    b.Property<string>("ConcurrencyStamp")
                        .HasColumnType("text");

                    b.Property<string>("Email")
                        .HasColumnType("text");

                    b.Property<bool>("EmailConfirmed")
                        .HasColumnType("boolean");

                    b.Property<int>("Friends_Count")
                        .HasColumnType("integer");

                    b.Property<bool>("LockoutEnabled")
                        .HasColumnType("boolean");

                    b.Property<DateTimeOffset?>("LockoutEnd")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("NormalizedEmail")
                        .HasColumnType("text");

                    b.Property<string>("NormalizedUserName")
                        .HasColumnType("text");

                    b.Property<string>("PasswordHash")
                        .HasColumnType("text");

                    b.Property<string>("PhoneNumber")
                        .HasColumnType("text");

                    b.Property<bool>("PhoneNumberConfirmed")
                        .HasColumnType("boolean");

                    b.Property<string>("ProfilePhotoUrl")
                        .HasColumnType("text");

                    b.Property<string>("SecurityStamp")
                        .HasColumnType("text");

                    b.Property<int>("Status")
                        .HasColumnType("integer");

                    b.Property<bool>("TwoFactorEnabled")
                        .HasColumnType("boolean");

                    b.Property<string>("UserName")
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.ToTable("aspnetusers");
                });

            modelBuilder.Entity("NekkoChat.Server.Models.Chats", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<int>("Receiver_Id")
                        .HasColumnType("integer");

                    b.Property<int>("Sender_Id")
                        .HasColumnType("integer");

                    b.Property<string>("Type")
                        .HasColumnType("text");

                    b.Property<bool>("isArchived")
                        .HasColumnType("boolean");

                    b.Property<bool>("isFavorite")
                        .HasColumnType("boolean");

                    b.HasKey("Id");

                    b.ToTable("chats");
                });

            modelBuilder.Entity("NekkoChat.Server.Models.Friend_List", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<int>("Receiver_Id")
                        .HasColumnType("integer");

                    b.Property<int>("Sender_Id")
                        .HasColumnType("integer");

                    b.Property<bool>("isAccepted")
                        .HasColumnType("boolean");

                    b.HasKey("Id");

                    b.ToTable("friend_list");
                });

            modelBuilder.Entity("NekkoChat.Server.Models.Groups", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<string>("Description")
                        .HasColumnType("text");

                    b.Property<string>("Name")
                        .HasColumnType("text");

                    b.Property<string>("ProfilePhotoUrl")
                        .HasColumnType("text");

                    b.Property<string>("Type")
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.ToTable("groups");
                });

            modelBuilder.Entity("NekkoChat.Server.Models.Groups_Members", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<int>("Group_Id")
                        .HasColumnType("integer");

                    b.Property<int>("User_Id")
                        .HasColumnType("integer");

                    b.HasKey("Id");

                    b.ToTable("groups_members");
                });

            modelBuilder.Entity("NekkoChat.Server.Models.Groups_Messages", b =>
                {
                    b.Property<int>("id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("id"));

                    b.Property<string>("content")
                        .HasColumnType("jsonb");

                    b.Property<int>("group_id")
                        .HasColumnType("integer");

                    b.HasKey("id");

                    b.ToTable("groups_messages");
                });

            modelBuilder.Entity("NekkoChat.Server.Models.User_Group_Preferences", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<int>("Group_Id")
                        .HasColumnType("integer");

                    b.Property<int>("User_Id")
                        .HasColumnType("integer");

                    b.Property<bool>("isArchived")
                        .HasColumnType("boolean");

                    b.Property<bool>("isFavorite")
                        .HasColumnType("boolean");

                    b.HasKey("Id");

                    b.ToTable("user_group_preferencess");
                });

            modelBuilder.Entity("NekkoChat.Server.Models.Users", b =>
                {
                    b.Property<int>("id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("id"));

                    b.Property<string>("About")
                        .HasColumnType("text");

                    b.Property<int>("Friends_Count")
                        .HasColumnType("integer");

                    b.Property<string>("ProfilePhotoUrl")
                        .HasColumnType("text");

                    b.Property<int>("Status")
                        .HasColumnType("integer");

                    b.Property<string>("email")
                        .HasColumnType("text");

                    b.Property<string>("password")
                        .HasColumnType("text");

                    b.Property<string>("username")
                        .HasColumnType("text");

                    b.HasKey("id");

                    b.ToTable("users");
                });

            modelBuilder.Entity("NekkoChat.Server.Models.Users_Messages", b =>
                {
                    b.Property<int>("id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("id"));

                    b.Property<int>("chat_id")
                        .HasColumnType("integer");

                    b.Property<string>("content")
                        .HasColumnType("jsonb");

                    b.HasKey("id");

                    b.ToTable("users_messages");
                });
#pragma warning restore 612, 618
        }
    }
}