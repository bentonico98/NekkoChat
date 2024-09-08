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

        [HttpGet("{id}/{startDate}/{endDate}")]
        public async Task<IActionResult> GetConversationByRangeOfDateById([FromRoute] string id, [FromRoute] DateTime startDate, [FromRoute] DateTime endDate)
        {
            try
            {
                var client = new ElasticsearchClient();            

                var response = await client.SearchAsync<ElasticUserDTO>(s => s
                    .Index("nekko_chat_beta_users")
                    .Query(q => q
                        .Bool(b => b
                            .Must(f => f
                                .Term(t => t
                                    .Field("user_days_json.result.data.conversation_id")
                                    .Value(id))
                            ).Filter(f2 => f2 
                                .Range(r => r
                                    .DateRange(dr => dr
                                        .Field("user_days_json.result.data.messages.created_at")
                                        .Gte(startDate)
                                        .Lte(endDate)
                                        
                                        )))
                            
                             )));

                Console.WriteLine(response);

                var document = response.Documents;
                return Ok(document);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "An error ocurred", Error = ex.Message });
            }
        }

        [HttpGet("{id:alpha}")]
        public async Task<IActionResult> GetAllConversationById([FromRoute] string id)
        {
            try
            {
                var client = new ElasticsearchClient();            

                var response = await client.SearchAsync<ElasticUserDTO>(s => s
                    .Index("nekko_chat_beta_users")
                );

                Console.WriteLine(response);

                var document = response.Documents;
                return Ok(document);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "An error ocurred", Error = ex.Message });
            }
        }
    }
}

/*
GET /nekko_chat_beta_users/_search
{
  "query": {
    "match": {
      "user_days_json.result.data.conversation_id": 2
    }
  },
  "sort": {
    "user_days_json.result.date": "desc"
  },
  "size": 1
}
}
*/