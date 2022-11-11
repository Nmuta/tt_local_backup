#pragma warning disable SA1402 // File may only contain a single type

using System.Collections.Generic;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace Turn10.LiveOps.StewardApi.Contracts.Steelhead.WelcomeCenter.WorldOfForza
{
    /// <summary>
    ///     Timer types.
    /// </summary>
    [JsonConverter(typeof(StringEnumConverter))]
    public enum TimerType
    {
        ToStartOrToEnd,
        ToEnd,
        ToStart,
    }

    /// <summary>
    ///     Timer bridge.
    /// </summary>
    public class TimerBridge
    {
        /// <summary>
        ///     Gets or sets the timer type.
        /// </summary>
        public TimerType TimerType { get; set; }

        /// <summary>
        /// Gets or sets the custom range object.
        /// </summary>
        public TimerCustomRange TimerCustomRange { get; set; }
    }

    /// <summary>
    ///     Custom range bridge.
    /// </summary>
    public class TimerCustomRange
    {
        /// <summary>
        ///     Gets or sets a list of custom range staring points.
        /// </summary>
        public List<TimerCustomRangePoint> FromPoints { get; set; }

        /// <summary>
        ///     Gets or sets a list of custom range end points.
        /// </summary>
        public List<TimerCustomRangePoint> ToPoints { get; set; }
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
