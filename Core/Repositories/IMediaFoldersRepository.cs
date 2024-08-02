
using Core.Domain;

namespace Core.Repositories;
public interface IMediaFoldersRepository : IRepository<MediaFolder>
{
    Task<List<MediaFolder>> GetChildFolders(Guid? parent);
    Task<MediaFolder> GetFullFolder(Guid folderId);

}
