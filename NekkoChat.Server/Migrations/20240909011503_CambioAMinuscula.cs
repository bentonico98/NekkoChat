using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NekkoChat.Server.Migrations
{
    /// <inheritdoc />
    public partial class CambioAMinuscula : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_Users_Messages",
                table: "Users_Messages");

            migrationBuilder.DropPrimaryKey(
                name: "PK_User_Group_Preferencess",
                table: "User_Group_Preferencess");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Groups_Messages",
                table: "Groups_Messages");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Groups_Members",
                table: "Groups_Members");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Groups",
                table: "Groups");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Friend_List",
                table: "Friend_List");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Chats",
                table: "Chats");

            migrationBuilder.DropPrimaryKey(
                name: "PK_AspNetUsers",
                table: "AspNetUsers");

            migrationBuilder.RenameTable(
                name: "Users_Messages",
                newName: "users_Messages");

            migrationBuilder.RenameTable(
                name: "User_Group_Preferencess",
                newName: "user_Group_Preferencess");

            migrationBuilder.RenameTable(
                name: "Groups_Messages",
                newName: "groups_Messages");

            migrationBuilder.RenameTable(
                name: "Groups_Members",
                newName: "groups_Members");

            migrationBuilder.RenameTable(
                name: "Groups",
                newName: "groups");

            migrationBuilder.RenameTable(
                name: "Friend_List",
                newName: "friend_List");

            migrationBuilder.RenameTable(
                name: "Chats",
                newName: "chats");

            migrationBuilder.RenameTable(
                name: "AspNetUsers",
                newName: "aspNetUsers");

            migrationBuilder.AddPrimaryKey(
                name: "PK_users_Messages",
                table: "users_Messages",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_user_Group_Preferencess",
                table: "user_Group_Preferencess",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_groups_Messages",
                table: "groups_Messages",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_groups_Members",
                table: "groups_Members",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_groups",
                table: "groups",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_friend_List",
                table: "friend_List",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_chats",
                table: "chats",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_aspNetUsers",
                table: "aspNetUsers",
                column: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_users_Messages",
                table: "users_Messages");

            migrationBuilder.DropPrimaryKey(
                name: "PK_user_Group_Preferencess",
                table: "user_Group_Preferencess");

            migrationBuilder.DropPrimaryKey(
                name: "PK_groups_Messages",
                table: "groups_Messages");

            migrationBuilder.DropPrimaryKey(
                name: "PK_groups_Members",
                table: "groups_Members");

            migrationBuilder.DropPrimaryKey(
                name: "PK_groups",
                table: "groups");

            migrationBuilder.DropPrimaryKey(
                name: "PK_friend_List",
                table: "friend_List");

            migrationBuilder.DropPrimaryKey(
                name: "PK_chats",
                table: "chats");

            migrationBuilder.DropPrimaryKey(
                name: "PK_aspNetUsers",
                table: "aspNetUsers");

            migrationBuilder.RenameTable(
                name: "users_Messages",
                newName: "Users_Messages");

            migrationBuilder.RenameTable(
                name: "user_Group_Preferencess",
                newName: "User_Group_Preferencess");

            migrationBuilder.RenameTable(
                name: "groups_Messages",
                newName: "Groups_Messages");

            migrationBuilder.RenameTable(
                name: "groups_Members",
                newName: "Groups_Members");

            migrationBuilder.RenameTable(
                name: "groups",
                newName: "Groups");

            migrationBuilder.RenameTable(
                name: "friend_List",
                newName: "Friend_List");

            migrationBuilder.RenameTable(
                name: "chats",
                newName: "Chats");

            migrationBuilder.RenameTable(
                name: "aspNetUsers",
                newName: "AspNetUsers");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Users_Messages",
                table: "Users_Messages",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_User_Group_Preferencess",
                table: "User_Group_Preferencess",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Groups_Messages",
                table: "Groups_Messages",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Groups_Members",
                table: "Groups_Members",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Groups",
                table: "Groups",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Friend_List",
                table: "Friend_List",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Chats",
                table: "Chats",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_AspNetUsers",
                table: "AspNetUsers",
                column: "Id");
        }
    }
}
