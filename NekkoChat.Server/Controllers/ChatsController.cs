//using Elastic.Clients.Elasticsearch;
using Microsoft.AspNetCore.Mvc;
using System;
//using Elastic.Clients.Elasticsearch.QueryDsl;
using System.Globalization;
//using Elastic.Transport;
//using Elasticsearch.Net;
//using Nest;
using NekkoChat.Server.Data;
using NekkoChat.Server.Utils;
using NekkoChat.Server.Models;
using Microsoft.VisualBasic;
//using Elastic.Clients.Elasticsearch.Core.Search;
using System.Text.Json;
using Newtonsoft.Json;
// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace NekkoChat.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ChatsController(ApplicationDbContext context) : ControllerBase
    {
        private readonly MyElasticSearch _esSearch = new();
        private readonly ApplicationDbContext _context = context;
        private readonly MessageServices _messageServices = new MessageServices(context);

        // GET: Chats/1 --- BUSCA TODAS LAS CONVERSACIONES DE EL USUARIO
        [HttpGet("chats/{id}")]
        public  IActionResult Get([FromRoute] string id)
        {
            try
            {
                List<Chats> UserChats = new();
                List<object> ChatsContent = new();

                string user_id = id;
                IQueryable<Chats> conversations = from c in _context.chats select c;
                conversations = conversations.Where((c) => c.sender_id == user_id || c.receiver_id == user_id);
                foreach (var conversation in conversations)
                {
                    UserChats.Add(conversation);
                }

                foreach (var userChat in UserChats)
                {
                    IQueryable<Users_Messages> chat = from u in _context.users_messages select u;
                    chat = chat.Where((u) => u.chat_id == userChat.id);
                    foreach (var c in chat)
                    {
                        ChatsContent.Add(JsonDocument.Parse(c.content));
                    }
                }

                if (ChatsContent == null)
                {
                    return NotFound(new { Message = "No index found" });
                }

                return Ok(ChatsContent);

            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "An error ocurred", Error = ex.Message });
            }
        }

        // GET chats/chat/5 -- BUSCA UN CHAT ESPECIFICO
        [HttpGet("chat/{id}")]
        public IActionResult GetChatByUserId([FromRoute] string id)
        {

            try
            {
                List < object > currentChats = new();
                int chat_id = int.Parse(id);
                IQueryable<Users_Messages> chat = from u in _context.users_messages select u;
                chat = chat.Where((u) => u.chat_id == chat_id);

                foreach (var c in chat)
                {
                    currentChats.Add(JsonDocument.Parse(c.content));
                }
                return Ok(currentChats);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "An error ocurred", Error = ex.Message });
            }
        }

        // POST chats/chat/create?sender_id=${sender_id}&receiver_id=${receiver_id}&value=${value} -- Ruta para creacion de un chat que tdv no exista
        [HttpPost("chat/create")]
        public async Task<IActionResult> Post(string value, string sender_id, string receiver_id)
        {
            int messageSent = await _messageServices.createChat(sender_id, receiver_id, value);
            if (messageSent <= 0)
            {
                return StatusCode(500, new { Message = "An error ocurred", Error = "Unable to send message" });
            }
            return Ok();
        }

        // PUT chats/chat/send/{id}?sender_id=${sender_id}&receiver_id=${receiver_id}&value=${value} --- Ruta para envio de mensaje a un chat existente
        [HttpPut("chat/send/{id}")]
        public async Task<IActionResult> Put(int id, string value, string sender_id, string receiver_id)
        {
            bool messageSent = await _messageServices.sendMessage(id, sender_id, receiver_id, value);
            if (!messageSent)
            {
                return StatusCode(500, new { Message = "An error ocurred", Error = "Unable to send message" });
            }
            return Ok();
        }
        // PUT chats/chat/read/{id}?sender_id=${sender_id} --- Ruta para envio de mensaje a un chat existente
        [HttpPut("chat/read/{chat_id}")]
        public  IActionResult PutMessageRead(int chat_id, string sender_id)
        {
            bool messageSent =  _messageServices.readMessage(chat_id, sender_id);
            if (!messageSent)
            {
                return StatusCode(500, new { Message = "An error ocurred", Error = "Unable to send message" });
            }
            return Ok();
        }
        // DELETE chats/chat/delete/{id}/5 -- Ruta que borra o sale de un chat (PROXIMAMENTE)
        [HttpDelete("chat/delete/{id}")]
        public void Delete(int id)
        {
        }
    }
}




// GET: Chats/1 --- BUSCA TODAS LAS CONVERSACIONES DE EL USUARIO
/*[HttpGet("chats/{id}")]
public async Task<IActionResult> Get([FromRoute] string id)
{
    try
    {
        var response = await _esSearch.EsClient().SearchAsync<ElasticUserDTO>(s => s
                    .Index("nekko_chat_beta_users_v3")
                    .Query(q => q
                        .Match(m => m
                            .Field("user_days_json.result.participants.id")
                            .Query(id)
                    )
                    ).Sort(s => s
                        .Field(f => f.Field("user_days_json.result.messages.data.created_at.keyword")
                            .Ascending()
                  )
                )
                );
        if (response.Hits.Count <= 0)
        {
            return NotFound(new { Message = "No index found" });
        }

        var document = response.Documents;
        return Ok(document);

    }
    catch (Exception ex)
    {
        return StatusCode(500, new { Message = "An error ocurred", Error = ex.Message });
    }
}

// GET chats/chat/5 -- BUSCA UN CHAT ESPECIFICO
[HttpGet("chat/{id}")]
public async Task<IActionResult> GetChatByUserId([FromRoute] string id)
{

    try
    {
        var response = await _esSearch.EsClient().SearchAsync<ElasticUserDTO>(s => s
            .Index("nekko_chat_beta_users_v3")
            .Query(q => q
                .Match(m => m
                    .Field("user_days_json.result.conversation_id")
                    .Query(id)
            )
            ));

        if (response.Hits.Count <= 0)
        {
            return NotFound(new { Message = "No index found" });
        }

        var document = response.Documents.FirstOrDefault();
        return Ok(document);
    }
    catch (Exception ex)
    {
        return StatusCode(500, new { Message = "An error ocurred", Error = ex.Message });
    }
}*/
