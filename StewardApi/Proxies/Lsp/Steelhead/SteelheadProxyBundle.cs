using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Proxies.Lsp.Steelhead;
using Turn10.LiveOps.StewardApi.Proxies.Lsp.Steelhead.Services;
using Turn10.Services.LiveOps.FM8.Generated;

namespace Turn10.LiveOps.StewardApi.Proxies.Lsp.Steelhead
{
    public class SteelheadProxyBundle
    {
        private string endpoint;

        /// <summary>
        ///     Initializes a new instance of the <see cref="SteelheadProxyBundle"/> class.
        /// </summary>
        public SteelheadProxyBundle(ISteelheadProxyFactory steelheadFactory)
        {
            this.SteelheadFactory = steelheadFactory;
        }

        /// <summary>
        ///     Gets or sets the Endpoint.
        /// </summary>
        public string Endpoint
        {
            get
            {
                if (string.IsNullOrEmpty(this.endpoint))
                {
                    throw new NotFoundStewardException("Endpoint value could not be found for Steelhead Proxy Factory.");
                }

                return this.endpoint;
            }

            set
            {
                this.endpoint = value;
            }
        }

        /// <summary>
        ///     Gets a <see cref="IAuctionManagementService" />.
        /// </summary>
        public IAuctionManagementService AuctionManagementService => this.SteelheadFactory.PrepareAuctionManagementService(this.Endpoint);

        /// <summary>
        ///     Gets a <see cref="IGiftingManagementService" />.
        /// </summary>
        public IGiftingManagementService GiftingManagementService => this.SteelheadFactory.PrepareGiftingManagementService(this.Endpoint);

        /// <summary>
        ///     Gets a <see cref="ILiveOpsService" />.
        /// </summary>
        public ILiveOpsService LiveOpsService => this.SteelheadFactory.PrepareLiveOpsService(this.Endpoint);

        /// <summary>
        ///     Gets a <see cref="ILocalizationManagementService" />.
        /// </summary>
        public ILocalizationManagementService LocalizationManagementService => this.SteelheadFactory.PrepareLocalizationManagementService(this.Endpoint);

        /// <summary>
        ///     Gets a <see cref="IUserManagementService" />.
        /// </summary>
        public IUserManagementService UserManagementService => this.SteelheadFactory.PrepareUserManagementService(this.Endpoint);

        /// <summary>
        ///     Gets a <see cref="IUserInventoryManagementService" />.
        /// </summary>
        public IUserInventoryManagementService UserInventoryManagementService => this.SteelheadFactory.PrepareUserInventoryManagementService(this.Endpoint);

        /// <summary>
        ///     Gets a <see cref="IStorefrontManagementService" />.
        /// </summary>
        public IStorefrontManagementService StorefrontManagementService => this.SteelheadFactory.PrepareStorefrontManagementService(this.Endpoint);

        /// <summary>
        ///     Gets a <see cref="INotificationManagementService" />.
        /// </summary>
        public INotificationManagementService NotificationManagementService => this.SteelheadFactory.PrepareNotificationManagementService(this.Endpoint);

        /// <summary>
        ///     Gets a <see cref="IPermissionsManagementService" />.
        /// </summary>
        public IPermissionsManagementService PermissionsManagementService => this.SteelheadFactory.PreparePermissionsManagementService(this.Endpoint);

        /// <summary>
        ///     Gets a <see cref="IPermissionsManagementService" />.
        /// </summary>
        public IScoreboardManagementService ScoreboardManagementService => this.SteelheadFactory.PrepareScoreboardManagementService(this.Endpoint);

        private ISteelheadProxyFactory SteelheadFactory { get; }

        /// <summary>
        ///     Ensures all provided xuids are valid, else throws error.
        /// </summary>
        public Task EnsurePlayersExistAsync(IList<ulong> xuids)
        {
            var players = xuids.Select<ulong, ForzaPlayerLookupParameters>(xuid =>
            {
                return new ForzaPlayerLookupParameters()
                {
                    UserID = xuid.ToString(CultureInfo.InvariantCulture),
                    UserIDType = ForzaUserIdType.Xuid,
                };
            });

            return this.EnsurePlayerExistsInternalAsync(players);
        }

        /// <summary>
        ///     Ensures provided xuid is valid, else throws error.
        /// </summary>
        public Task EnsurePlayerExistAsync(ulong xuid)
        {
            return this.EnsurePlayersExistAsync(new List<ulong>() { xuid });
        }

        /// <summary>
        ///     Ensures all provided gamertags are valid, else throws error.
        /// </summary>
        public Task EnsurePlayersExistAsync(IList<string> gamertags)
        {
            var players = gamertags.Select<string, ForzaPlayerLookupParameters>(gamertag =>
            {
                return new ForzaPlayerLookupParameters()
                {
                    UserID = gamertag,
                    UserIDType = ForzaUserIdType.Xuid,
                };
            });

            return this.EnsurePlayerExistsInternalAsync(players);
        }

        /// <summary>
        ///     Ensures provided gamertag is valid, else throws error.
        /// </summary>
        public Task EnsurePlayerExistAsync(string gamertag)
        {
            return this.EnsurePlayersExistAsync(new List<string>() { gamertag });
        }

        private async Task EnsurePlayerExistsInternalAsync(IEnumerable<ForzaPlayerLookupParameters> players)
        {
            var stringBuilder = new StringBuilder();
            var playerLookupResults = await this.UserManagementService.GetUserIds(players.Count(), players.ToArray()).ConfigureAwait(false);

            foreach (var player in playerLookupResults.playerLookupResult)
            {
                if (!player.PlayerExists)
                {
                    stringBuilder.Append($"{player.Xuid} ");
                }
            }

            if (stringBuilder.Length > 0)
            {
                throw new InvalidArgumentsStewardException($"Invalid XUIDs were found: {stringBuilder}");
            }
        }
    }
}
