public partial class ElasticUserDTO
{
    public ElasticUserDTO()
    {
        Id = Guid.NewGuid();
    }
    public Guid Id { get; set; }
    public Dictionary<string, object>? user_days_json { get; set; }

}
