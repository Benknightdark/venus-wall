using data_processor.Models.DBModels;
using data_processor.Models.ViewModels;
using Microsoft.EntityFrameworkCore;

namespace data_processor.Services;

public class ItemService
{
    private IDbContextFactory<BeautyDBContext> _db;
    private ILogger<ItemService> _logger;
    public ItemService(IDbContextFactory<BeautyDBContext> db, ILogger<ItemService> logger)
    {
        _db = db;
        _logger = logger;
    }
    /// <summary>
    /// 儲存或更新已爬取到的論壇貼文資料
    /// </summary>
    /// <param name="MessageData"></param>
    /// <returns></returns>
    public async Task UpdateItemData(MessageQueueModel MessageData)
    {

        using (var context = _db.CreateDbContext())
        {
            
       
        try
        {
            var Data = System.Text.Json.JsonSerializer.Serialize(MessageData.data);
            var ItemData = Newtonsoft.Json.JsonConvert.DeserializeObject<ItemImageMessageModel>(Data);
            _logger.LogInformation(ItemData!.Item.Title);
            _logger.LogInformation(ItemData.Item.Page.ToString());
            _logger.LogInformation(ItemData.Item.WebPageID.ToString());
            _logger.LogInformation(ItemData.Item.ID.ToString());
            _logger.LogInformation(ItemData.Item.ModifiedDateTime.ToString());
            _logger.LogInformation(ItemData.Item.Images.Count().ToString());
            _logger.LogInformation("=====Start DB Process========");
            var CurrentItme = context.Items.Where(a => a.Title == ItemData.Item.Title);
            var NewItemID = Guid.Empty;
            if (CurrentItme.Any())
            {
                _logger.LogInformation("=====Update Item========");
                var UpdateCurrentItme = await CurrentItme.FirstAsync();
                _logger.LogInformation(UpdateCurrentItme.Title);
                UpdateCurrentItme.Title = ItemData!.Item.Title;
                UpdateCurrentItme.PageName = ItemData.Item.PageName;
                UpdateCurrentItme.Url = ItemData.Item.Url;
                UpdateCurrentItme.Avator = ItemData.Item.Avator;
                UpdateCurrentItme.ModifiedDateTime = ItemData.Item.ModifiedDateTime;
                UpdateCurrentItme.Page = ItemData.Item.Page;
                UpdateCurrentItme.Seq = ItemData.Item.Seq;
                context.Update(UpdateCurrentItme);
                NewItemID = UpdateCurrentItme.ID;
            }
            else
            {
                _logger.LogInformation("=====Insert Item========");
                NewItemID = ItemData!.Item.ID;
                await context.AddAsync(ItemData.Item);
            }
            if (ItemData.Images.Count() > 0)
            {
                foreach (var image in ItemData.Images)
                {
                    image.ItemID = NewItemID;
                }
                var CurrentImages = context.Images.Where(a => a.ItemID == ItemData.Item.ID);
                if (await CurrentImages.AnyAsync())
                {
                    context.RemoveRange(CurrentImages);
                }

                await context.AddRangeAsync(ItemData.Images);
                _logger.LogInformation("=====Insert Image========");

            }
            await context.SaveChangesAsync();
            _logger.LogInformation("=====End DB Process========");
        }
        catch (Exception e)
        {
            _logger.LogInformation("=====Exception========");
            _logger.LogError(e.Message);
            _logger.LogInformation("=====Exception========");
        }
        finally
        {
            await context.DisposeAsync();
        }

 }
    }
}
