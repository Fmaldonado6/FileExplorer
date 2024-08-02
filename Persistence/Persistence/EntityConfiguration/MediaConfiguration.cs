using Core.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Persistence.Persistence.EntityConfiguration;

//Configuraciones de la tabla de Media
public class MediaConfiguration : IEntityTypeConfiguration<Media>
{
    public void Configure(EntityTypeBuilder<Media> builder)
    {
        builder.HasKey(c => c.Id);

        builder.Property(c => c.Id)
            .ValueGeneratedOnAdd();


        builder.Property(c => c.Filename)
            .IsRequired();

        builder.Property(c => c.OriginalFilename)
            .IsRequired();

        builder.Property(c => c.DateCreated)
            .IsRequired();

        builder.HasOne(c => c.MediaFolder)
            .WithMany(c => c.Medias)
            .HasForeignKey(c => c.MediaFolderId)
            .IsRequired(false)
            .OnDelete(DeleteBehavior.Cascade);


        builder.HasOne(c => c.MediaType)
            .WithMany(c => c.Medias)
            .HasForeignKey(c => c.MediaTypeId);

        builder.ToTable("Medias");
    }
}