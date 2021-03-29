using System;
using System.Collections.Generic;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using Swashbuckle.AspNetCore.Annotations;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Authorization;
using Turn10.LiveOps.StewardApi.Contracts.Data;
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
        UserRole.DataPipelineContributor,
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
        /// <param name="kustoProvider">The Kusto provider.</param>
        /// <param name="kustoQueryProvider">The Kusto Query provider.</param>
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
        /// <param name="query">The query.</param>
        /// <returns>
        ///     A list of <see cref="JObject"/>.
        /// </returns>
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
        /// <param name="queries">The queries.</param>
        /// <returns>
        ///     A list of <see cref="JObject"/>.
        /// </returns>
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
        /// <param name="queryId">The query id.</param>
        /// <param name="query">The new query.</param>
        /// <returns>
        ///     A list of <see cref="JObject"/>.
        /// </returns>
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
        /// <returns>
        ///     A <see cref="List{JObject}"/>.
        /// </returns>
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
        /// <param name="queryId">The query id.</param>
        /// <returns>
        ///     A list of <see cref="JObject"/>.
        /// </returns>
        [HttpDelete("queries/id({queryId})")]
        [AuthorizeRoles(UserRole.LiveOpsAdmin)]
        [SwaggerResponse(200)]
        public async Task<IActionResult> DeleteQuery(string queryId)
        {
            queryId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(queryId));

            await this.kustoQueryProvider.DeleteKustoQueryAsync(queryId).ConfigureAwait(true);

            return this.Ok();
        }
    }
}
