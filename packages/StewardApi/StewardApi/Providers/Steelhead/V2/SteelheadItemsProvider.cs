using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using SteelheadLiveOpsContent;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead;
using Turn10.LiveOps.StewardApi.Helpers;
using Turn10.LiveOps.StewardApi.Logging;
using Turn10.LiveOps.StewardApi.Providers.Steelhead.ServiceConnections;

namespace Turn10.LiveOps.StewardApi.Providers.Steelhead.V2
{
    /// <inheritdoc />
    public sealed class SteelheadItemsProvider : ISteelheadItemsProvider
    {
        private readonly ISteelheadPegasusService pegasusService;
        private readonly ILoggingService loggingService;
        private readonly IMapper mapper;

        /// <summary>
        ///     Initializes a new instance of the <see cref="SteelheadItemsProvider"/> class.
        /// </summary>
        public SteelheadItemsProvider(
            ISteelheadPegasusService pegasusService,
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
        public async Task<SteelheadMasterInventory> GetMasterInventoryAsync()
        {
            var getCars = this.pegasusService.GetCarsAsync().SuccessOrDefault(Array.Empty<SteelheadLiveOpsContent.DataCar>(), new Action<Exception>(ex =>
            {
                this.loggingService.LogException(new PegasusAppInsightsException("Failed to get Steelhead Pegasus cars.", ex));
            }));
            var getVanityItems = this.pegasusService.GetVanityItemsAsync().SuccessOrDefault(Array.Empty<SteelheadLiveOpsContent.VanityItem>(), new Action<Exception>(ex =>
            {
                this.loggingService.LogException(new PegasusAppInsightsException("Failed to get Steelhead Pegasus vanity items.", ex));
            }));

            await Task.WhenAll(getCars, /*getCarHorns,*/ getVanityItems /*getEmotes,*/ /*getQuickChatLines*/).ConfigureAwait(false);

            var masterInventory = new SteelheadMasterInventory
            {
                CreditRewards = new List<MasterInventoryItem>
                {
                    new MasterInventoryItem { Id = 0, Description = "Credits" },
                },
                Cars = this.mapper.SafeMap<IList<MasterInventoryItem>>(getCars.GetAwaiter().GetResult()),
                DriverSuits = this.mapper.SafeMap<IList<MasterInventoryItem>>(getVanityItems.GetAwaiter().GetResult().ToList()),
                VanityItems = new List<MasterInventoryItem>(),
            };

            return masterInventory;
        }

        public async Task<IEnumerable<VanityItem>> GetVanityItemsAsync(string slotId = SteelheadPegasusSlot.Daily)
        {
            IEnumerable<VanityItem> vanityItems;
            try
            {
                vanityItems = await this.pegasusService.GetVanityItemsAsync(slotId).ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException("Failed to get Steelhead Pegasus cars.", ex);
            }

            return vanityItems;
        }

        /// <inheritdoc />
        public async Task<IEnumerable<SimpleCar>> GetCarsAsync(string slotId = SteelheadPegasusSlot.Daily)
        {
            IEnumerable<DataCar> cars;
            try
            {
                cars = await this.pegasusService.GetCarsAsync(slotId).ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException("Failed to get Steelhead Pegasus cars.", ex);
            }

            return this.mapper.SafeMap<IEnumerable<SimpleCar>>(cars);
        }
    }
}
