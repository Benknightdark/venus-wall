namespace data_processor.Models.ViewModels;

    public class MessageQueueModel
    {
        
    public string? datacontenttype { get; set; }
    public string? source { get; set; }
    public string? topic { get; set; }
    public string? traceid { get; set; }
    public object? data { get; set; }
}
