using Core.Domain;
using Core.Repositories;
using WebApi.Utils;
using WebApi.Utils.Configuration;
using WebApi.Utils.Storage;

namespace WebApi.Models.Files.Content;

class ContentService
{
    private readonly IUnitOfWork _unitOfWork;
    public IStorage storage;
    private readonly string _folder;

    private readonly FileSettingsConfiguration _fileSettingsConfiguration;
    private readonly FilesConfiguration _filesConfiguration;
    public ContentService(
        IUnitOfWork unitOfWork,
        FilesConfiguration filesConfiguration,
        FileSettingsConfiguration fileSettingsConfiguration
    )
    {
        storage = new LocalStorage();
        _unitOfWork = unitOfWork;
        _folder = filesConfiguration.Paths!.Media!;
        _filesConfiguration = filesConfiguration;
        _fileSettingsConfiguration = fileSettingsConfiguration;
    }

    public async Task<Media> UploadMedia(IFormFile file, Media media)
    {

        media.Filename = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
        media.OriginalFilename = file.FileName;
        media.MediaTypeId = _fileSettingsConfiguration.GetFileMediaType(file.FileName)!.Value;

        var path = Path.Join(_folder, media.Filename);

        await storage.UploadFileAsync(file, path);

        return media;

    }

    public async Task DeleteMedia(Guid fileId)
    {

        var media = await _unitOfWork.Medias.GetAsync(fileId);

        if (media == null) return;

        await storage.DeleteFileAsync(Path.Join(_folder, media.Filename));
    }

}