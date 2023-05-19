using Microsoft.VisualBasic;
using System.Data;
using Turn10.LiveOps.StewardApi.Contracts.Data;

namespace Turn10.LiveOps.StewardApi.Contracts.Common
{
    /// <summary>
    ///     Represents a detailed Kusto car.
    /// </summary>
    public sealed class KustoCar
    {
        /// <summary>
        ///     Initializes a new instance of the <see cref="KustoCar"/> class.
        /// </summary>
        public KustoCar(long id, long makeId, string make, string model, long year)
        {
            this.Id = id;
            this.MakeId = makeId;
            this.Make = make;
            this.Model = model;
            this.DisplayName = $"{make} {model} ({(year == default(long) ? "No Year" : year)})";
        }

        /// <summary>
        ///     Gets or sets car id.
        /// </summary>
        /// <remarks>Kusto data type is Int64.</remarks>
        public long Id { get; set; }

        /// <summary>
        ///     Gets or sets car make id.
        /// </summary>
        /// <remarks>Kusto data type is Int64.</remarks>
        public long MakeId { get; set; }

        /// <summary>
        ///     Gets or sets car make description.
        /// </summary>
        public string Make { get; set; }

        /// <summary>
        ///     Gets or sets car model description.
        /// </summary>
        public string Model { get; set; }

        /// <summary>
        ///     Gets or sets car display name.
        /// </summary>
        public string DisplayName { get; set; }

        /// <summary>
        ///     Parses query results into a Kusto car object.
        /// </summary>
        public static KustoCar FromQueryResult(IDataReader reader)
        {
            return new KustoCar(
                reader.Get<long>(nameof(Id)),
                reader.Get<long>(nameof(MakeId)),
                reader.Get<string>(nameof(Make)),
                reader.Get<string>(nameof(Model)),
                reader.Get<long>("Year"));
        }
    }
}
