using System;
using System.Collections;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Proxies.Lsp.Steelhead;
using Turn10.LiveOps.StewardApi.Proxies.Lsp.Woodstock;
using Turn10.Services.LiveOps.FM8.Generated;
using ApolloContracts = Turn10.LiveOps.StewardApi.Contracts.Apollo;
using SteelheadContracts = Turn10.LiveOps.StewardApi.Contracts.Steelhead;
using SunriseContracts = Turn10.LiveOps.StewardApi.Contracts.Sunrise;
using WoodstockContracts = Turn10.LiveOps.StewardApi.Contracts.Woodstock;

namespace Turn10.LiveOps.StewardApi.Controllers.v2.Steelhead
{
    /// <summary>
    ///     Base class for v2 controllers.
    /// </summary>
    public class V2SteelheadControllerBase : ControllerBase
    {
        /// <summary>
        ///     Initializes a new instance of the <see cref="V2SteelheadControllerBase"/> class.
        /// </summary>
        protected V2SteelheadControllerBase()
        {
            this.SteelheadEndpoint = new Lazy<string>(() => this.GetSteelheadEndpoint());

            this.SteelheadServices = new Lazy<SteelheadProxyBundle>(() =>
            {
                var steelheadProxyBundle = this.HttpContext.RequestServices.GetService<SteelheadProxyBundle>();
                steelheadProxyBundle.Endpoint = this.SteelheadEndpoint.Value;
                return steelheadProxyBundle;
            });
        }

        /// <summary>
        ///     Gets the Steelhead prooxy service.
        /// </summary>
        protected SteelheadProxyBundle Services
        {
            get { return this.SteelheadServices.Value; }
        }

        /// <summary>Gets (lazily) the Steelhead Endpoint passed to this call.</summary>
        protected Lazy<string> SteelheadEndpoint { get; }

        /// <summary>Gets (lazily) the Steelhead services.</summary>
        private Lazy<SteelheadProxyBundle> SteelheadServices { get; }

        private string GetSteelheadEndpoint()
        {
            if (!this.Request.Headers.TryGetValue("Endpoint-Steelhead", out var key))
            {
                key = SteelheadContracts.SteelheadEndpoint.V2Default;
            }

            return SteelheadContracts.SteelheadEndpoint.GetEndpoint(key);
        }

        /// <summary>
        ///     Ensures all provided xuids are valid, else throws error.
        /// </summary>
        protected async Task EnsurePlayersExist(SteelheadProxyBundle services, IList<ulong> xuids)
        {
            var players = xuids.Select<ulong, ForzaPlayerLookupParameters>(xuid =>
            {
                return new ForzaPlayerLookupParameters()
                {
                    UserID = xuid.ToString(CultureInfo.InvariantCulture),
                    UserIDType = ForzaUserIdType.Xuid,
                };
            });

            await this.EnsurePlayerExistsInternal(services, players).ConfigureAwait(false);
        }

        /// <summary>
        ///     Ensures provided xuid is valid, else throws error.
        /// </summary>
        protected async Task EnsurePlayerExist(SteelheadProxyBundle services, ulong xuid)
        {
            var stringBuilder = new StringBuilder();

            await this.EnsurePlayersExist(services, new List<ulong>() { xuid }).ConfigureAwait(false);
        }

        /// <summary>
        ///     Ensures all provided gamertags are valid, else throws error.
        /// </summary>
        protected async Task EnsurePlayersExist(SteelheadProxyBundle services, IList<string> gamertags)
        {
            var players = gamertags.Select<string, ForzaPlayerLookupParameters>(gamertag =>
            {
                return new ForzaPlayerLookupParameters()
                {
                    UserID = gamertag,
                    UserIDType = ForzaUserIdType.Xuid,
                };
            });

            await this.EnsurePlayerExistsInternal(services, players).ConfigureAwait(false);
        }

        /// <summary>
        ///     Ensures provided gamertag is valid, else throws error.
        /// </summary>
        protected async Task EnsurePlayerExist(SteelheadProxyBundle services, string gamertag)
        {
            var stringBuilder = new StringBuilder();

            await this.EnsurePlayersExist(services, new List<string>() { gamertag }).ConfigureAwait(false);
        }

        private async Task EnsurePlayerExistsInternal(SteelheadProxyBundle services, IEnumerable<ForzaPlayerLookupParameters> players)
        {
            var stringBuilder = new StringBuilder();
            var playerLookupResults = await services.UserManagementService.GetUserIds(players.Count(), players.ToArray()).ConfigureAwait(false);

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
