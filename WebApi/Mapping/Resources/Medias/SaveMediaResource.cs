using System.ComponentModel.DataAnnotations;

namespace WebApi.Mapping.Resources.Medias;

public class SaveMediaResource
{
    public Guid? MediaFolderId { get; set; }
}