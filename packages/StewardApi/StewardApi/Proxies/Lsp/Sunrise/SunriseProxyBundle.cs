using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Forza.LiveOps.FH4.Generated;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Proxies.Lsp.Sunrise.Services;

namespace Turn10.LiveOps.StewardApi.Proxies.Lsp.Sunrise
{
    public class SunriseProxyBundle
    {
        private string endpoint;

        /// <summary>
        ///     Initializes a new instance of the <see cref="SunriseProxyBundle"/> class.
        /// </summary>
        public SunriseProxyBundle(ISunriseProxyFactory sunriseFactory)
        {
            this.SunriseFactory = sunriseFactory;
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
                    throw new NotFoundStewardException("Endpoint value could not be found for Sunrise Proxy Factory.");
                }

                return this.endpoint;
            }

            set
            {
                this.endpoint = value;
            }
        }

        /// <summary>
        ///     Gets live ops service.
        /// </summary>
        public IUserService UserService => this.SunriseFactory.PrepareUserService(this.Endpoint);

        /// <summary>
        ///     Gets user management service.
        /// </summary>
        public IUserManagementService UserManagementService => this.SunriseFactory.PrepareUserManagementService(this.Endpoint);

        /// <summary>
        ///     Gets storefront service.
        /// </summary>
        public IStorefrontService StorefrontService => this.SunriseFactory.PrepareStorefrontService(this.Endpoint);

        /// <summary>
        ///     Gets storefront management service.
        /// </summary>
        public IStorefrontManagementService StorefrontManagementService => this.SunriseFactory.PrepareStorefrontManagementService(this.Endpoint);

        private ISunriseProxyFactory SunriseFactory { get; }

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
            var playersArray = players.ToArray();
            var playerLookupResults = await this.UserManagementService.GetUserIds(playersArray.Length, playersArray).ConfigureAwait(false);

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
