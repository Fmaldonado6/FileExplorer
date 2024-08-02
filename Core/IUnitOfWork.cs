namespace Core.Repositories;


public interface IUnitOfWork : IDisposable
{


    IMediasRepository Medias { get; }
    IMediaFoldersRepository MediaFolders { get; }

    int Complete();
    Task CompleteAsync();
}