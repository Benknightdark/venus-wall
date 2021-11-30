using System;
using System.Collections.Generic;

namespace data_processor.Models.DBModels
{
    public partial class WebPageSimilarity
    {
        public Guid ID { get; set; }
        public Guid? WebPageID { get; set; }
        public Guid? TargetItemID { get; set; }
        public Guid? SimilarityItemID { get; set; }
        public string? SimilarityItemTitle { get; set; }
        public double? SimilarityRation { get; set; }

        public virtual Item? TargetItem { get; set; }
        public virtual WebPage? WebPage { get; set; }
    }
}
