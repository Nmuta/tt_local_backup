﻿using System.Collections.Generic;
using System.Threading.Tasks;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Woodstock;
using WoodstockLiveOpsContent;
using CarClass = Turn10.LiveOps.StewardApi.Contracts.Common.CarClass;
using CarHorn = WoodstockLiveOpsContent.CarHorn;
using QuickChat = WoodstockLiveOpsContent.QuickChat;

namespace Turn10.LiveOps.StewardApi.Providers.Woodstock.ServiceConnections
{
    /// <summary>
    ///     Exposes methods for interacting with the Woodstock Pegasus.
    /// </summary>
    public interface IWoodstockPegasusService
    {
        /// <summary>
        ///     Gets car classes.
        /// </summary>
        Task<IEnumerable<CarClass>> GetCarClassesAsync();

        /// <summary>
        ///     Gets leaderboards.
        /// </summary>
        Task<IEnumerable<Leaderboard>> GetLeaderboardsAsync();

        /// <summary>
        ///     Gets cars.
        /// </summary>
        Task<IEnumerable<DataCar>> GetCarsAsync(string slotId = WoodstockPegasusSlot.Live);

        /// <summary>
        ///     Gets car makes.
        /// </summary>
        Task<IEnumerable<ListCarMake>> GetCarMakesAsync();

        /// <summary>
        ///     Gets car horns.
        /// </summary>
        Task<IEnumerable<CarHorn>> GetCarHornsAsync();

        /// <summary>
        ///     Gets vanity items.
        /// </summary>
        Task<IEnumerable<VanityItem>> GetVanityItemsAsync();

        /// <summary>
        ///     Gets emotes.
        /// </summary>
        Task<IEnumerable<EmoteData>> GetEmotesAsync();

        /// <summary>
        ///     Gets quick chat lines.
        /// </summary>
        Task<IEnumerable<QuickChat>> GetQuickChatLinesAsync();
    }
}
