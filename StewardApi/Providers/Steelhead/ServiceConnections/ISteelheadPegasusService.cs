using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Xml.Linq;

using Microsoft.TeamFoundation.SourceControl.WebApi;

using SteelheadLiveOpsContent;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead;
using CarClass = Turn10.LiveOps.StewardApi.Contracts.Common.CarClass;

namespace Turn10.LiveOps.StewardApi.Providers.Steelhead.ServiceConnections
{
    /// <summary>
    ///     Exposes methods for interacting with the Steelhead Pegasus.
    /// </summary>
    public interface ISteelheadPegasusService
    {
        /// <summary>
        ///     Retrieves a collection of supported locales.
        /// </summary>
        Task<IEnumerable<SupportedLocale>> GetSupportedLocalesAsync();

        /// <summary>
        ///     Retrieve localized strings from Pegasus.
        /// </summary>
        /// <remarks>Utilizes a supported subset of BCP 47 Language Codes.</remarks>
        Task<Dictionary<Guid, List<string>>> GetLocalizedStringsAsync();

        /// <summary>
        ///     Gets car classes.
        /// </summary>
        Task<IEnumerable<CarClass>> GetCarClassesAsync();

        /// <summary>
        ///     Gets cars.
        /// </summary>
        Task<IEnumerable<SteelheadLiveOpsContent.DataCar>> GetCarsAsync(string slotId = SteelheadPegasusSlot.Daily);

        /// <summary>
        ///     Gets car makes.
        /// </summary>
        /// <remarks>Only exists in LiveOps version of the nuget. Steelhead needs an exact copy of this.</remarks>
        Task<IEnumerable<SteelheadLiveOpsContent.ListCarMake>> GetCarMakesAsync();

        /// <summary>
        ///     Gets vanity items.
        /// </summary>
        Task<IEnumerable<SteelheadLiveOpsContent.VanityItem>> GetVanityItemsAsync(string slotId = SteelheadPegasusSlot.Daily);

        /// <summary>
        ///     Gets Messages of the Day from Pegasus.
        /// </summary>
        Task<GitPush> EditMotDMessagesAsync(Dictionary<XName, string> editsToMake);
    }
}
