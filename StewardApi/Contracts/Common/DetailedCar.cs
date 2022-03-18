namespace Turn10.LiveOps.StewardApi.Contracts.Common
{
    /// <summary>
    ///     Represents a detailed car.
    /// </summary>
    #pragma warning disable CS1591
    #pragma warning disable SA1600
    public sealed class DetailedCar
    {
        public long Id { get; set; }

        public long MakeId { get; set; }

        public string Make { get; set; }

        public string Model { get; set; }

    }
}
