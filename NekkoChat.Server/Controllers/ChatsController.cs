using Elastic.Clients.Elasticsearch;
using Microsoft.AspNetCore.Mvc;
using System;
using Elastic.Clients.Elasticsearch.QueryDsl;
using System.Globalization;
using Elastic.Transport;
using Elasticsearch.Net;
using Nest;
using NekkoChat.Server.Data;
using NekkoChat.Server.Utils;
using Elastic.Clients.Elasticsearch.Core.Search;

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
        public async Task<IActionResult> Get([FromRoute] string id)
        {
            try
            {
                //EL SORT ESTA COMENTADO PORQUE DA ERROR POR ALGUNA RAZON -- PUEDES ARREGLARLO??

                var response = await _esSearch.EsClient().SearchAsync<ElasticUserDTO>(s => s
                    .Index("nekko_chat_beta_users")
                    .Query(q => q
                        .Match(m => m
                            .Field("user_days_json.result.data.conversation_id")
                            .Query(id)
                    )
                    )/*.Sort(s => s
                    .Field("user_days_json.result.date")
                    .Doc(d => d
                            .Order(Elastic.Clients.Elasticsearch.SortOrder.Desc)
                        ))*/
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
                //EL SORT ESTA COMENTADO PORQUE DA ERROR POR ALGUNA RAZON -- PUEDES ARREGLARLO??
                //var client = new ElasticsearchClient();

                var response = await _esSearch.EsClient().SearchAsync<ElasticUserDTO>(s => s
                    .Index("nekko_chat_beta_users")
                    .Query(q => q
                        .Match(m => m
                            .Field("user_days_json.result.data.conversation_id")
                            .Query(id)
                    )
                    )/*.Sort(s => s
                        .Field("user_days_json.result.date")
                        .Doc(d => d
                            .Order(Elastic.Clients.Elasticsearch.SortOrder.Desc)
                        )
                    )*/
                );

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
        }

        // POST chats/chat/create?sender_id=${sender_id}&receiver_id=${receiver_id}&value=${value} -- Ruta para creacion de un chat que tdv no exista
        [HttpPost("chat/create")]
        public async Task<IActionResult> Post(string value, int sender_id, int receiver_id)
        {
            int messageSent =  await _messageServices.createChat(sender_id, receiver_id, value);
            if (messageSent <= 0)
            {
                return StatusCode(500, new { Message = "An error ocurred", Error = "Unable to send message" });
            }
            return Ok();
        }

        // PUT chats/chat/send/{id}?sender_id=${sender_id}&receiver_id=${receiver_id}&value=${value} --- Ruta para envio de mensaje a un chat existente
        [HttpPut("chat/send/{id}")]
        public async Task<IActionResult> Put(int id, string value, int sender_id, int receiver_id)
        {
            bool messageSent = await _messageServices.sendMessage(id, sender_id, receiver_id, value);
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
