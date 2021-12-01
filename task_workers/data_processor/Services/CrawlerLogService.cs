using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using data_processor.Models.DBModels;

namespace data_processor.Services;

public class CrawlerLogService
{
    private BeautyDBContext _db;
    private ILogger<CrawlerLogService> _logger;
    public CrawlerLogService(BeautyDBContext db, ILogger<CrawlerLogService> logger)
    {
        _db = db;
        _logger = logger;
    }
    /// <summary>
    /// 更新爬蟲執行的LOG記錄
    /// </summary>
    /// <param name="LogJsonString"></param>
    /// <returns></returns>
    public async Task UpdateData(string LogJsonString)
    {
        try
        {
            await _db.AddAsync(new CrawlerLog()
            {
                ID = Guid.NewGuid(),
                CreateDateTime = DateTime.Now,
                RawData = LogJsonString
            });
            await _db.SaveChangesAsync();
            _logger.LogInformation("INSERT LOG DATA");

        }
        catch (Exception e)
        {
            _logger.LogInformation("=====Exception========");
            _logger.LogError(e.Message);
            _logger.LogInformation("=====Exception========");
            throw e;
        }
        finally
        {
            await _db.DisposeAsync();
        }
    }
}
