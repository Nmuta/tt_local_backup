using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using Turn10.LiveOps.StewardApi.Helpers.JsonConverters;

namespace Turn10.LiveOps.StewardApi.Contracts.Steelhead
{
    /// <summary>
    ///     A letter grade associated with a safety rating score.
    /// </summary>
    [JsonConverter(typeof(StringEnumConverter))]
    public enum SafetyRatingGrade
    {
        SPlus = 0,
        S = 1,
        SMinus = 2,
        APlus = 3,
        A = 4,
        AMinus = 5,
        BPlus = 6,
        B = 7,
        BMinus = 8,
        CPlus = 9,
        C = 10,
        CMinus = 11,
        DPlus = 12,
        D = 13,
        DMinus = 14,
        EPlus = 15,
        E = 16,
        EMinus = 17,
        Unknown = 18
    }
}
