using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NekkoChat.Server.Migrations
{
    /// <inheritdoc />
    public partial class FixUserMesssagesTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Content",
                table: "users_messages",
                newName: "content");

            migrationBuilder.RenameColumn(
                name: "Chat_Id",
                table: "users_messages",
                newName: "chat_id");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "users_messages",
                newName: "id");

            migrationBuilder.RenameColumn(
                name: "Group_Id",
                table: "groups_messages",
                newName: "group_id");

            migrationBuilder.RenameColumn(
                name: "Content",
                table: "groups_messages",
                newName: "content");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "groups_messages",
                newName: "id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "content",
                table: "users_messages",
                newName: "Content");

            migrationBuilder.RenameColumn(
                name: "chat_id",
                table: "users_messages",
                newName: "Chat_Id");

            migrationBuilder.RenameColumn(
                name: "id",
                table: "users_messages",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "group_id",
                table: "groups_messages",
                newName: "Group_Id");

            migrationBuilder.RenameColumn(
                name: "content",
                table: "groups_messages",
                newName: "Content");

            migrationBuilder.RenameColumn(
                name: "id",
                table: "groups_messages",
                newName: "Id");
        }
    }
}
