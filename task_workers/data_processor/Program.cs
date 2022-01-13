using data_processor.Models.DBModels;
using data_processor.Models.ViewModels;
using data_processor.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddPooledDbContextFactory<BeautyDBContext>(options =>
               options.UseSqlServer(Environment.GetEnvironmentVariable("DOTNET_DB_CONNECT_STRING"),
               opts => opts.CommandTimeout((int)TimeSpan.FromMinutes(10).TotalSeconds))
            );
builder.Services.AddScoped<ItemService>();
builder.Services.AddScoped<CrawlerLogService>();
var app = builder.Build();

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
    return (subscriptions);
});

// 更新jkf論壇資料
app.MapPost("/process-jkf", async (MessageQueueModel MessageData, ItemService _ItemService,  CrawlerLogService _crawlerLogService) =>
 {
     await _ItemService.UpdateItemData(MessageData);
     await _crawlerLogService.UpdateData(System.Text.Json.JsonSerializer.Serialize(MessageData));
     return (MessageData);
 });

// 更新mdk論壇資料
app.MapPost("/process-mdk", async (MessageQueueModel MessageData,ItemService _ItemService, CrawlerLogService _crawlerLogService) =>
 {
     await _ItemService.UpdateItemData(MessageData);
     await _crawlerLogService.UpdateData(System.Text.Json.JsonSerializer.Serialize(MessageData));
     return (MessageData);
 });
// 更新論壇文章標題相似度計算資料
app.MapPost("/process-text-similariy", async (MessageQueueModel MessageData,CrawlerLogService _crawlerLogService) =>
 {
     return (MessageData);
 }); 
// 更新爬蟲執行log資料
app.MapPost("/process-log", async (MessageQueueModel MessageData,CrawlerLogService _crawlerLogService) =>
 {
     await _crawlerLogService.UpdateData(System.Text.Json.JsonSerializer.Serialize(MessageData));
     return (MessageData);
 });
app.Run();
