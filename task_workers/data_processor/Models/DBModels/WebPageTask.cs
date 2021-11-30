using System;
using System.Collections.Generic;

namespace data_processor.Models.DBModels
{
    public partial class WebPageTask
    {
        public Guid ID { get; set; }
        public Guid? WebPageID { get; set; }
        public Guid? TaskID { get; set; }

        public virtual WebPage? WebPage { get; set; }
    }
}
