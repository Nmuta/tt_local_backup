#pragma warning disable CS1591 // Missing XML comment for publicly visible type or member
#pragma warning disable SA1300 // Element should begin with upper-case letter
#pragma warning disable SA1600 // Elements should be documented

namespace Turn10.LiveOps.StewardApi.Contracts.Steelhead
{
    /// <summary>
    ///     Represents a player's driver level.
    /// </summary>
    public class SteelheadDriverLevel
    {
        public uint DriverLevel { get; set; }

        public uint PrestigeRank { get; set; }

        public uint ExperiencePoints { get; set; }
    }
}
