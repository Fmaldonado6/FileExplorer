using System.ComponentModel.DataAnnotations;

namespace WebApi.Mapping.Resources.Medias;


public class MoveMediaResource
{
    public Guid? MoveToId { get; set; }

    [Required]
    public List<MediaResource> MediaResources { get; set; } = new();
    [Required]
    public List<FolderResource> FolderResources { get; set; } = new();

}