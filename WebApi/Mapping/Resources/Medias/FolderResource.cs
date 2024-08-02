namespace WebApi.Mapping.Resources.Medias;

public class FolderResource
{

    public Guid Id { get; set; }
    public string? Name { get; set; }

    public Guid? ParentFolderId { get; set; }

    public DateTime? DateCreated { get; set; }
    public DateTime? DateUpdated { get; set; }

    public List<MediaResource> Medias { get; set; } = new();
    public List<FolderResource> Folders { get; set; } = new();


}