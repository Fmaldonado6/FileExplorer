using Core.Domain;
using Microsoft.EntityFrameworkCore;

namespace Persistence.Persistence.Seeds;


public static class MediaTypeSeed
{
    public static void Seed(ModelBuilder modelBuilder)
    {

        modelBuilder.Entity<MediaType>().HasData(
            new MediaType { Id = MediaType.Image, Name = "Image" },
            new MediaType { Id = MediaType.Video, Name = "Video" },
            new MediaType { Id = MediaType.File, Name = "File" }

        );

    }
}