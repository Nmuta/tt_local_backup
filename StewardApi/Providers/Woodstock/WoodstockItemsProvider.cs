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
        public async Task<WoodstockMasterInventory> GetMasterInventoryAsync(string slotId = WoodstockPegasusSlot.Live)
        {
            var getCars = this.pegasusService.GetCarsAsync(slotId).SuccessOrDefault(Array.Empty<DataCar>(), new Action<Exception>(ex =>
            {
                this.loggingService.LogException(new PegasusAppInsightsException("Failed to get Woodstock Pegasus cars.", ex));
            }));
            var getCarHorns = this.pegasusService.GetCarHornsAsync(slotId).SuccessOrDefault(Array.Empty<CarHorn>(), new Action<Exception>(ex =>
            {
                this.loggingService.LogException(new PegasusAppInsightsException("Failed to get Woodstock Pegasus car horns.", ex));
            }));
            var getVanityItems = this.pegasusService.GetVanityItemsAsync(slotId).SuccessOrDefault(Array.Empty<VanityItem>(), new Action<Exception>(ex =>
            {
                this.loggingService.LogException(new PegasusAppInsightsException("Failed to get Woodstock Pegasus vanity items.", ex));
            }));
            var getEmotes = this.pegasusService.GetEmotesAsync(slotId).SuccessOrDefault(Array.Empty<EmoteData>(), new Action<Exception>(ex =>
            {
                this.loggingService.LogException(new PegasusAppInsightsException("Failed to get Woodstock Pegasus emotes.", ex));
            }));
            var getQuickChatLines = this.pegasusService.GetQuickChatLinesAsync(slotId).SuccessOrDefault(Array.Empty<QuickChat>(), new Action<Exception>(ex =>
            {
                this.loggingService.LogException(new PegasusAppInsightsException("Failed to get Woodstock Pegasus quick chat lines.", ex));
            }));

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
                Cars = this.mapper.SafeMap<IList<MasterInventoryItem>>(getCars.GetAwaiter().GetResult()),
                CarHorns = this.mapper.SafeMap<IList<MasterInventoryItem>>(getCarHorns.GetAwaiter().GetResult()),
                VanityItems = this.mapper.SafeMap<IList<MasterInventoryItem>>(getVanityItems.GetAwaiter().GetResult().ToList()),
                Emotes = this.mapper.SafeMap<IList<MasterInventoryItem>>(getEmotes.GetAwaiter().GetResult().ToList()),
                QuickChatLines = this.mapper.SafeMap<IList<MasterInventoryItem>>(getQuickChatLines.GetAwaiter().GetResult().ToList()),
            };

            return masterInventory;
        }

        /// <inheritdoc />
        public async Task<IEnumerable<T>> GetCarsAsync<T>(string slotId = WoodstockPegasusSlot.Live)
            where T : SimpleCar
        {
            IEnumerable<DataCar> cars = null;

            try
            {
                cars = await this.pegasusService.GetCarsAsync(slotId).ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException("Failed to get Woodstock Pegasus cars.", ex);
            }

            return this.mapper.SafeMap<IEnumerable<T>>(cars);
        }
    }
}
