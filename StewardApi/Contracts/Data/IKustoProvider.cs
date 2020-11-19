using System.Collections.Generic;
using System.Threading.Tasks;

namespace Turn10.LiveOps.StewardApi.Contracts.Data
{
    /// <summary>
    ///     Exposes methods for interacting with Kusto.
    /// </summary>
    public interface IKustoProvider
    {
        /// <summary>
        ///     Gets the car horns.
        /// </summary>
        /// <param name="supportedTitle">The supported title.</param>
        /// <returns>The car horns.</returns>
        Task<IList<CarHorn>> GetCarHornsAsync(KustoGameDbSupportedTitle supportedTitle);

        /// <summary>
        ///     Gets the forza cars.
        /// </summary>
        /// <param name="supportedTitle">The supported title.</param>
        /// <returns>The forza cars.</returns>
        Task<IList<ForzaCar>> GetCarsAsync(KustoGameDbSupportedTitle supportedTitle);

        /// <summary>
        ///     Gets the character customizations.
        /// </summary>
        /// <param name="supportedTitle">The supported titles.</param>
        /// <returns>The character customizations.</returns>
        Task<IList<CharacterCustomization>> GetCharacterCustomizationsAsync(KustoGameDbSupportedTitle supportedTitle);

        /// <summary>
        ///     Gets the credit rewards.
        /// </summary>
        /// <param name="supportedTitle">The supported title.</param>
        /// <returns>The credit rewards.</returns>
        Task<IList<CreditReward>> GetCreditRewardsAsync(KustoGameDbSupportedTitle supportedTitle);

        /// <summary>
        ///     Gets the emotes.
        /// </summary>
        /// <param name="supportedTitle">The supported title.</param>
        /// <returns>The emotes.</returns>
        Task<IList<Emote>> GetEmotesAsync(KustoGameDbSupportedTitle supportedTitle);

        /// <summary>
        ///     Gets the quick chats.
        /// </summary>
        /// <param name="supportedTitle">The supported title.</param>
        /// <returns>The quick chats.</returns>
        Task<IList<QuickChat>> GetQuickChatsAsync(KustoGameDbSupportedTitle supportedTitle);

        /// <summary>
        ///     Gets gift history.
        /// </summary>
        /// <param name="playerId">The player ID.</param>
        /// <param name="title">The title.</param>
        /// <returns>The gift history.</returns>
        Task<IList<GiftHistory>> GetGiftHistoryAsync(string playerId, string title);

        /// <summary>
        ///     Gets ban history.
        /// </summary>
        /// <param name="xuid">The xuid.</param>
        /// <param name="title">The title.</param>
        /// <returns>The ban history.</returns>
        Task<IList<LiveOpsBanHistory>> GetBanHistoryAsync(ulong xuid, string title);
    }
}