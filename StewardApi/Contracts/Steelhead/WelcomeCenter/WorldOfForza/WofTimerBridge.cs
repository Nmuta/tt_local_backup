#pragma warning disable SA1402 // File may only contain a single type
#pragma warning disable SA1516 // Elements should be separated by blank line

using System;
using System.Collections.Generic;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace Turn10.LiveOps.StewardApi.Contracts.Steelhead.WelcomeCenter.WorldOfForza
{
    /// <summary>
    ///     Timer bridge.
    /// </summary>
    public class WofTimerBridge
    {
        /// <summary>
        ///     Gets or sets the timer type.
        /// </summary>
        public TimerType TimerType { get; set; }

        public string TypeName { get; set; }

        /// <summary>
        ///     Gets or sets the custom range object.
        /// </summary>
        public TimerCustomRange CustomRange { get; set; }

        public TimerReferenceBridge TimerReference { get; set; }
    }

    /// <summary>
    ///     Timer reference bridge.
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

    public class LadderBridge { }
    public class SeriesBridge { }
    public class SeasonBridge { }
    public class ChapterBridge { }

    /// <summary>
    ///     Custom range bridge.
    /// </summary>
    public class TimerCustomRange
    {
        /// <summary>
        ///     Gets or sets a list of custom range staring points.
        /// </summary>
        public List<TimerCustomRangePoint> From { get; set; }

        /// <summary>
        ///     Gets or sets a list of custom range end points.
        /// </summary>
        public List<TimerCustomRangePoint> To { get; set; }
    }

    /// <summary>
    ///     Custom range point bridge.
    /// </summary>
    public class TimerCustomRangePoint
    {
        /// <summary>
        ///     Gets or sets the text property. This property
        ///     should be marked anonymous in the model.
        /// </summary>
        public string Text { get; set; }

        /// <summary>
        ///     Gets or sets the when attribute from the model.
        /// </summary>
        public string When { get; set; }
    }
}
