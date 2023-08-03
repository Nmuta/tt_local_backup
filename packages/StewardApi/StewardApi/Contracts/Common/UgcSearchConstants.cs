namespace Turn10.LiveOps.StewardApi.Contracts.Common
{
    /// <summary>
    ///     Represents constants to utilize during UGC search.
    /// </summary>
    public static class UgcSearchConstants
    {
        /// <summary>
        ///     Value to pass into carId filter when you want that field to be ignored during the search.
        /// </summary>
        public static readonly int NoCarId = -1;

        /// <summary>
        ///     Value to pass into keywordId* filter when you want that field to be ignored during the search.
        /// </summary>
        public static readonly int NoKeywordId = -1;

        /// <summary>
        ///     Value to pass into xuid filter when you want that field to be ignored during the search.
        /// </summary>
        public static readonly ulong NoXuid = ulong.MaxValue;

        /// <summary>
        ///     Value to pass into keywords filter when you want that field to be ignored during the search.
        /// </summary>
        public static readonly string NoKeywords = string.Empty;
    }
}
