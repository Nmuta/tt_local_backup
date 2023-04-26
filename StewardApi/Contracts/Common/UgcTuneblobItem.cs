using System;

#pragma warning disable SA1600 // Elements must be documented
#pragma warning disable CS1591 // Missing XML comment for publicly visible type or member

namespace Turn10.LiveOps.StewardApi.Contracts.Common
{
    /// <summary>
    ///     Represents a UGC Tuneblob item.
    /// </summary>
    public class UgcTuneblobItem : UgcItem
    {
        public byte[] TuneblobDownloadDataBase64 { get; set; }
    }
}
