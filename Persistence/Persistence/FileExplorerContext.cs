using Core.Domain;
using Microsoft.EntityFrameworkCore;
using Persistence.Persistence.EntityConfiguration;
using Persistence.Persistence.Seeds;

namespace Persistence.Persistence;
public class FileExplorerContext : DbContext
{
    public FileExplorerContext(DbContextOptions<FileExplorerContext> options) : base(options)
    {


    }

    //Se genera automaticamente la configuracion de la base de datos con las configuraciones que definimos en EntityConfiguration
    override protected void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfiguration(new MediaConfiguration());
        modelBuilder.ApplyConfiguration(new MediaFolderConfiguration());

        //Se agregan el catalogo por defecto a la base de datos
        MediaTypeSeed.Seed(modelBuilder);
    }

    public DbSet<Media> Medias { get; set; }
    public DbSet<MediaFolder> MediaFolders { get; set; }
    public DbSet<MediaType> MediaTypes { get; set; }
}