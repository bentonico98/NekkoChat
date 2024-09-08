using Microsoft.AspNetCore.Mvc;
using System;
using Elastic.Clients.Elasticsearch;
using Elastic.Clients.Elasticsearch.QueryDsl;
using System.Globalization;

namespace NekkoChat.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UserController : ControllerBase
    {
        private readonly ILogger<UserController> _logger;

        public UserController(ILogger<UserController> logger)
        {
            _logger = logger;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetAllUSerDataById([FromRoute] string id)
        {
            try
            {
                var client = new ElasticsearchClient();

                var response = await client.GetAsync<ElasticUserDTO>(id, idx => idx.Index("nekko_chat_beta_users"));

                if (!response.IsValidResponse)
                {
                    return NotFound(new { Message = "No index found" });
                }

                var document = response.Source;
                return Ok(document);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "An error ocurred", Error = ex.Message });
            }
        }

        [HttpGet("{id}, {startDate}, {endDate}")]
        public async Task<IActionResult> GetConversationByRangeOfDateById(string id, string startDate, string endDate)
        {
            try
            {
                var client = new ElasticsearchClient();



                var response = await client.SearchAsync<ElasticUserDTO>(s => s
                    .Index("nekko_chat_beta_users")
                    .Query(q => q
                        .Bool(b => b
                            .Filter(f => f
                                .Term(t => t
                                    .Field("user_days_json.result.data.conversation_id")
                                    .Value(id))
                                .Range(r => r
                                    .TermRange(tr => tr
                                        .Field("user_days_json.result.data.messages.created_at")
                                        .Gte(startDate)
                                        .Lte(endDate)))
                            ))));

                Console.WriteLine(response);

                var document = response.Documents.FirstOrDefault();
                return Ok(document);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "An error ocurred", Error = ex.Message });
            }
        }
    }
}