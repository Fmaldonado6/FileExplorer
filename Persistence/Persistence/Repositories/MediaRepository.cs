using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.OData.Query;
using Microsoft.AspNetCore.OData.Query.Validator;
using Core.Repositories;
using Core.Domain;

namespace Persistence.Persistence.Repositories;

public class MediaRepository : Repository<Media>, IMediasRepository
{
    public MediaRepository(FileExplorerContext context) : base(context)
    {
    }

    private FileExplorerContext FileExplorerContext => Context;

    public async Task<List<Media>> GetChildMedia(Guid? parent)
    {
        return await FileExplorerContext.Medias
         .Where(e => e.MediaFolderId == parent)
         .ToListAsync();
    }

    public Task<int> GetMediaCount(ODataQueryOptions<Media> options)
    {
        var tests = FileExplorerContext.Medias;

        options.Validate(new ODataValidationSettings()
        {
            AllowedQueryOptions = AllowedQueryOptions.Filter | AllowedQueryOptions.Skip | AllowedQueryOptions.Top
        });

        var filteredRecords = (IQueryable<Media>)options.ApplyTo(tests);

        return filteredRecords.CountAsync();
    }
}