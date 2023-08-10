using System.Globalization;

namespace Turn10.LiveOps.StewardApi.Contracts.Common
{
    /// <summary>
    ///     Represents a simple car with a make and model.
    /// </summary>
#pragma warning disable CS1591
#pragma warning disable SA1600
    public class SimpleCar
    {
        public long Id { get; set; }

        public long MakeId { get; set; }

        public string Make { get; set; }

        public string Model { get; set; }

        public short? Year { get; set; }

        public string DisplayName
        {
            get
            {
                if (this.Year is null)
                {
                    return string.Format(CultureInfo.InvariantCulture, "{0} {1} (No Year)", this.Make, this.Model);
                }

                return string.Format(CultureInfo.InvariantCulture, "{0} {1} ({2})", this.Make, this.Model, this.Year);
            }
        }
    }
}
