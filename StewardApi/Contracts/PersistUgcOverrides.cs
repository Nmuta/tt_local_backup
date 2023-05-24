#pragma warning disable SA1600 // ElementsMustBeDocumented (POCO mapped directly from LSP)
#pragma warning disable CS1591 // XML Comments (POCO mapped directly from LSP)
#pragma warning disable SA1516 // Blank Lines (POCO mapped directly from LSP)
namespace Turn10.LiveOps.StewardApi.Contracts
{
    /// <summary>
    ///     Represents values that can be overwritten when persisting UGC.
    /// </summary>
    public class PersistUgcOverrides
    {
        public string Title { get; set; }

        public string Description { get; set; }
    }
}
