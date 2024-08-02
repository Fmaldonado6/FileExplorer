using Core.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Persistence.Persistence.EntityConfiguration;


//Configuraciones de la tabla de MediaFolder
public class MediaFolderConfiguration : IEntityTypeConfiguration<MediaFolder>
{
    public void Configure(EntityTypeBuilder<MediaFolder> builder)
    {
        builder.HasKey(c => c.Id);

        builder.Property(c => c.Id)
            .ValueGeneratedOnAdd();

        builder.Property(c => c.Name)
            .IsRequired();

        builder.Property(c => c.DateCreated)
            .IsRequired();

        builder.Property(c => c.DateUpdated)
            .IsRequired();


        builder.HasMany(c => c.Medias)
            .WithOne(c => c.MediaFolder)
            .HasForeignKey(c => c.MediaFolderId);

        builder.HasMany(c => c.Folders)
            .WithOne(c => c.ParentFolder)
            .HasForeignKey(c => c.ParentFolderId)
            .IsRequired(false)
            .OnDelete(DeleteBehavior.Cascade);


        builder.HasOne(c => c.ParentFolder)
            .WithMany(c => c.Folders)
            .HasForeignKey(c => c.ParentFolderId)
            .IsRequired(false)
            .OnDelete(DeleteBehavior.Cascade);


        builder.ToTable("MediaFolders");
    }
}