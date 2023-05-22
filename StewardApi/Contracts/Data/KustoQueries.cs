using System.Collections.Generic;

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
        ///     Basic query for getting the FH4 Car data.
        /// </summary>
        public const string GetFH4Cars =
            "FH4_DataCars | join kind = leftouter(FH4_ListCarMake | project MakeDisplayName = DisplayName, MakeID = ID) on MakeID | project Id = CarId, Description = strcat_delim(' ', MakeDisplayName, DisplayName, strcat(\"(\", Year, \")\"))";

        /// <summary>
        ///     Basic query for getting the details FH4 Car data.
        /// </summary>
        public const string GetFH4CarsDetailed =
            "FH4_DataCars | join kind = leftouter(FH4_ListCarMake | project MakeDisplayName = DisplayName, MakeID = ID) on MakeID | project Id = CarId, MakeID, Make = MakeDisplayName, Model = DisplayName, Year = Year";

        /// <summary>
        ///     Basic query for getting the details FM7 Car data.
        /// </summary>
        public const string GetFM7CarsDetailed =
            "FM7_DataCars | join kind = leftouter(database('T10Analytics').FM7_ListCarMake | project MakeDisplayName = DisplayName, MakeID = ID) on MakeID | project Id = Id, MakeID, Make = MakeDisplayName, Model = DisplayName, Year = Year";

        /// <summary>
        ///     Basic query for getting the details FM8 Car data.
        /// </summary>
        public const string GetFM8CarsDetailed =
            "FM8_DataCars | join kind = leftouter(FM8_ListCarMake | project MakeDisplayName = DisplayName, MakeID = ID) on MakeID | project Id = ModelId, MakeID, Make = MakeDisplayName, Model = DisplayName, Year = Year";

        /// <summary>
        ///     Basic query for getting the FH4 CarHorn data.
        /// </summary>
        public const string GetFH4CarHorns = "FH4_CarHorns | project Id=['id'], column_ifexists('DisplayNameEnglish', '')";

        /// <summary>
        ///     Basic query for getting the FH4 VanityItem data.
        /// </summary>
        public const string GetFH4VanityItems = "FH4_VanityItems | project Id=['id'], DisplayNameEnglish=column_ifexists('DisplayNameEnglish', column_ifexists('ItemID', ''))";

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
        ///     Allowed queries to get detailed car lists from Kusto.
        /// </summary>
        public static readonly IList<string> AllowedDetailedKustoCarQueries = new List<string>()
        {
            GetFH4CarsDetailed,
            GetFM7CarsDetailed,
            GetFM8CarsDetailed,
        };
    }
}