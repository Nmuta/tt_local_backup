namespace Turn10.LiveOps.StewardApi.Contracts.Data
{
    /// <summary>
    ///     The query syntax for common data sets.
    /// </summary>
    public static class KustoQueries
    {
        /// <summary>
        ///     Basic query for getting the CreditReward table for a title.
        /// </summary>
        /// <remarks>Should be used with string.Format to fill the missing title name.</remarks>
        public const string GetCreditRewards = "{0}_CreditReward | project ['id'], Rarity, Amount";

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

        /// <summary>
        ///     Basic query for getting the FH4 Car data.
        /// </summary>
        public const string GetFH4Cars =
            "FH4_DataCars | join kind = leftouter(FH4_ListCarMake | project MakeDisplayName = DisplayName, MakeID = ID) on MakeID | project Id = CarId, Description = strcat_delim(' ', MakeDisplayName, DisplayName, strcat(\"(\", Year, \")\"))";

        /// <summary>
        ///     Basic query for getting the FH4 CarHorn data.
        /// </summary>
        public const string GetFH4CarHorns = "FH4_CarHorns | project Id=['id'], column_ifexists('DisplayNameEnglish', '')";

        /// <summary>
        ///     Basic query for getting the FH4 VanityItem data.
        /// </summary>
        public const string GetFH4VanityItems = "FH4_VanityItems | project Id=['id'], DisplayNameEnglish=coalesce(DisplayNameEnglish, ItemID)";

        /// <summary>
        ///     Basic query for getting the FH4 Emote data.
        /// </summary>
        public const string GetFH4Emotes = "FH4_EmoteData | project Id=['id'], column_ifexists('NameEnglish', '')";

        /// <summary>
        ///     Basic query for getting the FH4 QuickChatLine data.
        /// </summary>
        public const string GetFH4QuickChatLines = "FH4_QuickChatData | project Id=['id'], column_ifexists('ChatMessageEnglish', '')";

        /// <summary>
        ///     Basic query for getting the FM7 Car data.
        /// </summary>
        public const string GetFM7Cars = "FM7_DataCars | join kind=leftouter (database('T10Analytics').FM7_ListCarMake | project MakeDisplayName=DisplayName, MakeID=ID) on MakeID | project Id=Id, Description=strcat_delim(' ', MakeDisplayName, DisplayName, strcat(\"(\", Year, \")\"))";

        /// <summary>
        ///     Basic query for getting the FM7 VanityItem data.
        /// </summary>
        public const string GetFM7VanityItems = "FM7_VanityItems | project Id, Name";

        /// <summary>
        ///     Basic query for getting the FM8 Car data.
        /// </summary>
        public const string GetFM8Cars = "FM8_DataCars | join kind=leftouter (database('T10Analytics').FM8_ListCarMake | project MakeDisplayName=DisplayName, MakeID=ID) on MakeID | project Id=Id, Description=strcat_delim(' ', MakeDisplayName, DisplayName, strcat(\"(\", Year, \")\"))";

        /// <summary>
        ///     Basic query for getting the FM8 VanityItem data.
        /// </summary>
        public const string GetFM8VanityItems = "FM8_VanityItems | project Id, Name";

        /// <summary>
        ///     Basic query for getting the FH4 Car data.
        /// </summary>
        public const string GetFH5Cars =
            "FH5_DataCars | join kind = leftouter(FH5_ListCarMake | project MakeDisplayName = DisplayName, MakeID = ID) on MakeID | project Id = Id, Description = strcat_delim(' ', MakeDisplayName, DisplayName, strcat(\"(\", Year, \")\"))";

        /// <summary>
        ///     Basic query for getting the FH4 CarHorn data.
        /// </summary>
        public const string GetFH5CarHorns = "FH5_CarHorns | project Id=['id'], column_ifexists('DisplayNameEnglish', '')";

        /// <summary>
        ///     Basic query for getting the FH4 VanityItem data.
        /// </summary>
        public const string GetFH5VanityItems = "FH5_VanityItems | project Id=['id'], DisplayNameEnglish=coalesce(DisplayNameEnglish, ItemID)";

        /// <summary>
        ///     Basic query for getting the FH4 Emote data.
        /// </summary>
        public const string GetFH5Emotes = "FH5_EmoteData | project Id=['id'], column_ifexists('NameEnglish', '')";

        /// <summary>
        ///     Basic query for getting the FH4 QuickChatLine data.
        /// </summary>
        public const string GetFH5QuickChatLines = "FH5_QuickChatData | project Id=['id'], column_ifexists('ChatMessageEnglish', '')";
    }
}