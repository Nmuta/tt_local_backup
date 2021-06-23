namespace Turn10.LiveOps.StewardApi.Contracts.Common
{
    /// <summary>
    ///     Represents a detailed Kusto car.
    /// </summary>
    public sealed class KustoCar
    {
        /// <summary>
        ///     Gets or sets car id.
        /// </summary>
        /// <remarks>Kusto data type is Int64.</remarks>
        public int Id { get; set; }

        /// <summary>
        ///     Gets or sets car make id.
        /// </summary>
        /// <remarks>Kusto data type is Int64.</remarks>
        public int MakeId { get; set; }

        /// <summary>
        ///     Gets or sets car make description.
        /// </summary>
        public string Make { get; set; }

        /// <summary>
        ///     Gets or sets car model description.
        /// </summary>
        public string Model { get; set; }
    }
}
