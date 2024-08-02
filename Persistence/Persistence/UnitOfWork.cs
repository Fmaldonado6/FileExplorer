using Core.Domain;
using Core.Repositories;
using Persistence.Persistence.Repositories;

namespace Persistence.Persistence;

//Esta clase se utiliza para crear las implementaciones de los repositorios
//La conexion a la base de datos (FileExplorerContext) se inyecta a través del constructor 
//pues se utiliza la misma instancia en toda la aplicación

//Esta clase no contiene ninguna referencia a la base de datos que utilizamos para que pueda ser cambiada facilmente
public class UnitOfWork : IUnitOfWork
{

    private readonly FileExplorerContext _context;

    public UnitOfWork(FileExplorerContext context)
    {
        _context = context;
        Medias = new MediaRepository(context);
        MediaFolders = new MediaFolderRepository(context);
    }

    public IMediasRepository Medias { get; set; }
    public IMediaFoldersRepository MediaFolders { get; set; }

    public int Complete()
    {
        return _context.SaveChanges();
    }

    public Task CompleteAsync()
    {
        return _context.SaveChangesAsync();
    }

    public void Dispose()
    {
        _context.Dispose();
        GC.SuppressFinalize(this);
    }
}