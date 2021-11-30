using System;
using System.Collections.Generic;

namespace data_processor.Models.DBModels
{
    public partial class WebPage
    {
        public WebPage()
        {
            Items = new HashSet<Item>();
            WebPageSimilarities = new HashSet<WebPageSimilarity>();
            WebPageTasks = new HashSet<WebPageTask>();
        }

        public Guid ID { get; set; }
        public Guid? ForumID { get; set; }
        public string Name { get; set; } = null!;
        public string Url { get; set; } = null!;
        public int? Seq { get; set; }
        public bool? Enable { get; set; }

        public virtual Forum? Forum { get; set; }
        public virtual ICollection<Item> Items { get; set; }
        public virtual ICollection<WebPageSimilarity> WebPageSimilarities { get; set; }
        public virtual ICollection<WebPageTask> WebPageTasks { get; set; }
    }
}
