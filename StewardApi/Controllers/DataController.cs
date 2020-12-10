using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Contracts.Data;

namespace Turn10.LiveOps.StewardApi.Controllers
{
    /// <summary>
    ///     Handles requests for data.
    /// </summary>
    [Route("api/v1/title/")]
    [ApiController]
    [Authorize]
    public sealed class DataController : ControllerBase
    {
        private readonly IKustoProvider kustoProvider;

        /// <summary>
        ///     Initializes a new instance of the <see cref="DataController"/> class.
        /// </summary>
        /// <param name="kustoProvider">The Kusto provider.</param>
        public DataController(IKustoProvider kustoProvider)
        {
            kustoProvider.ShouldNotBeNull(nameof(kustoProvider));

            this.kustoProvider = kustoProvider;
        }

        /// <summary>
        ///     Gets forza cars.
        /// </summary>
        /// <param name="title">The title.</param>
        /// <returns>
        ///     A list of cars.
        /// </returns>
        [HttpGet("{title}/data/cars/")]
        [SwaggerResponse(200, type: typeof(IList<ForzaCar>))]
        public async Task<IActionResult> GetCarsAsync(KustoGameDbSupportedTitle title)
        {
            try
            {
                var cars = await this.kustoProvider.GetCarsAsync(title).ConfigureAwait(true);

                return this.Ok(cars);
            }
            catch (Exception ex)
            {
                return this.BadRequest(ex);
            }
        }

        /// <summary>
        ///     Gets car horns.
        /// </summary>
        /// <returns>
        ///     A list of car horns.
        /// </returns>
        [HttpGet("sunrise/data/carHorns/")]
        [SwaggerResponse(200, type: typeof(IList<CarHorn>))]
        public async Task<IActionResult> GetCarHornsAsync()
        {
            try
            {
                var carHorns = await this.kustoProvider.GetCarHornsAsync(KustoGameDbSupportedTitle.Sunrise).ConfigureAwait(true);

                return this.Ok(carHorns);
            }
            catch (Exception ex)
            {
                return this.BadRequest(ex);
            }
        }

        /// <summary>
        ///     Gets character customizations.
        /// </summary>
        /// <returns>
        ///     A list of character customizations.
        /// </returns>
        [HttpGet("sunrise/data/characterCustomizations")]
        [SwaggerResponse(200, type: typeof(IList<CharacterCustomization>))]
        public async Task<IActionResult> GetCharacterCustomizationsAsync()
        {
            try
            {
                var characterCustomizations = await this.kustoProvider.GetCharacterCustomizationsAsync(KustoGameDbSupportedTitle.Sunrise).ConfigureAwait(true);

                return this.Ok(characterCustomizations);
            }
            catch (Exception ex)
            {
                return this.BadRequest(ex);
            }
        }

        /// <summary>
        ///     Gets credit rewards.
        /// </summary>
        /// <returns>
        ///     A list of credit rewards.
        /// </returns>
        [HttpGet("sunrise/data/creditRewards/")]
        [SwaggerResponse(200, type: typeof(IList<CreditReward>))]
        public async Task<IActionResult> GetCreditRewardsAsync()
        {
            try
            {
                var creditRewards = await this.kustoProvider.GetCreditRewardsAsync(KustoGameDbSupportedTitle.Sunrise).ConfigureAwait(true);

                return this.Ok(creditRewards);
            }
            catch (Exception ex)
            {
                return this.BadRequest(ex);
            }
        }

        /// <summary>
        ///     Gets the emotes.
        /// </summary>
        /// <returns>
        ///     A list of emotes.
        /// </returns>
        [HttpGet("sunrise/data/emotes/")]
        [SwaggerResponse(200, type: typeof(IList<Emote>))]
        public async Task<IActionResult> GetEmotesAsync()
        {
            try
            {
                var emotes = await this.kustoProvider.GetEmotesAsync(KustoGameDbSupportedTitle.Sunrise).ConfigureAwait(true);

                return this.Ok(emotes);
            }
            catch (Exception ex)
            {
                return this.BadRequest(ex);
            }
        }

        /// <summary>
        ///     Gets the quick chats.
        /// </summary>
        /// <returns>
        ///     A list of quick chats.
        /// </returns>
        [HttpGet("sunrise/data/quickChats/")]
        [SwaggerResponse(200, type: typeof(IList<QuickChat>))]
        public async Task<IActionResult> GetQuickChatsAsync()
        {
            try
            {
                var quickChats = await this.kustoProvider.GetQuickChatsAsync(KustoGameDbSupportedTitle.Sunrise).ConfigureAwait(true);

                return this.Ok(quickChats);
            }
            catch (Exception ex)
            {
                return this.BadRequest(ex);
            }
        }
    }
}
