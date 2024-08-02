using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Persistence.Persistence;

namespace Persistence;

//Esta clase solo se utiliza para poder generar una base de datos temporal y generar las migraciones
public class FileExplorerContextFactory : IDesignTimeDbContextFactory<FileExplorerContext>
{
    public FileExplorerContext CreateDbContext(string[] args)
    {
        var optionsBuilder = new DbContextOptionsBuilder<FileExplorerContext>();
        optionsBuilder.UseSqlite("Data Source=FileExplorer.db");
        return new FileExplorerContext(optionsBuilder.Options);
    }
}