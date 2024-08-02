
namespace Core.Domain;

public class Media
{
    public Guid Id { get; set; }
    public string Filename { get; set; } = null!;
    public string OriginalFilename { get; set; } = null!;
    public long MediaTypeId { get; set; }
    public Guid? MediaFolderId { get; set; }
    public DateTime DateCreated { get; set; }


    //Propiedades de navegación para EntityFramework
    public MediaType MediaType { get; set; } = null!;
    public MediaFolder? MediaFolder { get; set; }


}
