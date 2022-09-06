using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using SteelheadContent;
using Turn10;
using Turn10.Data.Common;
using Turn10.LiveOps;
using Turn10.LiveOps.StewardApi;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead;
using Turn10.LiveOps.StewardApi.Helpers;
using Turn10.LiveOps.StewardApi.Logging;
using Turn10.LiveOps.StewardApi.Providers;
using Turn10.LiveOps.StewardApi.Providers.Steelhead;
using Turn10.LiveOps.StewardApi.Providers.Steelhead.ServiceConnections;
using Turn10.LiveOps.StewardApi.Providers.Steelhead.V2;
using CarClass = Turn10.LiveOps.StewardApi.Contracts.Common.CarClass;

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

            var getCars = this.pegasusService.GetCarsAsync().SuccessOrDefault(Array.Empty<DataCar>(), new List<Exception>());
            var getVanityItems = this.pegasusService.GetVanityItemsAsync().SuccessOrDefault(Array.Empty<VanityItem>(), new List<Exception>());

            await Task.WhenAll(getCars, /*getCarHorns,*/ getVanityItems /*getEmotes,*/ /*getQuickChatLines*/).ConfigureAwait(false);

            var masterInventory = new SteelheadMasterInventory
            {
                CreditRewards = new List<MasterInventoryItem>
                {
                    new MasterInventoryItem { Id = -1, Description = "Credits" },
                },
                Cars = this.mapper.Map<IList<MasterInventoryItem>>(getCars.GetAwaiter().GetResult()),
                VanityItems = this.mapper.Map<IList<MasterInventoryItem>>(getVanityItems.GetAwaiter().GetResult().ToList()),
            };

            if (getCars.IsFaulted)
            {
                this.loggingService.LogException(new PegasusAppInsightsException("Failed to get Steelhead Pegasus cars.", getCars.Exception));
            }

            if (getVanityItems.IsFaulted)
            {
                this.loggingService.LogException(new PegasusAppInsightsException("Failed to get Steelhead Pegasus vanity items.", getVanityItems.Exception));
            }

            return masterInventory;
        }

        /// <inheritdoc />
        public async Task<IEnumerable<DetailedCar>> GetCarsAsync(string slotId = SteelheadPegasusSlot.Live)
        {
            try
            {
                var cars = await this.pegasusService.GetCarsAsync(slotId).ConfigureAwait(false);
                return this.mapper.Map<IEnumerable<DetailedCar>>(cars);
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException("Failed to get Steelhead Pegasus cars.", ex);
            }
        }
    }
}
