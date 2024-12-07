using Microsoft.EntityFrameworkCore.Migrations;
using NekkoChat.Server.Models;

#nullable disable

namespace NekkoChat.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddUserCollectionsToGroupsTableV3 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "users",
                table: "Groups",
                type: "jsontest",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AspNetUsersGroups");

            migrationBuilder.AddColumn<int>(
                name: "Groupsid",
                table: "AspNetUsers",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUsers_Groupsid",
                table: "AspNetUsers",
                column: "Groupsid");

            migrationBuilder.AddForeignKey(
                name: "FK_AspNetUsers_groups_Groupsid",
                table: "AspNetUsers",
                column: "Groupsid",
                principalTable: "groups",
                principalColumn: "id");
        }
    }
}
