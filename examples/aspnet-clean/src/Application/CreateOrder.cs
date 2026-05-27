using SixEyes.Example.Domain;

namespace SixEyes.Example.Application;

public class CreateOrder
{
    public Order Execute(string id, decimal total) => new(id, total);
}
