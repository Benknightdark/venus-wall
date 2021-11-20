using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using data_processor.Models.DBModels;

namespace data_processor.Models.ViewModels;

public class ItemImageMessageModel
{
    public Item Item { get; set; }
    public List<Image> Images { get; set; }
}
