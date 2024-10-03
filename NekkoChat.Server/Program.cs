using Elastic.Clients.Elasticsearch;
using Elastic.Transport;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using NekkoChat.Server.Data;
using Microsoft.AspNetCore.ResponseCompression;
using Microsoft.AspNet.SignalR.Hubs;
using NekkoChat.Server.Hubs;
using Microsoft.AspNetCore.Builder;
//using BlazorServer.Hubs;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

//Configuracion para SignalR
builder.Services.AddResponseCompression(options=>
{
    options.MimeTypes = ResponseCompressionDefaults.MimeTypes.Concat(new[] { "application/octet-stream" });
});

builder.Services.AddDbContext<ApplicationDbContext>(options => 
options.UseNpgsql(builder.Configuration.GetConnectionString("nekkoDb") ?? throw new InvalidOperationException("Connection string 'dbContext' not found.")));

//Configuracion del CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin",
        builder =>
        {
            builder.WithOrigins("https://localhost:5173", "https://10.0.0.37:5173")
                   .AllowAnyHeader()
                   .AllowAnyMethod();
        });
    options.AddPolicy("SignalROrigin",
        builder =>
        {
            builder.WithOrigins("https://localhost:5173", "https://10.0.0.37:5173")
                   .AllowAnyHeader()
                   .AllowAnyMethod()
                   .AllowCredentials();
        });
});
builder.Services.AddSignalR();


var configuration = new ConfigurationBuilder()
    .AddJsonFile("appsettings.json")
    .Build();


var elasticUsername = configuration["Authentication:ElasticSearch:Username"];
var elasticPassword = configuration["Authentication:ElasticSearch:Password"];

var elasticSettings = new ElasticsearchClientSettings(new Uri("https://localhost:9200"))
    .Authentication(new BasicAuthentication("lenny2", "423204"));

var elasticClient = new ElasticsearchClient(elasticSettings);

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();
app.MapControllers();

//Middlelane De CORS
app.UseCors("SignalROrigin");
app.UseCors("AllowSpecificOrigin");

//app.UseSignalR();

app.MapFallbackToFile("/index.html");
//Map de los Hub -- NOTA:Proximamente hay que cambiar la ruta em base a la ruta del chat con el cual estamos trabajando
app.MapHub<PrivateChatHub>("/privatechathub");

app.Run();


