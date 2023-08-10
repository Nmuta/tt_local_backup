#pragma warning disable SA1649 // File name should match first type name
#pragma warning disable SA1402 // File may only contain a single type

using System;
using AutoMapper;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead.WelcomeCenter.WorldOfForza;

namespace Turn10.LiveOps.StewardApi.ProfileMappers.MapConverters
{
    /// <summary>
    ///     Custom mapping for WofTimer.
    /// </summary>
    public class BridgeToXmlConverterTimerReference : ITypeConverter<TimerReferenceBridge, WofBaseTimerReference>
    {
        /// <summary>
        ///     Custom conversion from source <see cref="TimerReferenceBridge"/>
        ///     to destination <see cref="WofBaseTimerReference"/>.
        /// </summary>
        public WofBaseTimerReference Convert(TimerReferenceBridge source, WofBaseTimerReference destination, ResolutionContext context)
        {
            if (source == null)
            {
                return null;
            }

            return source.TimerInstance switch
            {
                TimerInstance.Chapter => new Chapter() { RefId = source.RefId },
                TimerInstance.Ladder => new Ladder() { RefId = source.RefId },
                TimerInstance.Series => new Series() { RefId = source.RefId },
                TimerInstance.Season => new Season() { RefId = source.RefId },
                TimerInstance.ChallengeData => new ChallengeData() { RefId = source.RefId },
                TimerInstance.DateTimeRange => new DateRange() { RefId = source.RefId },
                TimerInstance.FeaturedShowcase => new FeaturedShowcase() { RefId = source.RefId },
                TimerInstance.RivalsEvent => new Event() { RefId = source.RefId },
                TimerInstance.ShowroomListing => new ShowroomListingCategory() { RefId = source.RefId },
                _ => throw new ArgumentException($"Unsupported {nameof(TimerInstance)}: {source.TimerInstance}"),
            };
        }
    }

    /// <summary>
    ///     Custom mapping for WofTimer.
    /// </summary>
    public class XmlToBridgeConverterTimerReference : ITypeConverter<WofBaseTimerReference, TimerReferenceBridge>
    {
        /// <summary>
        ///     Custom conversion from source <see cref="WofBaseTimerReference"/>
        ///     to destination <see cref="TimerReferenceBridge"/>.
        /// </summary>
        public TimerReferenceBridge Convert(WofBaseTimerReference source, TimerReferenceBridge destination, ResolutionContext context)
        {
            // If source is null, then there is no timer reference in the xml
            // on deserialization. The parent object Timer is likely <x:null />
            if (source == null)
            {
                return null;
            }

            return new TimerReferenceBridge
            {
                RefId = source.RefId,
                TimerInstance = source.TimerInstance
            };
        }
    }
}
