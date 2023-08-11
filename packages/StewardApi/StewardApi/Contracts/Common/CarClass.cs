#pragma warning disable SA1600 // ElementsMustBeDocumented (POCO mapped from Kusto)
#pragma warning disable CS1591 // XML Comments (POCO mapped from Kusto)

namespace Turn10.LiveOps.StewardApi.Contracts.Common
{
    /// <summary>
    ///     Represents a car class.
    /// </summary>
    public sealed class CarClass
    {
        public long Id { get; set; }

        public string DisplayName { get; set; }
    }
}
