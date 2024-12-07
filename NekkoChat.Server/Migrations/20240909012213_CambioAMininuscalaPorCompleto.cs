using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NekkoChat.Server.Migrations
{
    /// <inheritdoc />
    public partial class CambioAMininuscalaPorCompleto : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
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
                name: "PK_friend_List",
                table: "friend_List");

            migrationBuilder.DropPrimaryKey(
                name: "PK_aspNetUsers",
                table: "aspNetUsers");

            migrationBuilder.RenameTable(
                name: "users_Messages",
                newName: "users_messages");

            migrationBuilder.RenameTable(
                name: "user_Group_Preferencess",
                newName: "user_group_preferencess");

            migrationBuilder.RenameTable(
                name: "groups_Messages",
                newName: "groups_messages");

            migrationBuilder.RenameTable(
                name: "groups_Members",
                newName: "groups_members");

            migrationBuilder.RenameTable(
                name: "friend_List",
                newName: "friend_list");

            migrationBuilder.RenameTable(
                name: "aspNetUsers",
                newName: "aspnetusers");

            migrationBuilder.AddPrimaryKey(
                name: "PK_users_messages",
                table: "users_messages",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_user_group_preferencess",
                table: "user_group_preferencess",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_groups_messages",
                table: "groups_messages",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_groups_members",
                table: "groups_members",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_friend_list",
                table: "friend_list",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_aspnetusers",
                table: "aspnetusers",
                column: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_users_messages",
                table: "users_messages");

            migrationBuilder.DropPrimaryKey(
                name: "PK_user_group_preferencess",
                table: "user_group_preferencess");

            migrationBuilder.DropPrimaryKey(
                name: "PK_groups_messages",
                table: "groups_messages");

            migrationBuilder.DropPrimaryKey(
                name: "PK_groups_members",
                table: "groups_members");

            migrationBuilder.DropPrimaryKey(
                name: "PK_friend_list",
                table: "friend_list");

            migrationBuilder.DropPrimaryKey(
                name: "PK_aspnetusers",
                table: "aspnetusers");

            migrationBuilder.RenameTable(
                name: "users_messages",
                newName: "users_Messages");

            migrationBuilder.RenameTable(
                name: "user_group_preferencess",
                newName: "user_Group_Preferencess");

            migrationBuilder.RenameTable(
                name: "groups_messages",
                newName: "groups_Messages");

            migrationBuilder.RenameTable(
                name: "groups_members",
                newName: "groups_Members");

            migrationBuilder.RenameTable(
                name: "friend_list",
                newName: "friend_List");

            migrationBuilder.RenameTable(
                name: "aspnetusers",
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
                name: "PK_friend_List",
                table: "friend_List",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_aspNetUsers",
                table: "aspNetUsers",
                column: "Id");
        }
    }
}
