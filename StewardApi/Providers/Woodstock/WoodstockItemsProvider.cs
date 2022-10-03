using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Contracts.Woodstock;
using Turn10.LiveOps.StewardApi.Helpers;
using Turn10.LiveOps.StewardApi.Logging;
using Turn10.LiveOps.StewardApi.Providers.Woodstock.ServiceConnections;
using WoodstockLiveOpsContent;

namespace Turn10.LiveOps.StewardApi.Providers.Woodstock
{
    /// <inheritdoc />
    public sealed class WoodstockItemsProvider : IWoodstockItemsProvider
    {
        private readonly IWoodstockPegasusService pegasusService;
        private readonly ILoggingService loggingService;
        private readonly IMapper mapper;

        /// <summary>
        ///     Initializes a new instance of the <see cref="WoodstockItemsProvider"/> class.
        /// </summary>
        public WoodstockItemsProvider(
            IWoodstockPegasusService pegasusService,
            ILoggingService loggingService,
            IMapper mapper)
        {
            pegasusService.ShouldNotBeNull(nameof(pegasusService));
            loggingService.ShouldNotBeNull(nameof(loggingService));
            mapper.ShouldNotBeNull(nameof(mapper));

            this.pegasusService = pegasusService;
            this.loggingService = loggingService;
            this.mapper = mapper;
        }

        /// <inheritdoc />
        [SuppressMessage("Usage", "VSTHRD103:GetResult synchronously blocks", Justification = "Used in conjunction with Task.WhenAll")]
        public async Task<WoodstockMasterInventory> GetMasterInventoryAsync()
        {
            var getCars = this.pegasusService.GetCarsAsync().SuccessOrDefault(Array.Empty<DataCar>(), new List<Exception>());
            var getCarHorns = this.pegasusService.GetCarHornsAsync().SuccessOrDefault(Array.Empty<CarHorn>(), new List<Exception>());
            var getVanityItems = this.pegasusService.GetVanityItemsAsync().SuccessOrDefault(Array.Empty<VanityItem>(), new List<Exception>());
            var getEmotes = this.pegasusService.GetEmotesAsync().SuccessOrDefault(Array.Empty<EmoteData>(), new List<Exception>());
            var getQuickChatLines = this.pegasusService.GetQuickChatLinesAsync().SuccessOrDefault(Array.Empty<QuickChat>(), new List<Exception>());

            await Task.WhenAll(getCars, getCarHorns, getVanityItems, getEmotes, getQuickChatLines).ConfigureAwait(false);

            var masterInventory = new WoodstockMasterInventory
            {
                CreditRewards = new List<MasterInventoryItem>
                {
                    new MasterInventoryItem { Id = -1, Description = "Credits" },
                    new MasterInventoryItem { Id = -1, Description = "ForzathonPoints" },
                    new MasterInventoryItem { Id = -1, Description = "SkillPoints" },
                    new MasterInventoryItem { Id = -1, Description = "WheelSpins" },
                    new MasterInventoryItem { Id = -1, Description = "SuperWheelSpins" }
                },
                Cars = this.mapper.Map<IList<MasterInventoryItem>>(getCars.GetAwaiter().GetResult()),
                CarHorns = this.mapper.Map<IList<MasterInventoryItem>>(getCarHorns.GetAwaiter().GetResult()),
                VanityItems = this.mapper.Map<IList<MasterInventoryItem>>(getVanityItems.GetAwaiter().GetResult().ToList()),
                Emotes = this.mapper.Map<IList<MasterInventoryItem>>(getEmotes.GetAwaiter().GetResult().ToList()),
                QuickChatLines = this.mapper.Map<IList<MasterInventoryItem>>(getQuickChatLines.GetAwaiter().GetResult().ToList()),
            };

            if (getCars.IsFaulted)
            {
                this.loggingService.LogException(new PegasusAppInsightsException("Failed to get Woodstock Pegasus cars.", getCars.Exception));
            }

            if (getCarHorns.IsFaulted)
            {
                this.loggingService.LogException(new PegasusAppInsightsException("Failed to get Woodstock Pegasus car horns.", getCarHorns.Exception));
            }

            if (getVanityItems.IsFaulted)
            {
                this.loggingService.LogException(new PegasusAppInsightsException("Failed to get Woodstock Pegasus vanity items.", getVanityItems.Exception));
            }

            if (getEmotes.IsFaulted)
            {
                this.loggingService.LogException(new PegasusAppInsightsException("Failed to get Woodstock Pegasus emotes.", getEmotes.Exception));
            }

            if (getQuickChatLines.IsFaulted)
            {
                this.loggingService.LogException(new PegasusAppInsightsException("Failed to get Woodstock Pegasus quick chat lines.", getQuickChatLines.Exception));
            }

            return masterInventory;
        }

        /// <inheritdoc />
        public async Task<IEnumerable<DetailedCar>> GetCarsAsync(string slotId = WoodstockPegasusSlot.Live)
        {
            try
            {
                var cars = await this.pegasusService.GetCarsAsync(slotId).ConfigureAwait(false);
                return this.mapper.Map<IEnumerable<DetailedCar>>(cars);
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException("Failed to get Woodstock Pegasus cars.", ex);
            }
        }
    }
}
