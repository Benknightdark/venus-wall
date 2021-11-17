using System;
using System.Collections.Generic;

namespace data_processor.Models.DBModels
{
    public partial class User
    {
        public Guid ID { get; set; }
        public string? UserName { get; set; }
        public Guid? ModifiedUserID { get; set; }
    }
}
