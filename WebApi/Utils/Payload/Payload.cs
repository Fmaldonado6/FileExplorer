namespace WebApi.Utils.Payload;

public class Payload
{
    public string Message { get; } = null!;

    public Code Code { get; }

    public string Type { get; } = null!;


    public Payload(string message, Code code)
    {
        Message = message;
        Code = code;
        Type = Enum.GetName(typeof(Code), code)!;
    }
}