using System;
using System.Collections.Generic;

namespace data_processor.Models.DBModels
{
    public partial class CrawlerLog
    {
        public Guid ID { get; set; }
        public DateTime? CreateDateTime { get; set; }
        public string? RawData { get; set; }
    }
}
