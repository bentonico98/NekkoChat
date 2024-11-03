using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using NekkoChat.Server.Data;
using Microsoft.AspNetCore.ResponseCompression;
using Microsoft.AspNet.SignalR.Hubs;
using NekkoChat.Server.Hubs;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Identity;
using NekkoChat.Server.Models;
using Microsoft.OpenApi.Any;
using NekkoChat.Server.Constants.Interfaces;
using NekkoChat.Server.Utils;
//using BlazorServer.Hubs;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


//Configuracion para SignalR
builder.Services.AddResponseCompression(options =>
{
    options.MimeTypes = ResponseCompressionDefaults.MimeTypes.Concat(new[] { "application/octet-stream" });
});

//Config DB Context
builder.Services.AddDbContext<ApplicationDbContext>(options =>
options.UseNpgsql(builder.Configuration.GetConnectionString("nekkoDb") ?? throw new InvalidOperationException("Connection string 'dbContext' not found.")));

//Config for Identity
builder.Services.AddIdentity<AspNetUsers, IdentityRole>().AddEntityFrameworkStores<ApplicationDbContext>();
builder.Services.AddAuthorization();
builder.Services.Configure<IdentityOptions>(options =>
{
    options.SignIn.RequireConfirmedPhoneNumber = false;
    options.SignIn.RequireConfirmedEmail = false;
    options.SignIn.RequireConfirmedAccount = false;
});

//Configuracion del CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin",
        builder =>
        {
            builder.WithOrigins("https://localhost:5173")
                   .AllowAnyHeader()
                   .AllowAnyMethod();
        });
    options.AddPolicy("SignalROrigin",
        builder =>
        {
            builder.WithOrigins("https://localhost:5173")
                   .AllowAnyHeader()
                   .AllowAnyMethod()
                   .AllowCredentials();
        });
});

//Necessary Injections
builder.Services.AddScoped<iMessageService, MessageServices>();
builder.Services.AddScoped<iGroupChatMessageService, GroupChatMessageServices>();
builder.Services.AddScoped<iNotificationService, NotificationService>();
builder.Services.AddTransient<iFriendRequestService, FriendRequestService>();

//Signal R Config
builder.Services.AddSignalR();

//AutoMapper Config
builder.Services.AddAutoMapper((cfg) =>
{
    cfg.CreateMap<AspNetUsers, UserDTO>();
});

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

app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

//Middlelane De CORS
app.UseCors("SignalROrigin");
app.UseCors("AllowSpecificOrigin");

//app.UseSignalR();

app.MapFallbackToFile("/index.html");

//Map de los Hub
app.MapHub<PrivateChatHub>("/privatechathub");
app.MapHub<GroupChatHub>("/groupchathub");

app.Run();


