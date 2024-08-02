using Core.Domain;
using Microsoft.AspNetCore.OData.Query;

namespace Core.Repositories;
public interface IMediasRepository : IRepository<Media>
{

    Task<List<Media>> GetChildMedia(Guid? parent);
    Task<int> GetMediaCount(ODataQueryOptions<Media> options);


}
