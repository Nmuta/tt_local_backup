using System;
using System.Collections.Generic;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using Swashbuckle.AspNetCore.Annotations;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Authorization;
using Turn10.LiveOps.StewardApi.Contracts.Common.Entitlements;
using Turn10.LiveOps.StewardApi.Contracts.Data;
using Turn10.LiveOps.StewardApi.Helpers;
using Turn10.LiveOps.StewardApi.Providers.Data;

namespace Turn10.LiveOps.StewardApi.Controllers
{
    /// <summary>
    ///     Handles Kusto requests.
    /// </summary>
    [Route("api/v1/Kusto")]
    [ApiController]
    [AuthorizeRoles(
        UserRole.LiveOpsAdmin,
        UserRole.SupportAgentAdmin,
        UserRole.SupportAgent,
        UserRole.SupportAgentNew)]
    public class KustoController : Controller
    {
        private readonly IKustoProvider kustoProvider;
        private readonly IKustoQueryProvider kustoQueryProvider;

        /// <summary>
        ///     Initializes a new instance of the <see cref="KustoController"/> class.
        /// </summary>
        public KustoController(IKustoProvider kustoProvider, IKustoQueryProvider kustoQueryProvider)
        {
            kustoProvider.ShouldNotBeNull(nameof(kustoProvider));
            kustoQueryProvider.ShouldNotBeNull(nameof(kustoQueryProvider));

            this.kustoProvider = kustoProvider;
            this.kustoQueryProvider = kustoQueryProvider;
        }

        /// <summary>
        ///     Runs a Kusto query.
        /// </summary>
        [HttpPost("query/run")]
        [SwaggerResponse(200, type: typeof(List<JObject>))]
        public async Task<IActionResult> RunQuery([FromBody] string query)
        {
            query.ShouldNotBeNullEmptyOrWhiteSpace(nameof(query));

            var pattern = new Regex(@"database\(\'(?<dbName>.*)\'\)\.");
            var database = pattern.Match(query).Groups["dbName"].Value;
            database.ShouldNotBeNullEmptyOrWhiteSpace(nameof(database));

            var result = await this.kustoProvider.RunKustoQuery(query, database).ConfigureAwait(true);
            return this.Ok(result);
        }

        /// <summary>
        ///     Saves a Kusto query.
        /// </summary>
        [HttpPost("queries")]
        [AuthorizeRoles(UserRole.LiveOpsAdmin)]
        [SwaggerResponse(200)]
        public async Task<IActionResult> SaveQueries([FromBody] IList<KustoQuery> queries)
        {
            queries.ShouldNotBeNull(nameof(queries));

            foreach (var query in queries)
            {
                await this.kustoQueryProvider.SaveKustoQueryAsync(query).ConfigureAwait(true);
            }

            return this.Ok();
        }

        /// <summary>
        ///     Edit a Kusto query.
        /// </summary>
        [HttpPut("queries/id({queryId})")]
        [AuthorizeRoles(UserRole.LiveOpsAdmin)]
        [SwaggerResponse(200)]
        public async Task<IActionResult> ReplaceQuery(string queryId, [FromBody] KustoQuery query)
        {
            queryId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(queryId));

            await this.kustoQueryProvider.ReplaceKustoQueryAsync(queryId, query).ConfigureAwait(true);

            return this.Ok();
        }

        /// <summary>
        ///     Retrieves a list of Kusto query.
        /// </summary>
        [HttpGet("queries")]
        [SwaggerResponse(200, type: typeof(List<KustoQuery>))]
        public async Task<IActionResult> RetrieveQueries()
        {
            var result = await this.kustoQueryProvider.GetKustoQueriesAsync().ConfigureAwait(true);

            return this.Ok(result);
        }

        /// <summary>
        ///     Deletes a Kusto query.
        /// </summary>
        [HttpDelete("queries/id({queryId})")]
        [AuthorizeRoles(UserRole.LiveOpsAdmin)]
        [SwaggerResponse(200)]
        public async Task<IActionResult> DeleteQuery(string queryId)
        {
            queryId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(queryId));

            await this.kustoQueryProvider.DeleteKustoQueryAsync(queryId).ConfigureAwait(true);

            return this.Ok();
        }

        /// <summary>
        ///     Get player entitlement data from Kusto.
        /// </summary>
        [HttpGet("player/{xuid}/entitlements")]
        [AuthorizeRoles(
            UserRole.LiveOpsAdmin,
            UserRole.CommunityManager,
            UserRole.SupportAgentAdmin,
            UserRole.SupportAgent,
            UserRole.SupportAgentNew)]
        [SwaggerResponse(200, type: typeof(IEnumerable<Entitlement>))]
        public async Task<IActionResult> GetPlayerEntitlements(ulong xuid)
        {
            xuid.ShouldNotBeNull(nameof(xuid));

            var exceptions = new List<Exception>();
            var getPurchasedEntitlements = this.kustoProvider.GetPlayerPurchasedEntitlements(xuid).SuccessOrDefault(Array.Empty<PurchasedEntitlement>(), exceptions);
            var getRefundedEntitlements = this.kustoProvider.GetPlayerRefundedEntitlements(xuid).SuccessOrDefault(Array.Empty<RefundedEntitlement>(), exceptions);
            var getCancelledEntitlements = this.kustoProvider.GetPlayerCancelledEntitlements(xuid).SuccessOrDefault(Array.Empty<CancelledEntitlement>(), exceptions);

            await Task.WhenAll(getPurchasedEntitlements, getRefundedEntitlements, getCancelledEntitlements).ConfigureAwait(true);

            var allEntitlements = new List<Entitlement>();
            if (getPurchasedEntitlements.IsCompletedSuccessfully)
            {
                allEntitlements.AddRange(getPurchasedEntitlements.GetAwaiter().GetResult());
            }

            if (getRefundedEntitlements.IsCompletedSuccessfully)
            {
                allEntitlements.AddRange(getRefundedEntitlements.GetAwaiter().GetResult());
            }

            if (getCancelledEntitlements.IsCompletedSuccessfully)
            {
                allEntitlements.AddRange(getCancelledEntitlements.GetAwaiter().GetResult());
            }

            return this.Ok(allEntitlements);
        }
    }
}
