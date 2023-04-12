using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Proxies.Lsp.Woodstock;
using Turn10.LiveOps.StewardApi.Proxies.Lsp.Woodstock.Services;
using Turn10.Services.LiveOps.FH5_main.Generated;

namespace Turn10.LiveOps.StewardApi.Proxies.Lsp.Woodstock
{
    public class WoodstockProxyBundle
    {
        private string endpoint;

        /// <summary>
        ///     Initializes a new instance of the <see cref="WoodstockProxyBundle"/> class.
        /// </summary>
        public WoodstockProxyBundle(IWoodstockProxyFactory woodstockFactory)
        {
            this.WoodstockFactory = woodstockFactory;
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
                    throw new NotFoundStewardException("Endpoint value could not be found for Woodstock Proxy Factory.");
                }

                return this.endpoint;
            }

            set
            {
                this.endpoint = value;
            }
        }

        /// <summary>
        ///     Gets a <see cref="IUserInventoryManagementService" />.
        /// </summary>
        public IUserInventoryManagementService UserInventoryManagementService => this.WoodstockFactory.PrepareUserInventoryManagementService(this.Endpoint);

        /// <summary>
        ///     Gets a <see cref="IStorefrontManagementService" />.
        /// </summary>
        public IStorefrontManagementService StorefrontManagementService => this.WoodstockFactory.PrepareStorefrontManagementService(this.Endpoint);

        /// <summary>
        ///     Gets a <see cref="ILiveOpsService" />.
        /// </summary>
        public ILiveOpsService LiveOpsService => this.WoodstockFactory.PrepareLiveOpsService(this.Endpoint);

        /// <summary>
        ///     Gets a <see cref="IUserManagementService" />.
        /// </summary>
        public IUserManagementService UserManagementService => this.WoodstockFactory.PrepareUserManagementService(this.Endpoint);

        /// <summary>
        ///     Gets a <see cref="IPermissionsManagementService" />.
        /// </summary>
        public IPermissionsManagementService PermissionsManagementService => this.WoodstockFactory.PreparePermissionsManagementService(this.Endpoint);

        /// <summary>
        ///     Gets a <see cref="IGiftingManagementService" />.
        /// </summary>
        public IGiftingManagementService GiftingManagementService => this.WoodstockFactory.PrepareGiftingManagementService(this.Endpoint);

        /// <summary>
        ///     Gets a <see cref="IRareCarShopService" />.
        /// </summary>
        public IRareCarShopService RareCarShopService => this.WoodstockFactory.PrepareRareCarShopService(this.Endpoint);

        /// <summary>
        ///     Gets a <see cref="INotificationsManagementService" />.
        /// </summary>
        public INotificationsManagementService NotificationsManagementService => this.WoodstockFactory.PrepareNotificationsManagementService(this.Endpoint);

        /// <summary>
        ///     Gets a <see cref="IAuctionManagementService" />.
        /// </summary>
        public IAuctionManagementService AuctionManagementService => this.WoodstockFactory.PrepareAuctionManagementService(this.Endpoint);

        /// <summary>
        ///     Gets a <see cref="IStorefrontService" />.
        /// </summary>
        public IStorefrontService Storefront => this.WoodstockFactory.PrepareStorefrontService(this.Endpoint);

        /// <summary>
        ///     Gets a <see cref="IConfigurationManagementService" />.
        /// </summary>
        public IConfigurationManagementService ConfigurationManagementService => this.WoodstockFactory.PrepareConfigurationManagementService(this.Endpoint);

        private IWoodstockProxyFactory WoodstockFactory { get; }

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
