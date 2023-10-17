#pragma warning disable SA1402 // File may only contain a single type
#pragma warning disable SA1516 // Elements should be separated by blank line
#pragma warning disable SA1600 // Elements should be documented
#pragma warning disable SA1306 // Field names should begin with lower-case letter

using System;

namespace Turn10.LiveOps.StewardApi.Contracts.Steelhead.WelcomeCenter.WorldOfForza
{
    /// <summary>
    ///     Timer bridge for World of Forza
    /// </summary>
    public class WofTimerBridge
    {
        public TimerType TimerType { get; set; }

        public string TypeName { get; set; }

        public TextOverrideBridge StartTextOverride { get; set; }

        public TextOverrideBridge EndTextOverride { get; set; }

        public CustomRangeBridge CustomRange { get; set; }

        public TimerReferenceBridge TimerReference { get; set; }
    }

    /// <summary>
    ///     Timer reference bridge
    /// </summary>
    public class TimerReferenceBridge
    {
        public Guid RefId { get; set; }

        public TimerInstance TimerInstance { get; set; }

        public LadderBridge LadderBridge { get; set; }

        public SeriesBridge SeriesBridge { get; set; }

        public SeasonBridge SeasonBridge { get; set; }

        public ChapterBridge ChapterBridge { get; set; }
    }

    /// <summary>
    ///     Ladder bridge for World of Forza timer bridge
    /// </summary>
    public class LadderBridge { }

    /// <summary>
    ///     Series bridge for World of Forza timer bridge
    /// </summary>
    public class SeriesBridge { }

    /// <summary>
    ///     Season bridge for World of Forza timer bridge
    /// </summary>
    public class SeasonBridge { }

    /// <summary>
    ///     Chapter bridge for World of Forza timer bridge
    /// </summary>
    public class ChapterBridge { }

    /// <summary>
    ///     Text Override bridge for World of Forza timer bridge
    /// </summary>
    public class TextOverrideBridge
    {
        public Guid RefId { get; set; }
    }
}
