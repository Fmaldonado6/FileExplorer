using System;
using System.Linq;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using Core.Repositories;
using Core.Domain;

namespace Persistence.Persistence.Repositories;

public class MediaFolderRepository : Repository<MediaFolder>, IMediaFoldersRepository
{
    public MediaFolderRepository(FileExplorerContext context) : base(context)
    {
    }

    private FileExplorerContext FileExplorerContext => Context;

    public async Task<List<MediaFolder>> GetChildFolders(Guid? parent)
    {
        return await FileExplorerContext.MediaFolders
        .Where(e => e.ParentFolderId == parent)
        .ToListAsync();
    }

    public async Task<MediaFolder> GetFullFolder(Guid folderId)
    {
        return await FileExplorerContext.MediaFolders
        .Include(e => e.Medias)
        .Include(e => e.Folders)
        .FirstAsync(e => e.Id == folderId);

    }
}