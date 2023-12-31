﻿#pragma warning disable SA1600 // ElementsMustBeDocumented (POCO mapped directly from LSP)
#pragma warning disable CS1591 // XML Comments (POCO mapped directly from LSP)

namespace Turn10.LiveOps.StewardApi.Contracts.Steelhead.RacersCup
{
    /// <summary>
    ///     Racer's Cup weather condition
    /// </summary>
    public sealed class RacersCupWeatherCondition
    {
        public string Name { get; set; }

        public RacersCupWeatherConditionType WeatherConditionType { get; set; }
    }
}
