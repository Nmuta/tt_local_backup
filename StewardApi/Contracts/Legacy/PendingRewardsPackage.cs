namespace Turn10.LiveOps.StewardApi.Contracts.Legacy
{
    /// <summary>
    ///     Represents the pending rewards package.
    /// </summary>
    public sealed class PendingRewardsPackage
    {
        /// <summary>
        ///     Gets or sets the reward type.
        /// </summary>
        public string RewardType { get; set; }

        /// <summary>
        ///     Gets or sets the rewards package client ID.
        /// </summary>
        public int RewardsPackageClientId { get; set; }
    }
}