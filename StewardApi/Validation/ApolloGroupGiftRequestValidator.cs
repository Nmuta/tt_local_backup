using System.Linq;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Contracts.Apollo;

namespace Turn10.LiveOps.StewardApi.Validation
{
    /// <summary>
    ///     Validates a <see cref="ApolloGroupGift"/> request.
    /// </summary>
    public sealed class ApolloGroupGiftRequestValidator : RequestValidatorBase, IRequestValidator<ApolloGroupGift>
    {
        private readonly IRequestValidator<ApolloPlayerInventory> playerInventoryRequestValidator;

        /// <summary>
        ///     Initializes a new instance of the <see cref="ApolloGroupGiftRequestValidator"/> class.
        /// </summary>
        /// <param name="playerInventoryRequestValidator">The player inventory request validator.</param>
        public ApolloGroupGiftRequestValidator(IRequestValidator<ApolloPlayerInventory> playerInventoryRequestValidator)
        {
            playerInventoryRequestValidator.ShouldNotBeNull(nameof(playerInventoryRequestValidator));

            this.playerInventoryRequestValidator = playerInventoryRequestValidator;
        }

        /// <inheritdoc />
        public void Validate(ApolloGroupGift model, ModelStateDictionary modelState)
        {
            model.ShouldNotBeNull(nameof(model));
            modelState.ShouldNotBeNull(nameof(modelState));

            if (model.GiftInventory == null)
            {
                modelState.AddModelError("GroupGift.GiftInventory", $"Property {nameof(model.GiftInventory)} was not supplied.");
            }
            else
            {
                this.playerInventoryRequestValidator.Validate(model.GiftInventory, modelState);
            }
        }

        /// <inheritdoc />
        public void ValidateIds(ApolloGroupGift model, ModelStateDictionary modelState)
        {
            model.ShouldNotBeNull(nameof(model));
            modelState.ShouldNotBeNull(nameof(modelState));

            if ((model.Xuids == null || !model.Xuids.Any()) && (model.Gamertags == null || !model.Gamertags.Any()))
            {
                var xuidStatus = model.Xuids == null ? "Null" : "Empty";
                var gamertagStatus = model.Gamertags == null ? "Null" : "Empty";

                modelState.AddModelError(
                    "GroupGift.Xuids/GroupGift.Gamertags",
                    $"Properties must have at least one xuid or gamertag. {nameof(model.Xuids)} was {xuidStatus}. {nameof(model.Gamertags)} was {gamertagStatus}.");
            }
        }
    }
}
