using data_processor.Models.DBModels;
using data_processor.Models.ViewModels;
using Microsoft.EntityFrameworkCore;

namespace data_processor.Services;

public class ItemService
{
    private BeautyDBContext _db;
    private ILogger<ItemService> _logger;
    public ItemService(BeautyDBContext db, ILogger<ItemService> logger)
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
        var Data = System.Text.Json.JsonSerializer.Serialize(MessageData.data);
        var ItemData = Newtonsoft.Json.JsonConvert.DeserializeObject<ItemImageMessageModel>(Data);
        _logger.LogInformation(ItemData!.Item.Title);
        _logger.LogInformation(ItemData.Item.Page.ToString());
        _logger.LogInformation(ItemData.Item.WebPageID.ToString());
        _logger.LogInformation(ItemData.Item.ID.ToString());
        _logger.LogInformation(ItemData.Item.ModifiedDateTime.ToString());
        _logger.LogInformation(ItemData.Item.Images.Count().ToString());
        _logger.LogInformation("=====Start DB Process========");
        var CurrentItme = _db.Items.Where(a => a.Title == ItemData.Item.Title);
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
            _db.Update(UpdateCurrentItme);
            NewItemID = UpdateCurrentItme.ID;
        }
        else
        {
            _logger.LogInformation("=====Insert Item========");
            NewItemID = ItemData!.Item.ID;
            await _db.AddAsync(ItemData.Item);
        }
        if (ItemData.Images.Count() > 0)
        {
            foreach (var image in ItemData.Images)
            {
                image.ItemID = NewItemID;
            }
            var CurrentImages = _db.Images.Where(a => a.ItemID == ItemData.Item.ID);
            if (await CurrentImages.AnyAsync())
            {
                _db.RemoveRange(CurrentImages);
            }

            await _db.AddRangeAsync(ItemData.Images);
            _logger.LogInformation("=====Insert Image========");

        }
        await _db.SaveChangesAsync();
        _logger.LogInformation("=====End DB Process========");
    }
}
