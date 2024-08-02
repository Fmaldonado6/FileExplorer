using System.Text.Json;
using System.Text.Json.Serialization;
using Karambolo.Extensions.Logging.File;
using Microsoft.AspNetCore.OData;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using Persistence.Persistence;
using WebApi.Mapping;
using WebApi.Utils;
using WebApi.Utils.Configuration;

var builder = WebApplication.CreateBuilder(args);

//Configuración de .NET para detectar controladores, agregar OData oara filtrar desde la url y configurar el JSON de las respuestas
builder.Services
    .AddControllers()
    .AddOData(options => { options.Filter().Select().SetMaxTop(100).Count().OrderBy(); })
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
        options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
        options.JsonSerializerOptions.DictionaryKeyPolicy = JsonNamingPolicy.CamelCase;
        options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
        options.JsonSerializerOptions.Converters.Add(new DateTimeConverter());
    });


// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


//Obtener el string de conexión a la base ded atos del archivo appsettings.json
var dbConnection = builder.Configuration.GetConnectionString("Database");
//Configurar base de datos con las clases definidas en Persistence
builder.Services.AddDbContext<FileExplorerContext>(options =>
{
    options.UseSqlite(dbConnection);
});


//Establecemos el CORS, en este caso se aceptan conexiones desde cualquier URL
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(corsPolicyBuilder =>
    {
        corsPolicyBuilder.SetIsOriginAllowed(_ => true)
            .AllowAnyMethod()
            .AllowCredentials()
            .AllowAnyHeader();
    });
});

//Se configura el auto mapper
builder.Services.AddAutoMapper(expression => expression.AddProfile(new MappingProfile()));
//Se asigna la configuracion de appsettings.json a sus respectivas clases
builder.Services.Configure<FilesConfiguration>(builder.Configuration.GetSection("Files"));
builder.Services.Configure<FileSettingsConfiguration>(builder.Configuration.GetSection("FileSettings"));


//Se configura un Logger para generar archivos con errores :) ---


var logFileOptions = new LogFileOptions
{
    Path = "FileExplorer-<date>.txt"
};

builder.Services.AddLogging();
builder.Logging
    .ClearProviders()
    .AddConsole()
    .AddConfiguration(builder.Configuration.GetSection("Logging"))
    .AddFile(options =>
    {
        options.BasePath = "AppData/Logs";
        options.Files = new[]
        {
            logFileOptions
        };
    })
    .AddEventSourceLogger();


//---------------------------------------------------------  

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors();

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

//Se configuran los static files para poder acceder a los archivos subidos a la plataforma
var staticfilesConfiguration = builder.Configuration["Files:StaticFiles"]!;

Directory.CreateDirectory(Path.Combine(builder.Environment.ContentRootPath, staticfilesConfiguration));

app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(Path.Combine(builder.Environment.ContentRootPath, staticfilesConfiguration)),
    RequestPath = "/StaticFiles"
});
//-----------------------------------------------------------------------


//Se crea la base de datos
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<FileExplorerContext>();
    db.Database.Migrate();
}


app.Run();
