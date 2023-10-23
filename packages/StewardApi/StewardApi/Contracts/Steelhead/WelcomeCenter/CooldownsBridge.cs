using System;

#pragma warning disable SA1402 // File may only contain a single type

namespace Turn10.LiveOps.StewardApi.Contracts.Steelhead.WelcomeCenter
{
    /// <summary>
    ///     Cooldowns Wrapper
    /// </summary>
    public partial class CooldownsWrapper
    {
        public CooldownBridge[] item { get; set; }
    }

    /// <summary>
    ///     Cooldown Bridge
    /// </summary>
    public partial class CooldownBridge
    {
        public Guid RefId { get; set; }

        public Guid Id { get; set; }

        public string When { get; set; }

        public string Type { get; set; }

        public string FriendlyName { get; set; }

        public CooldownSettingsBridge Settings { get; set; }
    }

    /// <summary>
    ///     Cooldown Settings Bridge
    /// </summary>
    public partial class CooldownSettingsBridge
    {
        public ResetDatesBridge ResetDates { get; set; }
    }

    /// <summary>
    ///     Reset Dates Bridge
    /// </summary>
    public partial class ResetDatesBridge
    {
        public RangePointBridge[] item { get; set; }
    }
}
