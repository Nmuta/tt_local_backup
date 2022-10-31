using System;
using System.Collections;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Autofac;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Proxies.Lsp.Steelhead;
using Turn10.LiveOps.StewardApi.Proxies.Lsp.Woodstock;
using Turn10.Services.LiveOps.FH5_main.Generated;
using ApolloContracts = Turn10.LiveOps.StewardApi.Contracts.Apollo;
using SteelheadContracts = Turn10.LiveOps.StewardApi.Contracts.Steelhead;
using SunriseContracts = Turn10.LiveOps.StewardApi.Contracts.Sunrise;
using WoodstockContracts = Turn10.LiveOps.StewardApi.Contracts.Woodstock;

namespace Turn10.LiveOps.StewardApi.Controllers.V2.Woodstock
{
    /// <summary>
    ///     Base class for v2 controllers.
    /// </summary>
    public class V2WoodstockControllerBase : ControllerBase
    {
        /// <summary>
        ///     Initializes a new instance of the <see cref="V2WoodstockControllerBase"/> class.
        /// </summary>
        protected V2WoodstockControllerBase()
        {
            this.WoodstockEndpoint = new Lazy<string>(() => this.GetWoodstockEndpoint());

            this.WoodstockServices = new Lazy<WoodstockProxyBundle>(() =>
            {
                var componentContext = this.HttpContext.RequestServices.GetService<IComponentContext>();
                var woodstockProxyBundle = componentContext.ResolveNamed<WoodstockProxyBundle>("woodstockProdLiveProxyBundle");
                woodstockProxyBundle.Endpoint = this.WoodstockEndpoint.Value;
                return woodstockProxyBundle;
            });

            this.WoodstockServicesWithProdLiveStewardCms = new Lazy<WoodstockProxyBundle>(() =>
            {
                var componentContext = this.HttpContext.RequestServices.GetService<IComponentContext>();
                var woodstockProxyBundle = componentContext.ResolveNamed<WoodstockProxyBundle>("woodstockProdLiveStewardProxyBundle");
                woodstockProxyBundle.Endpoint = this.WoodstockEndpoint.Value;
                return woodstockProxyBundle;
            });
        }

        /// <summary>
        ///     Gets the Woodstock proxy service with prod live CMS slot set.
        /// </summary>
        protected WoodstockProxyBundle Services
        {
            get { return this.WoodstockServices.Value; }
        }

        /// <summary>
        ///     Gets the Woodstock proxy service with prod live-steward CMS slot set.
        /// </summary>
        protected WoodstockProxyBundle ServicesWithProdLiveStewardCms
        {
            get { return this.WoodstockServicesWithProdLiveStewardCms.Value; }
        }

        /// <summary>Gets (lazily) the Woodstock Endpoint passed to this call.</summary>
        protected Lazy<string> WoodstockEndpoint { get; }

        /// <summary>Gets (lazily) the Woodstock services.</summary>
        private Lazy<WoodstockProxyBundle> WoodstockServices { get; }

        /// <summary>Gets (lazily) the Woodstock services.</summary>
        private Lazy<WoodstockProxyBundle> WoodstockServicesWithProdLiveStewardCms { get; }

        /// <summary>
        ///     Ensures all provided xuids are valid, else throws error.
        /// </summary>
        protected async Task EnsurePlayersExist(WoodstockProxyBundle services, IList<ulong> xuids)
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
        protected async Task EnsurePlayerExist(WoodstockProxyBundle services, ulong xuid)
        {
            var stringBuilder = new StringBuilder();

            await this.EnsurePlayersExist(services, new List<ulong>() { xuid }).ConfigureAwait(false);
        }

        /// <summary>
        ///     Ensures all provided gamertags are valid, else throws error.
        /// </summary>
        protected async Task EnsurePlayersExist(WoodstockProxyBundle services, IList<string> gamertags)
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
        protected async Task EnsurePlayerExist(WoodstockProxyBundle services, string gamertag)
        {
            var stringBuilder = new StringBuilder();

            await this.EnsurePlayersExist(services, new List<string>() { gamertag }).ConfigureAwait(false);
        }

        private async Task EnsurePlayerExistsInternal(WoodstockProxyBundle services, IEnumerable<ForzaPlayerLookupParameters> players)
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

        private string GetWoodstockEndpoint()
        {
            if (!this.Request.Headers.TryGetValue("Endpoint-Woodstock", out var key))
            {
                key = WoodstockContracts.WoodstockEndpoint.V2Default;
            }

            return WoodstockContracts.WoodstockEndpoint.GetEndpoint(key);
        }
    }
}
