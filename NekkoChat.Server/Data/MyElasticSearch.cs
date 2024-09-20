using Elasticsearch.Net;
using Nest;

namespace NekkoChat.Server.Data
{
    /// <summary>
    /// Esa Clase es una instancia de la clase ElasticClient que podemos usar a lo largo de la aplicacion (se mantiene vivo), ya que el del PIPELINE no funciona
    /// </summary>
    public class MyElasticSearch
    {
        public ElasticClient EsClient()
        {
            var configuration = new ConfigurationBuilder()
                .AddJsonFile("appsettings.json")
                .Build();
            var elasticUsername = configuration["Authentication:ElasticSearch:Username"];
            var elasticPassword = configuration["Authentication:ElasticSearch:Password"];

            var nodes = new Uri[]
            {
                new Uri("http://localhost:9200/"),
            };

            var connectionPool = new StaticConnectionPool(nodes);
            var connectionSettings = new ConnectionSettings(connectionPool).BasicAuthentication(elasticUsername, elasticPassword);
            var elasticClient = new ElasticClient(connectionSettings);

            return elasticClient;
        }
    }
}
