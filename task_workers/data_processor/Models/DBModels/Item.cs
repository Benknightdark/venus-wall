using System;
using System.Collections.Generic;

namespace data_processor.Models.DBModels
{
    public partial class Item
    {
        public Item()
        {
            Images = new HashSet<Image>();
            WebPageSimilarities = new HashSet<WebPageSimilarity>();
        }

        public Guid ID { get; set; }
        public Guid WebPageID { get; set; }
        public string Title { get; set; } = null!;
        public string PageName { get; set; } = null!;
        public string Url { get; set; } = null!;
        public string? Avator { get; set; }
        public DateTime? ModifiedDateTime { get; set; }
        public int? Page { get; set; }
        public int? Seq { get; set; }
        public bool? Enable { get; set; }

        public virtual WebPage WebPage { get; set; } = null!;
        public virtual ICollection<Image> Images { get; set; }
        public virtual ICollection<WebPageSimilarity> WebPageSimilarities { get; set; }
    }
}
