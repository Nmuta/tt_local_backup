#pragma warning disable SA1600 // Elements should be documented

using System;
using System.Collections.Generic;

namespace Turn10.LiveOps.StewardApi.Contracts.Steelhead
{
    public class SteelheadMessageOfTheDay
    {
        public string ID { get; set; }

        public string FriendlyMessageName { get; set; }

        public string PopUpLocation { get; set; }

        public string LocationSceneEnum { get; set; }

        public string TelemetryTag { get; set; }

        public int Priority { get; set; }

        public List<object> CooldownDataList { get; set; }

        public List<object> DisplayConditionDataList { get; set; }

        public string TitleHeader { get; set; }

        public DateTime Date { get; set; }

        public string ContentHeader { get; set; }

        public string ContentBody { get; set; }

        public string ContentImagePath { get; set; }
    }
}
