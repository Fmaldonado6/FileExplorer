
using AutoMapper;
using Core.Domain;
using WebApi.Mapping.Resources.Medias;


namespace WebApi.Mapping;

//Configuracion del mapper
//El mapper nos ayuda para devolver solo la informacion importante al cliente
//Aqui se configura que a clases y que propiedades mappear
public class MappingProfile : Profile
{
    public MappingProfile()
    {


        #region Medias

        CreateMap<Media, MediaResource>();
        CreateMap<SaveMediaResource, Media>();
        CreateMap<MediaFolder, FolderResource>();
        CreateMap<SaveFolderResource, MediaFolder>().ForMember(c => c.Id, opt => opt.Ignore());

        #endregion


    }
}
