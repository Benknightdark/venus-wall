using System;
using System.Collections.Generic;

namespace data_processor.Models.DBModels
{
    public partial class Forum
    {
        public Forum()
        {
            WebPages = new HashSet<WebPage>();
        }

        public Guid ID { get; set; }
        public string? Name { get; set; }
        public string? WorkerName { get; set; }
        public DateTime? CreatedTime { get; set; }
        public bool? Enable { get; set; }
        public int? Seq { get; set; }

        public virtual ICollection<WebPage> WebPages { get; set; }
    }
}
