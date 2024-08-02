

namespace WebApi.Utils.Storage;

//Implementacion de la interfaz IStorage para almacenamiento local
public class LocalStorage : IStorage
{


    public async Task<string> UploadFileAsync(IFormFile imageFile, string fileNameForStorage)
    {

        var file = new FileInfo(fileNameForStorage);
        file?.Directory?.Create();

        using (Stream fileStream = new FileStream(fileNameForStorage, FileMode.Create))
        {
            await imageFile.CopyToAsync(fileStream);
        }

        return fileNameForStorage;
    }

    public async Task DeleteFileAsync(string fileNameForStorage)
    {
        var file = new FileInfo(fileNameForStorage);
        file.Delete();
    }

    public async Task<string> UploadBase64Async(string imageData, string fileNameForStorage)
    {

        var file = new FileInfo(fileNameForStorage);
        file?.Directory?.Create();

        using (Stream fileStream = new FileStream(fileNameForStorage, FileMode.Create))
        {
            fileStream.Write(Convert.FromBase64String(imageData));
        }

        return fileNameForStorage;
    }
}