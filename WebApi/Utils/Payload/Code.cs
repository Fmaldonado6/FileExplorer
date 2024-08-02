using System.ComponentModel.DataAnnotations;

namespace WebApi.Utils.Payload;

public enum Code
{
    [Display(Name = "Argument Exception")] ArgumentException = 1,

    [Display(Name = "UnAuthorize Exception")]
    UnauthorizedException = 2,

    [Display(Name = "Not Found Resource")] NotFoundException = 3,

    [Display(Name = "Conflict")] ConflictException = 4,

}