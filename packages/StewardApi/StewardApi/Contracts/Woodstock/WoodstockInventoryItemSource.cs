namespace Turn10.LiveOps.StewardApi.Contracts.Woodstock
{
    /// <summary>
    ///     A list of supported item sources for Woodstock player inventory.
    /// </summary>
    public enum WoodstockInventoryItemSource
    {
        Unknown = 0,
        Gameplay = 1,
        Gift = 2,
        PlayFabUserInventory = 3,
        Auction = 4,
    }
}
