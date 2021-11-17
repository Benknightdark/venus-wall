using data_processor.Models.DBModels;
using data_processor.Models.ViewModels;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddDbContext<BeautyDBContext>(options =>
               options.UseSqlServer(builder.Configuration.GetConnectionString("db"))
            );
var app = builder.Build();

app.MapGet("/", () => "Hello World!111");
// 註冊dapr pubsub broker
app.MapGet("/dapr/subscribe", () =>
{
    var subscriptions = new List<dynamic>{
         new
            {
                pubsubname = "pubsub",
                topic = "process-jkf",
                route = "/process-jkf"
            }
    };
    return (subscriptions);
});

// 更新jkf論壇資料
app.MapPost("/process-jkf", (BeautyDBContext db, MessageQueueModel MessageData) =>
{
    var Data = System.Text.Json.JsonSerializer.Serialize(MessageData.data);
    var ItemData = JsonConvert.DeserializeObject<Item>(Data);

    app.Logger.LogInformation(ItemData!.Title);
    app.Logger.LogInformation(ItemData.Page.ToString());
    app.Logger.LogInformation(ItemData.WebPageID.ToString());
    app.Logger.LogInformation(ItemData.ID.ToString());
    app.Logger.LogInformation(ItemData.ModifiedDateTime.ToString());

    app.Logger.LogInformation("=============");

    return global::System.Threading.Tasks.Task.FromResult(Data);
});
app.Run();
