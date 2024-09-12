using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NekkoChat.Server.Migrations
{
    /// <inheritdoc />
    public partial class UltimoMigrationDe08092024 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Status",
                table: "users",
                newName: "status");

            migrationBuilder.RenameColumn(
                name: "ProfilePhotoUrl",
                table: "users",
                newName: "profilePhotoUrl");

            migrationBuilder.RenameColumn(
                name: "Friends_Count",
                table: "users",
                newName: "friends_Count");

            migrationBuilder.RenameColumn(
                name: "About",
                table: "users",
                newName: "about");

            migrationBuilder.RenameColumn(
                name: "User_Id",
                table: "user_group_preferencess",
                newName: "user_id");

            migrationBuilder.RenameColumn(
                name: "Group_Id",
                table: "user_group_preferencess",
                newName: "group_id");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "user_group_preferencess",
                newName: "id");

            migrationBuilder.RenameColumn(
                name: "User_Id",
                table: "groups_members",
                newName: "user_id");

            migrationBuilder.RenameColumn(
                name: "Group_Id",
                table: "groups_members",
                newName: "group_id");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "groups_members",
                newName: "id");

            migrationBuilder.RenameColumn(
                name: "Type",
                table: "groups",
                newName: "type");

            migrationBuilder.RenameColumn(
                name: "ProfilePhotoUrl",
                table: "groups",
                newName: "profilePhotoUrl");

            migrationBuilder.RenameColumn(
                name: "Name",
                table: "groups",
                newName: "name");

            migrationBuilder.RenameColumn(
                name: "Description",
                table: "groups",
                newName: "description");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "groups",
                newName: "id");

            migrationBuilder.RenameColumn(
                name: "Type",
                table: "chats",
                newName: "type");

            migrationBuilder.RenameColumn(
                name: "Sender_Id",
                table: "chats",
                newName: "sender_id");

            migrationBuilder.RenameColumn(
                name: "Receiver_Id",
                table: "chats",
                newName: "receiver_id");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "chats",
                newName: "id");

            migrationBuilder.RenameColumn(
                name: "Status",
                table: "aspnetusers",
                newName: "status");

            migrationBuilder.RenameColumn(
                name: "ProfilePhotoUrl",
                table: "aspnetusers",
                newName: "profilePhotoUrl");

            migrationBuilder.RenameColumn(
                name: "Friends_Count",
                table: "aspnetusers",
                newName: "friends_Count");

            migrationBuilder.RenameColumn(
                name: "About",
                table: "aspnetusers",
                newName: "about");

            migrationBuilder.AlterColumn<int>(
                name: "status",
                table: "users",
                type: "integer",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AlterColumn<int>(
                name: "friends_Count",
                table: "users",
                type: "integer",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AlterColumn<bool>(
                name: "isFavorite",
                table: "user_group_preferencess",
                type: "boolean",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "boolean");

            migrationBuilder.AlterColumn<bool>(
                name: "isArchived",
                table: "user_group_preferencess",
                type: "boolean",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "boolean");

            migrationBuilder.AlterColumn<bool>(
                name: "isAccepted",
                table: "friend_list",
                type: "boolean",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "boolean");

            migrationBuilder.AlterColumn<bool>(
                name: "isFavorite",
                table: "chats",
                type: "boolean",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "boolean");

            migrationBuilder.AlterColumn<bool>(
                name: "isArchived",
                table: "chats",
                type: "boolean",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "boolean");

            migrationBuilder.AlterColumn<int>(
                name: "status",
                table: "aspnetusers",
                type: "integer",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AlterColumn<int>(
                name: "friends_Count",
                table: "aspnetusers",
                type: "integer",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "status",
                table: "users",
                newName: "Status");

            migrationBuilder.RenameColumn(
                name: "profilePhotoUrl",
                table: "users",
                newName: "ProfilePhotoUrl");

            migrationBuilder.RenameColumn(
                name: "friends_Count",
                table: "users",
                newName: "Friends_Count");

            migrationBuilder.RenameColumn(
                name: "about",
                table: "users",
                newName: "About");

            migrationBuilder.RenameColumn(
                name: "user_id",
                table: "user_group_preferencess",
                newName: "User_Id");

            migrationBuilder.RenameColumn(
                name: "group_id",
                table: "user_group_preferencess",
                newName: "Group_Id");

            migrationBuilder.RenameColumn(
                name: "id",
                table: "user_group_preferencess",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "user_id",
                table: "groups_members",
                newName: "User_Id");

            migrationBuilder.RenameColumn(
                name: "group_id",
                table: "groups_members",
                newName: "Group_Id");

            migrationBuilder.RenameColumn(
                name: "id",
                table: "groups_members",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "type",
                table: "groups",
                newName: "Type");

            migrationBuilder.RenameColumn(
                name: "profilePhotoUrl",
                table: "groups",
                newName: "ProfilePhotoUrl");

            migrationBuilder.RenameColumn(
                name: "name",
                table: "groups",
                newName: "Name");

            migrationBuilder.RenameColumn(
                name: "description",
                table: "groups",
                newName: "Description");

            migrationBuilder.RenameColumn(
                name: "id",
                table: "groups",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "type",
                table: "chats",
                newName: "Type");

            migrationBuilder.RenameColumn(
                name: "sender_id",
                table: "chats",
                newName: "Sender_Id");

            migrationBuilder.RenameColumn(
                name: "receiver_id",
                table: "chats",
                newName: "Receiver_Id");

            migrationBuilder.RenameColumn(
                name: "id",
                table: "chats",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "status",
                table: "aspnetusers",
                newName: "Status");

            migrationBuilder.RenameColumn(
                name: "profilePhotoUrl",
                table: "aspnetusers",
                newName: "ProfilePhotoUrl");

            migrationBuilder.RenameColumn(
                name: "friends_Count",
                table: "aspnetusers",
                newName: "Friends_Count");

            migrationBuilder.RenameColumn(
                name: "about",
                table: "aspnetusers",
                newName: "About");

            migrationBuilder.AlterColumn<int>(
                name: "Status",
                table: "users",
                type: "integer",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "Friends_Count",
                table: "users",
                type: "integer",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "isFavorite",
                table: "user_group_preferencess",
                type: "boolean",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "boolean",
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "isArchived",
                table: "user_group_preferencess",
                type: "boolean",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "boolean",
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "isAccepted",
                table: "friend_list",
                type: "boolean",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "boolean",
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "isFavorite",
                table: "chats",
                type: "boolean",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "boolean",
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "isArchived",
                table: "chats",
                type: "boolean",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "boolean",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "Status",
                table: "aspnetusers",
                type: "integer",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "Friends_Count",
                table: "aspnetusers",
                type: "integer",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);
        }
    }
}
