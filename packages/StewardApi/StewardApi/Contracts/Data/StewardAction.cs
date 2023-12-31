﻿#pragma warning disable SA1600 // Elements must be documented
#pragma warning disable CS1591 // Missing XML comment for publicly visible type or member

namespace Turn10.LiveOps.StewardApi.Contracts.Data
{
    /// <summary>
    ///     Actions that can be taken in Steward
    /// </summary>
    public enum StewardAction
    {
        None,
        Add,
        Update,
        Delete,
        DeleteAll,
    }
}
