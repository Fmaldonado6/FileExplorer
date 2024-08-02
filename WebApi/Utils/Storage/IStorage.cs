namespace WebApi.Utils.Storage;

//Interfaz que define las acciones de almacenamiento de archivos
//Se utiliza una interfaz para cambiar implementaciones facilmente, ejemplo: utilizar almacenamiento en la nube en un futuro
public interface IStorage
{
    Task<string> UploadFileAsync(IFormFile imageFile, string fileNameForStorage);
    Task<string> UploadBase64Async(string imageData, string fileNameForStorage);
    Task DeleteFileAsync(string fileNameForStorage);
}