using data_processor.Models.DBModels;
using data_processor.Models.ViewModels;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddDbContext<BeautyDBContext>(options =>
               options.UseSqlServer(builder.Configuration.GetConnectionString("db"))
            );
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
            }
    };
    app.Logger.LogInformation("註冊dapr pubsub broker");
    return (subscriptions);
});

// 更新jkf論壇資料
app.MapPost("/process-jkf", async (BeautyDBContext db, MessageQueueModel MessageData) =>
 {
     var Data = System.Text.Json.JsonSerializer.Serialize(MessageData.data);
     var ItemData = JsonConvert.DeserializeObject<ItemImageMessageModel>(Data);
     app.Logger.LogInformation(ItemData!.Item.Title);
     app.Logger.LogInformation(ItemData.Item.Page.ToString());
     app.Logger.LogInformation(ItemData.Item.WebPageID.ToString());
     app.Logger.LogInformation(ItemData.Item.ID.ToString());
     app.Logger.LogInformation(ItemData.Item.ModifiedDateTime.ToString());
     app.Logger.LogInformation(ItemData.Item.Images.Count().ToString());
     app.Logger.LogInformation("=====Start DB Process========");
     var CurrentItme = db.Items.Where(a => a.Title == ItemData.Item.Title);
     var NewItemID = Guid.Empty;
     if (CurrentItme.Any())
     {
        app.Logger.LogInformation("=====Update Item========");
         var UpdateCurrentItme = await CurrentItme.FirstAsync();
         app.Logger.LogInformation(UpdateCurrentItme.Title);
         UpdateCurrentItme.Title = ItemData!.Item.Title;
         UpdateCurrentItme.PageName = ItemData.Item.PageName;
         UpdateCurrentItme.Url = ItemData.Item.Url;
         UpdateCurrentItme.Avator = ItemData.Item.Avator;
         UpdateCurrentItme.ModifiedDateTime = ItemData.Item.ModifiedDateTime;
         UpdateCurrentItme.Page = ItemData.Item.Page;
         UpdateCurrentItme.Seq = ItemData.Item.Seq;
         db.Update(UpdateCurrentItme);
         NewItemID = UpdateCurrentItme.ID;
     }
     else
     {
        app.Logger.LogInformation("=====Insert Item========");
         NewItemID = ItemData!.Item.ID;
         await db.AddAsync(ItemData.Item);
     }
     if (ItemData.Images.Count() > 0)
     {
         foreach (var image in ItemData.Images)
         {
             image.ItemID = NewItemID;
         }
         var CurrentImages = db.Images.Where(a => a.ItemID == ItemData.Item.ID);
         if (await CurrentImages.AnyAsync())
         {
             db.RemoveRange(CurrentImages);
         }

         await db.AddRangeAsync(ItemData.Images);
        app.Logger.LogInformation("=====Insert Image========");
      
     }
     await db.SaveChangesAsync();
     app.Logger.LogInformation("=====End DB Process========");
     return (Data);
 });
app.Run();
