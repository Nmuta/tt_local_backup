#pragma warning disable SA1402 // File may only contain a single type
#pragma warning disable SA1516 // Elements should be separated by blank line
#pragma warning disable SA1600 // Elements should be documented
#pragma warning disable SA1306 // Field names should begin with lower-case letter

using System;
using System.Globalization;

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

        public TimerCustomRangeBridge CustomRange { get; set; }

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

    /// <summary>
    ///     Custom time range bridge for World of Forza timer bridge
    /// </summary>
    public class TimerCustomRangeBridge
    {
        public RangePointBridge From { get; set; }

        public RangePointBridge To { get; set; }

        public string Name { get; set; }
    }

    /// <summary>
    ///     Range Point bridge for World of Forza timer bridge
    /// </summary>
    public class RangePointBridge
    {
        private DateTime InternalDateUtc;

        /// <summary>
        ///     Gets or sets the text property. This property
        ///     is XmlText in the model, so its value is written
        ///     but the property name is not created into an element.
        /// </summary>
        public string DateUtc
        {
            get => this.InternalDateUtc.ToString("O");
            set => this.InternalDateUtc = DateTime.Parse(value, CultureInfo.InvariantCulture).ToUniversalTime();
        }

        /// <summary>
        ///     Gets or sets the when attribute from the model.
        /// </summary>
        public string When { get; set; }
    }
}
