﻿using System.Collections.Generic;

#pragma warning disable SA1600 // ElementsMustBeDocumented (POCO mapped directly from LSP)
#pragma warning disable CS1591 // XML Comments (POCO mapped directly from LSP)
namespace Turn10.LiveOps.StewardApi.Contracts.Common
{
    /// <summary>
    ///     Represents a bulk localized message.
    /// </summary>
    public class BulkLocalizedMessage : LocalizedMessage
    {
        public IList<ulong> Xuids { get; set; }
    }
}
