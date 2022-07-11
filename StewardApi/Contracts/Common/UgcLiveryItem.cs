﻿using System;

#pragma warning disable SA1600 // Elements must be documented
#pragma warning disable CS1591 // Missing XML comment for publicly visible type or member

namespace Turn10.LiveOps.StewardApi.Contracts.Common
{
    /// <summary>
    ///     Represents a UGC Livery item.
    /// </summary>
    public class UgcLiveryItem : UgcItem
    {
        public byte[] LiveryDownloadData { get; set; }
    }
}
