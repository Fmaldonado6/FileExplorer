
namespace WebApi.Utils.Configuration;

//Clase que carga los configuracion de Files en appsettings.json
public class FilesConfiguration
{
    public string? StaticFiles { get; set; }
    public FilesFolder? Paths { get; set; }
}

public class FilesFolder
{
    public string? Media { get; set; }
}