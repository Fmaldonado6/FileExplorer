
namespace Core.Domain;

public class MediaFolder
{
    public Guid Id { get; set; }
    public string Name { get; set; } = null!;

    public Guid? ParentFolderId { get; set; }
    public DateTime DateCreated { get; set; }
    public DateTime DateUpdated { get; set; }

    //Propiedades de navegación para EntityFramework
    public MediaFolder? ParentFolder { get; set; }
    public List<Media> Medias { get; set; } = new();
    public List<MediaFolder> Folders { get; set; } = new();
}