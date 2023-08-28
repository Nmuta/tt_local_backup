using System.ComponentModel;

namespace Turn10.LiveOps.StewardApi.Contracts
{
    /// <summary>
    ///     Available Steward API keys
    /// </summary>
    public enum StewardApiKey
    {
        [Description("Unset")]
        Unset = 0,
        [Description("PlayFab")]
        PlayFab,
        [Description("Testing")]
        Testing,
        [Description("Steward Automation")]
        StewardAutomation,
    }
}
