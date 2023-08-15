#pragma warning disable SA1600 // Elements should be documented

namespace Turn10.LiveOps.StewardApi.Contracts.PlayFab
{
    public class PlayFabInventoryItem
    {
        public int Amount { get; set; }

        public string Id { get; set; }

        public object DisplayProperties { get; set; }

        public string StackId { get; set; }

        public string Type { get; set; }

        /// <summary>
        ///     Name of item. Gathered by cross-referencing with /Catalog/SearchItems endpoint
        /// </summary>
        public string Name { get; set; }
    }
}
