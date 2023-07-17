using System;
using Turn10.LiveOps.StewardApi.Contracts.Common;

#pragma warning disable SA1516 // Blank Lines
#pragma warning disable SA1600 // Elements must be documented
#pragma warning disable CS1591 // Missing XML comment for publicly visible type or member
#pragma warning disable SA1604 // Elements comment should have summary

namespace Turn10.LiveOps.StewardApi.Contracts.Apollo
{
    /// <summary>
    ///     Represents an Apollo UGC item.
    /// </summary>
    /// <remarks>
    ///     Apollo is unique as its the only title where ID is not a GUID.
    /// </remarks>
    public class ApolloUgcItem : UgcItem
    {
        public new string Id { get; set; }
    }
}
