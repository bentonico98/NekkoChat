using AutoMapper.Execution;
using Coravel.Invocable;
using Microsoft.EntityFrameworkCore;
using NekkoChat.Server.Data;
using NekkoChat.Server.Models;
using NekkoChat.Server.Schemas;
using System.Text.Json;

namespace NekkoChat.Server.Services
{
    public class EmptyGroupsGuardian(IServiceProvider serviceProvider, ILogger<EmptyGroupsGuardian> logger) : IInvocable
    {
        private readonly IServiceProvider svp = serviceProvider;
        private readonly ILogger<EmptyGroupsGuardian> _logger = logger;
        public async Task Invoke()
        {
            using (var db = new ApplicationDbContext(svp.GetRequiredService<DbContextOptions<ApplicationDbContext>>()))
            {
                var groups = db.groups
                    .Join(db.groups_messages, g => g.id, gm => gm.group_id, (g, gm) => new { g, gm });

                if (groups.Any())
                {
                    foreach (var group in groups)
                    {
                        string content = group.gm.content!;
                        GroupMessageSchemas payload = JsonSerializer.Deserialize<GroupMessageSchemas>(content)!;
                        ParticipantsSchema[] participants = payload.participants;
                        if (participants.Count() <= 0)
                        {
                            int group_id = group.g.id;
                            bool groupToDelete = await DeleteGroups(group_id);
                            bool memberToDelete = await DeleteGroupsMembership(group_id);
                            bool groupToMessage = await DeleteGroupsMessages(group_id);
                        }
                    }
                }
            }
        }

        private async Task<bool> DeleteGroups(int id)
        {
            using (var db = new ApplicationDbContext(svp.GetRequiredService<DbContextOptions<ApplicationDbContext>>()))
            {
                var groupToDelete = await db.groups.FindAsync(id);

                if (groupToDelete is null) return false;

                _logger.LogError($"DELETING EMPTY GROUP ID# {groupToDelete.id}");

                db.Remove(groupToDelete);
                await db.SaveChangesAsync();

            }
            return true;
        }
        private async Task<bool> DeleteGroupsMembership(int id)
        {
            using (var db = new ApplicationDbContext(svp.GetRequiredService<DbContextOptions<ApplicationDbContext>>()))
            {
                var memberToDelete = db.groups_members.Where((gm) => gm.group_id == id);

                if (!memberToDelete.Any()) return false;

                foreach (var members in memberToDelete)
                {
                    _logger.LogError($"DELETING MEMBERSHIP FOR MEMBER ID# {members.id} GROUP ID# {members.group_id} BECAUSE GROUP DOESNT EXIST");
                    db.Remove(members);
                    await db.SaveChangesAsync();
                }
            }
            return true;
        }
        private async Task<bool> DeleteGroupsMessages(int id)
        {
            using (var db = new ApplicationDbContext(svp.GetRequiredService<DbContextOptions<ApplicationDbContext>>()))
            {
                Groups_Messages groupToMessage = db.groups_messages.Where((gm) => gm.group_id == id).First();
                
                if (groupToMessage is null) return false;

                _logger.LogError($"DELETING MESSAGES FOR  GROUP ID# {groupToMessage.group_id} BECAUSE GROUP DOESNT EXIST");

                db.Remove(groupToMessage);
                await db.SaveChangesAsync();
            }
            return true;
        }
    }
}
