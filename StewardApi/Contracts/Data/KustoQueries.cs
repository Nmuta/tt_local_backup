namespace Turn10.LiveOps.StewardApi.Contracts.Data
{
    /// <summary>
    ///     The query syntax for common data sets.
    /// </summary>
    public static class KustoQueries
    {
        /// <summary>
        ///     Basic query for getting the CarHorns table for a title.
        /// </summary>
        /// <remarks>Should be used with string.Format to fill the missing title name.</remarks>
        public const string GetCarHorns = "{0}_CarHorns | project ['id'], Category, column_ifexists('DisplayNameEnglish', ''), Rarity";

        /// <summary>
        ///     Basic query for getting the DataCars table for a title.
        /// </summary>
        /// <remarks>Should be used with string.Format to fill the missing title name.</remarks>
        public const string GetCars = "{0}_DataCars | lookup kind=inner ({0}_ListCarMake | project-rename MakeID=ID, MakeDisplayName=DisplayName) on MakeID | project CarId=column_ifexists('CarId', column_ifexists('Id', -1)), MediaName, DisplayName, ModelShort, MakeDisplayName";

        /// <summary>
        ///     Basic query for getting the CreditReward table for a title.
        /// </summary>
        /// <remarks>Should be used with string.Format to fill the missing title name.</remarks>
        public const string GetCreditRewards = "{0}_CreditReward | project ['id'], Rarity, Amount";

        /// <summary>
        ///     Basic query for getting the EmoteData table for a title.
        /// </summary>
        /// <remarks>Should be used with string.Format to fill the missing title name.</remarks>
        public const string GetEmotes = "{0}_EmoteData | project ['id'], column_ifexists('NameEnglish', ''), Animation, Rarity";

        /// <summary>
        ///     Basic query for getting the QuickChatData table for a title.
        /// </summary>
        /// <remarks>Should be used with string.Format to fill the missing title name.</remarks>
        public const string GetQuickChats = "{0}_QuickChatData | project ['id'], column_ifexists('ChatMessageEnglish', ''), tobool(RequiresUnlock), tobool(Hidden)";

        /// <summary>
        ///     Basic query for getting the CharacterCustomizations table for a title.
        /// </summary>
        /// <remarks>Should be used with string.Format to fill the missing title name.</remarks>
        public const string GetCharacterCustomizations = "{0}_CharacterCustomizations | project ['id'], ItemID, Rarity, SlotID, column_ifexists('DisplayNameEnglish', '')";

        /// <summary>
        ///     Gets the title mapping.
        /// </summary>
        public const string GetTitleMapping = "playfab_title_mapping()";

        /// <summary>
        ///     Gets the gift history.
        /// </summary>
        /// <remarks>Should be used with string.Format to fill out missing keys.</remarks>
        public const string GetGiftHistory = "GiftHistory | where PlayerId == '{0}' and Title == '{1}' | project PlayerId, Title, RequestingAgent, GiftSendDateUtc, GiftInventory";

        /// <summary>
        ///     Gets the ban history.
        /// </summary>
        /// <remarks>Should be used with string.Format to fill out missing keys.</remarks>
        public const string GetBanHistory = "BanHistory | where Xuid == {0} and Title == '{1}' | project Xuid, Title, RequestingAgent, StartTimeUtc, ExpireTimeUtc, FeatureArea, Reason, BanParameters";
    }
}