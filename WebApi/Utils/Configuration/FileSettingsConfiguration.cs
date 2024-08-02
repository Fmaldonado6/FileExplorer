
using Core.Domain;

namespace WebApi.Utils;


public class FileSettingsConfiguration
{
    public int MaxBytes { get; set; }

    public List<string> AcceptedFileTypes { get; set; } = null!;
    public List<string> AcceptedImageFileTypes { get; set; } = null!;
    public List<string> AcceptedVideoFileTypes { get; set; } = null!;

    public bool IsSupported(string fileName)
    {
        var extension = Path.GetExtension(fileName).ToLower();
        return AcceptedFileTypes.Any(s => s == extension)
        || AcceptedImageFileTypes.Any(s => s == extension)
        || AcceptedVideoFileTypes.Any(s => s == extension);
    }

    public long? GetFileMediaType(string fileName)
    {
        var extension = Path.GetExtension(fileName).ToLower();
        if (AcceptedImageFileTypes.Any(s => s == extension))
            return MediaType.Image;

        if (AcceptedVideoFileTypes.Any(s => s == extension))
            return MediaType.Video;

        if (AcceptedFileTypes.Any(s => s == extension))
            return MediaType.File;
            
        return null;
    }
}