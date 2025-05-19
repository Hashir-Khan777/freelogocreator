using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class AddRelation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "deleted",
                table: "QRCode",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "note",
                table: "QRCode",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "user_id",
                table: "QRCode",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_QRCode_user_id",
                table: "QRCode",
                column: "user_id");

            migrationBuilder.AddForeignKey(
                name: "FK_QRCode_Users_user_id",
                table: "QRCode",
                column: "user_id",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_QRCode_Users_user_id",
                table: "QRCode");

            migrationBuilder.DropIndex(
                name: "IX_QRCode_user_id",
                table: "QRCode");

            migrationBuilder.DropColumn(
                name: "deleted",
                table: "QRCode");

            migrationBuilder.DropColumn(
                name: "note",
                table: "QRCode");

            migrationBuilder.DropColumn(
                name: "user_id",
                table: "QRCode");
        }
    }
}
