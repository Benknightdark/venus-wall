using System;
using System.Collections.Generic;

namespace data_processor.Models.DBModels
{
    public partial class Image
    {
        public Guid ID { get; set; }
        public Guid ItemID { get; set; }
        public string Url { get; set; } = null!;

        public virtual Item Item { get; set; } = null!;
    }
}
