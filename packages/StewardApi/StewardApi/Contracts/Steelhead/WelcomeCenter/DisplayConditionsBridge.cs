using System;

#pragma warning disable SA1402 // File may only contain a single type

namespace Turn10.LiveOps.StewardApi.Contracts.Steelhead.WelcomeCenter
{
    /// <summary>
    ///     Display Condition Wrapper
    /// </summary>
    public partial class DisplayConditionWrapper
    {
        public DisplayConditionBridge[] item { get; set; }
    }

    /// <summary>
    ///     Display Condition Bridge
    /// </summary>
    public partial class DisplayConditionBridge
    {
        public Guid RefId { get; set; }

        public Guid Id { get; set; }

        public string When { get; set; }

        public string Type { get; set; }

        public string FriendlyName { get; set; }

        public DateSettingsBridge DateSettings { get; set; }
    }

    /// <summary>
    ///     Date Settings Bridge
    /// </summary>
    public partial class DateSettingsBridge
    {
        public CustomRangeBridge Range { get; set; }
    }
}
