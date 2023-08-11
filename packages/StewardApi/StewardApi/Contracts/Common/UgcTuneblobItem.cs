#pragma warning disable SA1600 // Elements must be documented
#pragma warning disable CS1591 // Missing XML comment for publicly visible type or member

namespace Turn10.LiveOps.StewardApi.Contracts.Common
{
    /// <summary>
    ///     Represents a UGC Tune Blob item.
    /// </summary>
    public class UgcTuneBlobItem : UgcItem
    {
        public byte[] TuneBlobDownloadDataBase64 { get; set; }
    }
}
