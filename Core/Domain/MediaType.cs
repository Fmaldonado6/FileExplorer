namespace Core.Domain;

public class MediaType
{
    public long Id { get; set; }

    public string Name { get; set; } = null!;

    public List<Media> Medias { get; set; } = new();

    public static readonly long Image = 1;
    public static readonly long Video = 2;
    public static readonly long File = 3;

}
