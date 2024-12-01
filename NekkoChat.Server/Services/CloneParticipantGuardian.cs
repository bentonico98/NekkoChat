using Coravel.Invocable;
using Microsoft.EntityFrameworkCore;
using NekkoChat.Server.Data;
using NekkoChat.Server.Models;
using NekkoChat.Server.Schemas;
using NekkoChat.Server.Utils;
using System.Linq;
using System.Text.Json;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace NekkoChat.Server.Services
{
    public class CloneParticipantGuardian(IServiceProvider serviceProvider, ILogger<CloneParticipantGuardian> logger) : IInvocable
    {
        private readonly IServiceProvider svp = serviceProvider;
        private readonly ILogger<CloneParticipantGuardian> _logger = logger;
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
                        GroupChatSchemas[] messages = payload.messages;
                        ParticipantsSchema[] participants = payload.participants;
                        if (participants.Count() > 0)
                        {
                            bool groupToDelete = await DeleteCloneParticipant(group.g, messages, participants);
                            bool membersToDelete = await DeleteCloneMembership(group.g);
                        }
                    }
                }
            }
        }
        private async Task<bool> DeleteCloneParticipant(Groups group, GroupChatSchemas[] messages, ParticipantsSchema[] participants)
        {
            if (participants.Length > 0 && group is not null)
            {
                if (participants.Distinct().Count() == participants.Count()) return false;

                ParticipantsSchema[] newParticipants = participants.DistinctBy((p) => new { p.id, p.name, p.profilePic, p.connectionid }).ToArray();
                using (var db = new ApplicationDbContext(svp.GetRequiredService<DbContextOptions<ApplicationDbContext>>()))
                {
                    Groups_Messages convo = db.groups_messages.Where((gm) => gm.group_id == group.id).First();

                    if (convo is not null)
                    {
                        string payload = JBProcessor.GroupChatProcessed(group.id, group.name!, messages, newParticipants);

                        if (string.IsNullOrEmpty(payload)) return false;

                        _logger.LogError($"{participants.Length} CLONES FOUND IN GROUP ID# {group.id} -- DELETING THEM & LEAVING {newParticipants.First()} INSTEAD");

                        db.groups_messages.Update(convo);
                        await db.SaveChangesAsync();
                    }
                }

                return true;
            }

            return false;
        }
        private async Task<bool> DeleteCloneMembership(Groups group)
        {

            using (var db = new ApplicationDbContext(svp.GetRequiredService<DbContextOptions<ApplicationDbContext>>()))
            {
                var membershipsToDelete = db.groups_members
                    .GroupBy((gm) => new { gm.group_id, gm.user_id }).Where((g) => g.Count() > 1).Select(x => x.OrderBy((x) => x.id).FirstOrDefault()).Skip(1);

                if (!membershipsToDelete.Any()) return false;

                foreach (var dupe in membershipsToDelete)
                {
                    if (dupe is not null)
                    {
                        _logger.LogError($"CLONE ID# {dupe.user_id} CLONES FOUND IN GROUP ID# {group.id}");
                        db.groups_members.Remove(dupe);
                    }
                }

                await db.SaveChangesAsync();
            }
            return true;
        }
    }
}
