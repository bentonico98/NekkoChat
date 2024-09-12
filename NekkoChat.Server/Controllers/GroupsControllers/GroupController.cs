using Microsoft.AspNetCore.Mvc;
using System;
using Elastic.Clients.Elasticsearch;
using Elastic.Clients.Elasticsearch.QueryDsl;
using System.Globalization;
using NekkoChat.Server.Data;
using Microsoft.EntityFrameworkCore;

namespace NekkoChat.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class GroupController(ILogger<GroupController> logger, ApplicationDbContext context) : ControllerBase
    {
        private readonly ILogger<GroupController> _logger = logger;
        private readonly ApplicationDbContext _context = context;

    
        //Busca toda la DATA del usuario basada en el id, el id aqui se busca en base a 2-1, 2-2, 2-3
        //asi se dividio ElasticSearch, esta esta pensada para busquedas mas especificas basadas en el _doc deseado
        [HttpGet("data/{id}")]
        public async Task<IActionResult> GetAllGroupDataById([FromRoute] string id)
        {
            try
            {
                var client = new ElasticsearchClient();

                var response = await client.GetAsync<ElasticGroupDTO>(id, idx => idx.Index("nekko_chat_beta_groups"));

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
        public async Task<IActionResult> GetGroupConversationByRangeOfDateById([FromRoute] string id, [FromRoute] DateTime startDate, [FromRoute] DateTime endDate)
        {
            try
            {
                var client = new ElasticsearchClient();            

                var response = await client.SearchAsync<ElasticGroupDTO>(s => s
                    .Index("nekko_chat_beta_groups")
                    .Query(q => q
                        .Bool(b => b
                            .Must(f => f
                                .Term(t => t
                                    .Field("group_days_json.result.data.group_id")
                                    .Value(id))
                            ).Filter(f2 => f2 
                                .Range(r => r
                                    .DateRange(dr => dr
                                        .Field("group_days_json.result.data.messages.created_at")
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
        public async Task<IActionResult> GetAllGroupConversationById([FromRoute] string id)
        {
            try
            {
                var client = new ElasticsearchClient();            

                var response = await client.SearchAsync<ElasticGroupDTO>(s => s
                    .Index("nekko_chat_beta_groups")
                    .Query(q => q
                        .Match(m => m
                            .Field("group_days_json.result.data.group_id")
                            .Query(id)
                    )
                    ).Sort(s => s
                        .Field("group_days_json.result.date")
                        .Doc(d => d
                            .Order(SortOrder.Desc)
                        )
                    )
                );

                if (!response.IsValidResponse)
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
        public async Task<IActionResult> GetRecentDayGroupConversationById([FromRoute] string id)
        {
            try
            {
                var client = new ElasticsearchClient();            

                var response = await client.SearchAsync<ElasticGroupDTO>(s => s
                    .Index("nekko_chat_beta_groups")
                    .Query(q => q
                        .Match(m => m
                            .Field("group_days_json.result.data.group_id")
                            .Query(id)
                    )
                    ).Sort(s => s
                        .Field("group_days_json.result.date")
                        .Doc(d => d
                            .Order(SortOrder.Desc)
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