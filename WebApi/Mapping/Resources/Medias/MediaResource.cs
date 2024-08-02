namespace WebApi.Mapping.Resources.Medias;

public class MediaResource
{
     public Guid Id { get; set; }
    public string Filename { get; set; } = null!;
    public string OriginalFilename { get; set; } = null!;
    public long MediaTypeId { get; set; }
    public Guid? MediaFolderId { get; set; }
    public DateTime DateCreated { get; set; }

}