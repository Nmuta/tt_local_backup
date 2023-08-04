using AutoMapper;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Threading.Tasks;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Contracts.Woodstock;
using Turn10.LiveOps.StewardApi.Helpers;
using Turn10.LiveOps.StewardApi.Logging;
using Turn10.LiveOps.StewardApi.Providers.Woodstock.ServiceConnections;

namespace Turn10.LiveOps.StewardApi.Providers.Woodstock
{
    /// <inheritdoc />
    public sealed class WoodstockLeaderboardProvider : IWoodstockLeaderboardProvider
    {
        private readonly IWoodstockService woodstockService;
        private readonly IWoodstockPegasusService pegasusService;
        private readonly ILoggingService loggingService;
        private readonly IMapper mapper;

        /// <summary>
        ///     Initializes a new instance of the <see cref="WoodstockLeaderboardProvider"/> class.
        /// </summary>
        public WoodstockLeaderboardProvider(
            IWoodstockService woodstockService,
            IWoodstockPegasusService pegasusService,
            ILoggingService loggingService,
            IMapper mapper)
        {
            woodstockService.ShouldNotBeNull(nameof(woodstockService));
            pegasusService.ShouldNotBeNull(nameof(pegasusService));
            loggingService.ShouldNotBeNull(nameof(loggingService));
            mapper.ShouldNotBeNull(nameof(mapper));

            this.woodstockService = woodstockService;
            this.pegasusService = pegasusService;
            this.loggingService = loggingService;
            this.mapper = mapper;
        }

        /// <inheritdoc />
        [SuppressMessage("Usage", "VSTHRD103:GetResult synchronously blocks", Justification = "Used in conjunction with Task.WhenAll")]

        public async Task<IEnumerable<Leaderboard>> GetLeaderboardsAsync(string pegasusEnvironment)
        {
            var exceptions = new List<Exception>();
            var getPegasusLeaderboards = this.pegasusService.GetLeaderboardsAsync(pegasusEnvironment, WoodstockPegasusSlot.LiveSteward).SuccessOrDefault(Array.Empty<Leaderboard>(), exceptions);
            var getCarClasses = this.pegasusService.GetCarClassesAsync().SuccessOrDefault(Array.Empty<CarClass>(), new Action<Exception>(ex =>
            {
                // Leaderboards will work without car class association. Log custom exception for tracking purposes.
                this.loggingService.LogException(new AppInsightsException("Failed to get car classes from Pegasus when building leaderboards", ex));
            }));

            await Task.WhenAll(getPegasusLeaderboards, getCarClasses).ConfigureAwait(false);

            if (getPegasusLeaderboards.IsFaulted)
            {
                throw new UnknownFailureStewardException(
                    "Failed to get leaderboards from Pegasus",
                    getPegasusLeaderboards.Exception);
            }

            var leaderboards = getPegasusLeaderboards.GetAwaiter().GetResult();
            var carClasses = getCarClasses.GetAwaiter().GetResult();
            var carClassesDict = carClasses.ToDictionary(carClass => carClass.Id);

            foreach (var leaderboard in leaderboards)
            {
                if (carClassesDict.TryGetValue(leaderboard.CarClassId, out CarClass carClass))
                {
                    leaderboard.CarClass = carClass.DisplayName;
                }
            }

            return leaderboards;
        }
    }
}
