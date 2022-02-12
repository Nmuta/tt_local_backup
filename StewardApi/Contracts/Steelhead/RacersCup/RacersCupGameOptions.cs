using System;

#pragma warning disable SA1600 // ElementsMustBeDocumented (POCO mapped directly from LSP)
#pragma warning disable CS1591 // XML Comments (POCO mapped directly from LSP)

namespace Turn10.LiveOps.StewardApi.Contracts.Steelhead.RacersCup
{
    public sealed class RacersCupGameOptions
    {
        public RacersCupCarClassId CarRestrictions { get; set; }

        public RacersCupWeatherCondition EndRaceWeatherCondition { get; set; }

        public float EndRaceWeatherConditionProbability { get; set; }

        public RacersCupEventSessionType EventSessionType { get; set; }

        public RacersCupWeatherCondition MidRaceWeatherCondition { get; set; }

        public float MidRaceWeatherConditionProbability { get; set; }

        public RacersCupWeatherCondition StartRaceWeatherCondition { get; set; }

        public DateTime TimeOfDay { get; set; }

        public float TimeOfDayTimeScale { get; set; }
    }
}
