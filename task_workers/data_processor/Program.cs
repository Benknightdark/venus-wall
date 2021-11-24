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
            }
    };
    app.Logger.LogInformation("註冊dapr pubsub broker");
    return (subscriptions);
});

// 更新jkf論壇資料
app.MapPost("/process-jkf", async (ItemService _ItemService, MessageQueueModel MessageData) =>
 {
     await _ItemService.UpdateItemData(MessageData);
     return (MessageData);
 });

// 更新mdk論壇資料
app.MapPost("/process-mdk", async (ItemService _ItemService, MessageQueueModel MessageData) =>
 {
     await _ItemService.UpdateItemData(MessageData);
     return (MessageData);
 });
app.Run();
