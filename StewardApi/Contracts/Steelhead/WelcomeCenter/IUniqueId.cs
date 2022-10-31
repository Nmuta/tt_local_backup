using System;

namespace Turn10.LiveOps.StewardApi.Contracts.Steelhead.WelcomeCenter
{
    /// <summary>
    ///     The interface for welcome center entries.
    /// </summary>
    public interface IUniqueId
    {
        /// <summary>
        ///     Gets the id of an entry.
        /// </summary>
        Guid UniqueId { get; }
    }
}