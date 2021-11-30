using data_processor.Models.DBModels;
using data_processor.Models.ViewModels;
using data_processor.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddDbContext<BeautyDBContext>(options =>
               options.UseSqlServer(builder.Configuration.GetConnectionString("db"),
               opts => opts.CommandTimeout((int)TimeSpan.FromMinutes(10).TotalSeconds))
            );
builder.Services.AddScoped<ItemService>();
builder.Services.AddScoped<CrawlerLogService>();

var app = builder.Build();

app.MapGet("/", async (BeautyDBContext db) => await db.Items.FirstAsync());
// 註冊dapr pubsub broker
app.MapGet("/dapr/subscribe", () =>
{
    var subscriptions = new List<dynamic>{
         new
            {
                pubsubname = "pubsub",
                topic = "process-jkf",
                route = "/process-jkf"
            },
            new
            {
                pubsubname = "pubsub",
                topic = "process-mdk",
                route = "/process-mdk"
            },
                        new
            {
                pubsubname = "pubsub",
                topic = "process-log",
                route = "/process-log"
            },
    };
    app.Logger.LogInformation("註冊dapr pubsub broker");
    return (subscriptions);
});

// 更新jkf論壇資料
app.MapPost("/process-jkf", async (ItemService _ItemService, CrawlerLogService _crawlerLogService, MessageQueueModel MessageData) =>
 {
     await _ItemService.UpdateItemData(MessageData);
     await _crawlerLogService.UpdateData(System.Text.Json.JsonSerializer.Serialize(MessageData));
     return (MessageData);
 });

// 更新mdk論壇資料
app.MapPost("/process-mdk", async (ItemService _ItemService, CrawlerLogService _crawlerLogService, MessageQueueModel MessageData) =>
 {
     await _ItemService.UpdateItemData(MessageData);
     await _crawlerLogService.UpdateData(System.Text.Json.JsonSerializer.Serialize(MessageData));
     return (MessageData);
 });
// 更新爬蟲執行log資料
app.MapPost("/process-log", async (CrawlerLogService _crawlerLogService, MessageQueueModel MessageData) =>
 {
     await _crawlerLogService.UpdateData(System.Text.Json.JsonSerializer.Serialize(MessageData));
     return (MessageData);
 });
app.Run();
