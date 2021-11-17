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
app.MapPost("/process-jkf", async ( MessageQueueModel MessageData) =>
{
    var Data = System.Text.Json.JsonSerializer.Serialize(MessageData.data);
    var ItemData = JsonConvert.DeserializeObject<Item>(Data);

    app.Logger.LogInformation(ItemData!.Title);
    app.Logger.LogInformation(ItemData.Page.ToString());
    app.Logger.LogInformation(ItemData.WebPageID.ToString());
    app.Logger.LogInformation(ItemData.ID.ToString());
    app.Logger.LogInformation(ItemData.ModifiedDateTime.ToString());
    using (var scope = app.Services.CreateScope())
    {
        var db= scope.ServiceProvider.GetRequiredService<BeautyDBContext>();
        
        app.Logger.LogInformation(db.Items.Count().ToString());

    }
   // var CurrentItme=db.Items.Where(a=>a.Title==ItemData.Title);
    // app.Logger.LogInformation((await CurrentItme.AnyAsync()).ToString());
    //if (CurrentItme.Any()){
       // var UpdateCurrentItme=await CurrentItme.FirstAsync();
        //app.Logger.LogInformation(UpdateCurrentItme.Title);
        // UpdateCurrentItme.Title=ItemData.Title;
        // UpdateCurrentItme.PageName=ItemData.PageName;
        // UpdateCurrentItme.Url=ItemData.Url;
        // UpdateCurrentItme.Avator=ItemData.Avator;
        // UpdateCurrentItme.ModifiedDateTime=ItemData.ModifiedDateTime;
        // UpdateCurrentItme.Page=ItemData.Page;
        // UpdateCurrentItme.Seq=ItemData.Seq;
        // db.Update(UpdateCurrentItme);
    //}
    // else{
    //     await db.AddAsync(ItemData);
    // }

    // if(ItemData.Images.Count()>0){
    //         var CurrentImages=db.Images.Where(a=>a.ItemID==ItemData.ID);
    //         if (await CurrentImages.AnyAsync())
    //             db.RemoveRange(CurrentImages);  
    //         await db.AddAsync(ItemData.Images);       
    // }
    // await db.SaveChangesAsync();
    app.Logger.LogInformation("=============");

    return (Data);
});
app.Run();
