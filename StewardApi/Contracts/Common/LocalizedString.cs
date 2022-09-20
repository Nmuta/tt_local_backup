#pragma warning disable SA1600 // ElementsMustBeDocumented (POCO mapped directly from LSP)
#pragma warning disable CS1591 // XML Comments (POCO mapped directly from LSP)
using SteelheadLiveOpsContent;

namespace Turn10.LiveOps.StewardApi.Contracts.Common
{
    /// <summary>
    ///     Represents a localized string for use in localized messaging.
    /// </summary>
    public sealed class LocalizedString
    {
        public string Message { get; set; }

        public LocCategory Category { get; set; }

        public string LanguageCode { get; set; }

        public bool IsTranslated { get; set; }
    }
}