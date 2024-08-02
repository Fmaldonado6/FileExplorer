using System.ComponentModel.DataAnnotations;

namespace WebApi.Mapping.Resources.Medias;

public class SaveFolderResource
{
    public Guid? Id { get; set; }

    [Required]
    public string Name { get; set; } = null!;
    public Guid? ParentFolderId { get; set; }

}