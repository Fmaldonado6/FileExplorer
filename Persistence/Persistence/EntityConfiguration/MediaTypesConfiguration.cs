using Core.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Persistence.Persistence.EntityConfiguration.Content;


//Configuraciones de la tabla de MediaTypes
public class MediaTypesConfiguration : IEntityTypeConfiguration<MediaType>
{
    public void Configure(EntityTypeBuilder<MediaType> builder)
    {
        builder.HasKey(c => c.Id);

        builder.Property(c => c.Id)
            .ValueGeneratedOnAdd();

        builder.Property(c => c.Name)
            .IsRequired();

        builder.HasMany(c => c.Medias)
            .WithOne(c => c.MediaType)
            .HasForeignKey(c => c.MediaTypeId);

        builder.ToTable("MediaTypes");
    }
}