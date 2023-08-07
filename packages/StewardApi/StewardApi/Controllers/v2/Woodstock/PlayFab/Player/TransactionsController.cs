using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Authorization;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Controllers.V2.Woodstock;
using Turn10.LiveOps.StewardApi.Filters;
using Turn10.LiveOps.StewardApi.Helpers.Swagger;
using Turn10.LiveOps.StewardApi.Providers.Woodstock.PlayFab;
using static Turn10.LiveOps.StewardApi.Helpers.Swagger.KnownTags;
using Turn10.LiveOps.StewardApi.Contracts.PlayFab;
using PlayFab.EconomyModels;
using Kusto.Cloud.Platform.Utils;
using System.Linq;

#pragma warning disable CA1308 // Use .ToUpperInvariant
namespace Turn10.LiveOps.StewardApi.Controllers.v2.Woodstock.PlayFab.Player
{
    /// <summary>
    ///     Handles requests for Woodstock players PlayFab Transaction integrations.
    /// </summary>
    [Route("api/v{version:apiVersion}/title/woodstock/playfab/player/{playFabEntityId}/transactions")]
    [AuthorizeRoles(UserRole.LiveOpsAdmin, UserRole.GeneralUser)]
    [LogTagTitle(TitleLogTags.Woodstock)]
    [ApiController]
    [ApiVersion("2.0")]
    [StandardTags(Title.Woodstock, Target.PlayFab)]
    public class TransactionsController : V2WoodstockControllerBase
    {
        private readonly IWoodstockPlayFabService playFabService;

        /// <summary>
        ///     Initializes a new instance of the <see cref="TransactionsController"/> class for Woodstock.
        /// </summary>
        public TransactionsController(IWoodstockPlayFabService playFabService)
        {
            playFabService.ShouldNotBeNull(nameof(playFabService));

            this.playFabService = playFabService;
        }

        /// <summary>
        ///     Retrieves transaction history for PlayFab player.
        /// </summary>
        [HttpGet]
        [SwaggerResponse(200, type: typeof(IList<PlayFabTransaction>))]
        [LogTagDependency(DependencyLogTags.PlayFab)]
        public async Task<IActionResult> GetPlayFabTransactionHistory(string playFabEntityId)
        {
            var playFabEnvironment = this.PlayFabEnvironment;

            try
            {
                var vouchers = await this.playFabService.GetVouchersAsync(playFabEnvironment).ConfigureAwait(true);
                var transactions = await this.playFabService.GetTransactionHistoryAsync(playFabEntityId, playFabEnvironment).ConfigureAwait(true);

                transactions.ForEach(transaction => 
                {
                    transaction.Operations.ForEach(operation =>
                    {
                        var voucher = vouchers.FirstOrDefault(voucher => voucher.Id == operation.ItemId);
                        operation.ItemName = voucher.Title["NEUTRAL"] ?? "N/A";
                    });
                });

                return this.Ok(transactions);
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException($"Failed to get player PlayFab transaction history. (playFabId: {playFabEntityId}) (playFabEnvironment: {playFabEnvironment})", ex);
            }
        }
    }
}
