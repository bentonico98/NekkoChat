using Microsoft.EntityFrameworkCore;
using NekkoChat.Server.Data;

namespace NekkoChat.Server.Utils
{
    public static class MigrationExtension
    {
        public static void ApplyMigration(this IApplicationBuilder app)
        {
            using IServiceScope scope = app.ApplicationServices.CreateScope();

            using ApplicationDbContext db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

            db.Database.Migrate();
        }
    }
}
