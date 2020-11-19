using System.Collections.Generic;

namespace Turn10.LiveOps.StewardApi.Validation
{
    /// <summary>
    ///     Central reference application settings.
    /// </summary>
    public sealed class ApplicationSettings
    {
        /// <summary>
        ///     Gets a list of supported titles.
        /// </summary>
        public static IList<TitleMapping> SupportedTitles { get; } = new List<TitleMapping>
        {
            new TitleMapping { Abbreviation = "Street", Codename = "Gravity", RetailName = "Forza Street" },
            new TitleMapping { Abbreviation = "FH4", Codename = "Sunrise", RetailName = "Forza Horizon 4" },
            new TitleMapping { Abbreviation = "FM7", Codename = "Apollo", RetailName = "Forza Motorsport 7" },
            new TitleMapping { Abbreviation = "FH3", Codename = "Opus", RetailName = "Forza Horizon 3" }
        };
    }
}
