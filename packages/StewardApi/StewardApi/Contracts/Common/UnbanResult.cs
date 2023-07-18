#pragma warning disable SA1600 // ElementsMustBeDocumented (POCO mapped directly from LSP)
#pragma warning disable CS1591 // XML Comments (POCO mapped directly from LSP)
#pragma warning disable SA1516 // Blank Lines (POCO mapped directly from LSP)
namespace Turn10.LiveOps.StewardApi.Contracts.Common
{
    /// <summary>
    ///     Represents an unban result.
    /// </summary>
    public sealed class UnbanResult
    {
        public int BanEntryId { get; set; }
        public bool Success { get; set; }
        public bool Deleted { get; set; }
    }
}
