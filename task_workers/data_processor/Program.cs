using data_processor.Models.DBModels;
using data_processor.Models.ViewModels;
using Microsoft.EntityFrameworkCore;

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
app.MapPost("/process-jkf", async (BeautyDBContext db, MessageQueueModel ItemData) =>
{
      var Data = System.Text.Json.JsonSerializer.Serialize(ItemData.data);
      Console.WriteLine(Data);
    return Data;
});
app.Run();
