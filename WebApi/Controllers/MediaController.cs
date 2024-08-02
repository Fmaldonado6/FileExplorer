using AutoMapper;
using Core.Domain;
using Core.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Query;
using Microsoft.Extensions.Options;
using Persistence.Persistence;
using WebApi.Mapping.Resources.Medias;
using WebApi.Models.Files.Content;
using WebApi.Utils;
using WebApi.Utils.Binder;
using WebApi.Utils.Configuration;
using WebApi.Utils.Payload;

namespace WebApi.Controllers;

[ApiController]
[Route("Medias")]
public class MediaController : ControllerBase
{

    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<MediaController> _logger;
    private readonly FileSettingsConfiguration _fileSettingsConfiguration;
    private readonly ContentService _contentService;
    private readonly IMapper _mapper;

    public MediaController(
        FileExplorerContext fileExplorerContext,
        ILogger<MediaController> logger,
        IOptions<FileSettingsConfiguration> fileSettings,
        IOptions<FilesConfiguration> filesConfiguration,
        IMapper mapper
    )
    {
        _logger = logger;
        _unitOfWork = new UnitOfWork(fileExplorerContext);
        _fileSettingsConfiguration = fileSettings.Value;
        _mapper = mapper;
        _contentService = new ContentService(
            _unitOfWork,
            filesConfiguration.Value,
            fileSettings.Value
        );

    }


    [HttpGet("Folder")]
    [EnableQuery]
    public async Task<IActionResult> GetRootFoldersAndMedia()
    {

        try
        {

            var folders = await _unitOfWork.MediaFolders.GetChildFolders(null);
            var medias = await _unitOfWork.Medias.GetChildMedia(null);

            var resource = new FolderResource()
            {
                Folders = _mapper.Map<List<MediaFolder>, List<FolderResource>>(folders),
                Medias = _mapper.Map<List<Media>, List<MediaResource>>(medias),
                Name = "Root"
            };

            return Ok(resource);
        }
        catch (Exception e)
        {

            var error = new Payload("Cannot Get Media Content", Code.ArgumentException);
            _logger.LogError("{ErrorMessage} {ExceptionMessage}", error.Message, e.Message);
            return BadRequest(error);
        }
    }

    [HttpGet("Count")]
    public async Task<IActionResult> GetCompanyMediaCount(ODataQueryOptions<Media> options)
    {

        try
        {
            var medias = await _unitOfWork.Medias.GetMediaCount(options);

            return Ok(medias);
        }
        catch (Exception e)
        {

            var error = new Payload("Cannot Get Media Count", Code.ArgumentException);
            _logger.LogError("{ErrorMessage} {ExceptionMessage}", error.Message, e.Message);
            return BadRequest(error);
        }
    }

    [HttpGet("Folder/{folderId}")]
    [EnableQuery]
    public async Task<IActionResult> GetFolderAndMedia(string folderId)
    {
        try
        {

            var folder = await _unitOfWork.MediaFolders.GetFullFolder(new Guid(folderId));

            var resource = _mapper.Map<MediaFolder, FolderResource>(folder);

            return Ok(resource);
        }
        catch (Exception e)
        {

            var error = new Payload("Cannot Get Media Content", Code.ArgumentException);
            _logger.LogError("{ErrorMessage} {ExceptionMessage}", error.Message, e.Message);
            return BadRequest(error);
        }
    }

    [HttpDelete("Folder/{folderId}")]
    [EnableQuery]
    public async Task<IActionResult> DeleteFolder(string folderId)
    {

        try
        {
            var folder = await _unitOfWork.MediaFolders.GetAsync(new Guid(folderId));

            if (folder == null)
                return NotFound("Folder not found");

            _unitOfWork.MediaFolders.Remove(folder);
            await _unitOfWork.CompleteAsync();

            var resource = _mapper.Map<MediaFolder, FolderResource>(folder);

            return Ok(resource);
        }
        catch (Exception e)
        {

            var error = new Payload("Cannot Get Media Content", Code.ArgumentException);
            _logger.LogError("{ErrorMessage} {ExceptionMessage}", error.Message, e.Message);
            return BadRequest(error);
        }
    }


    [HttpPost("Folder")]
    [EnableQuery]
    public async Task<IActionResult> CreateFolder([FromBody] SaveFolderResource folderResource)
    {

        try
        {

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var folder = _mapper.Map<SaveFolderResource, MediaFolder>(folderResource);

            folder.DateCreated = DateTime.UtcNow;
            folder.DateUpdated = DateTime.UtcNow;

            _unitOfWork.MediaFolders.Add(folder);

            await _unitOfWork.CompleteAsync();

            folder = await _unitOfWork.MediaFolders.GetFullFolder(folder.Id);

            var resource = _mapper.Map<MediaFolder, FolderResource>(folder);

            return Ok(resource);
        }
        catch (Exception e)
        {

            var error = new Payload("Cannot Get Media Content", Code.ArgumentException);
            _logger.LogError("{ErrorMessage} {ExceptionMessage}", error.Message, e.Message);
            return BadRequest(error);
        }
    }


    [HttpPost("MoveHere")]
    [EnableQuery]
    public async Task<IActionResult> CreateFolder([FromBody] MoveMediaResource moveMediaResource)
    {

        try
        {

            if (!ModelState.IsValid)
                return BadRequest(ModelState);


            if (moveMediaResource.MoveToId != null)
            {
                var folderToMove = await _unitOfWork.MediaFolders.GetAsync(moveMediaResource.MoveToId.Value);

                if (folderToMove == null) return NotFound("Folder to move not found");

                folderToMove.DateUpdated = DateTime.UtcNow;
            }

            foreach (var mediaResource in moveMediaResource.MediaResources)
            {
                var media = await _unitOfWork.Medias.GetAsync(mediaResource.Id);

                if (media == null) continue;

                media.MediaFolderId = moveMediaResource.MoveToId;
            }

            foreach (var folderResource in moveMediaResource.FolderResources)
            {
                var folder = await _unitOfWork.MediaFolders.GetAsync(folderResource.Id);

                if (folder == null) continue;

                folder.ParentFolderId = moveMediaResource.MoveToId;
            }

            await _unitOfWork.CompleteAsync();

            return Ok();
        }
        catch (Exception e)
        {

            var error = new Payload("Cannot Get Media Content", Code.ArgumentException);
            _logger.LogError("{ErrorMessage} {ExceptionMessage}", error.Message, e.Message);
            return BadRequest(error);
        }
    }

    [HttpPost]
    [EnableQuery]
    [RequestSizeLimit(1_000_000_000)]

    public async Task<IActionResult> CreateMedia(
        [FromForm] IFormFile file,
        //Aqui se hace una mexicanada para en un mismo request enviar archivos y json en el FormData, mas info en la clase JsonModelBinder
        [ModelBinder(BinderType = typeof(JsonModelBinder))] SaveMediaResource mediaResource
    )
    {
        try
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // Validacion de archivos
            if (file == null)
                return BadRequest(new Payload("Null file", Code.ArgumentException));
            if (file.Length == 0)
                return BadRequest(new Payload("Empty file", Code.ArgumentException));
            if (file.Length > _fileSettingsConfiguration.MaxBytes)
                return BadRequest(new Payload("Max file size exceeded", Code.ArgumentException));
            if (!_fileSettingsConfiguration.IsSupported(file.FileName))
                return BadRequest(new Payload("Invalid file type", Code.ArgumentException));

            var media = _mapper.Map<SaveMediaResource, Media>(mediaResource);

            media.DateCreated = DateTime.UtcNow;

            _unitOfWork.Medias.Add(media);

            await _contentService.UploadMedia(file, media);
            await _unitOfWork.CompleteAsync();

            media = await _unitOfWork.Medias.GetAsync(media.Id);

            var resource = _mapper.Map<Media, MediaResource>(media!);

            return Ok(resource);
        }
        catch (Exception e)
        {

            var error = new Payload("Cannot Get Media Content", Code.ArgumentException);
            _logger.LogError("{ErrorMessage} {ExceptionMessage}", error.Message, e.Message);
            return BadRequest(error);
        }
    }

    [HttpDelete("{mediaId}")]
    [EnableQuery]
    public async Task<IActionResult> DeleteMedia(string mediaId)
    {

        try
        {
            var media = await _unitOfWork.Medias.GetAsync(new Guid(mediaId));

            if (media == null)
                return NotFound("Media not found");

            await _contentService.DeleteMedia(media.Id);

            _unitOfWork.Medias.Remove(media);
            
            await _unitOfWork.CompleteAsync();

            var resource = _mapper.Map<Media, MediaResource>(media);

            return Ok(resource);
        }
        catch (Exception e)
        {

            var error = new Payload("Cannot Get Media Content", Code.ArgumentException);
            _logger.LogError("{ErrorMessage} {ExceptionMessage}", error.Message, e.Message);
            return BadRequest(error);
        }
    }

}