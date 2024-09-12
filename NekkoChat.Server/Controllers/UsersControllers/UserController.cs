using Microsoft.AspNetCore.Mvc;
using System;
using Elastic.Clients.Elasticsearch;
using Elastic.Clients.Elasticsearch.QueryDsl;
using System.Globalization;
using Elastic.Transport;
using Elasticsearch.Net;
using Nest;
using NekkoChat.Server.Data;

namespace NekkoChat.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UserController : ControllerBase
    {
        private readonly ILogger<UserController> _logger;
        private readonly MyElasticSearch _esSearch;
        public UserController(ILogger<UserController> logger)
        {
            _logger = logger;
            _esSearch = new MyElasticSearch();
        }
        //Busca toda la DATA del usuario basada en el id, el id aqui se busca en base a 2-1, 2-2, 2-3
        //asi se dividio ElasticSearch, esta esta pensada para busquedas mas especificas basadas en el _doc deseado
        [HttpGet("data/{id}")]
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
        //Busca la conversacion en un periodo de tiempo, esta fue pensada para obtener la conversacion semanal o en el periodo que se quiera
        //y no sobrecargar la DB con pedidos, se pide en baches 
        [HttpGet("conversation/{id}/{startDate}/{endDate}")]
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

                if (!response.IsValidResponse)
                {
                    return NotFound(new { Message = "No index found" });
                };

                var document = response.Documents;
                return Ok(document);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "An error ocurred", Error = ex.Message });
            }
        }
        //Busca todas las conversaciones basadas en ese asi, el ordern es descendete por lo que muestra la mas reciente primero
        [HttpGet("conversation/all/{id}")]
        public async Task<IActionResult> GetAllConversationById([FromRoute] string id)
        {
            try
            {
                var response = await _esSearch.EsClient().SearchAsync<ElasticUserDTO>(s => s
                    .Index("nekko_chat_beta_users")
                    .Query(q => q
                        .Match(m => m
                            .Field("user_days_json.result.data.conversation_id")
                            .Query(id)
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
        //Busca la connversacion mas reciente basada en el dia (busca obtener el dia completo)
        [HttpGet("conversation/{id}")]
        public async Task<IActionResult> GetRecentDayConversationById([FromRoute] string id)
        {
            try
            {
                var client = new ElasticsearchClient();

                var response = await client.SearchAsync<ElasticUserDTO>(s => s
                    .Index("nekko_chat_beta_users")
                    .Query(q => q
                        .Match(m => m
                            .Field("user_days_json.result.data.conversation_id")
                            .Query(id)
                    )
                    ).Sort(s => s
                        .Field("user_days_json.result.date")
                        .Doc(d => d
                            .Order(Elastic.Clients.Elasticsearch.SortOrder.Desc)
                        )
                    )
                );

                if (!response.IsValidResponse)
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
    }
}
