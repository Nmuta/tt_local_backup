using System;

namespace Turn10.LiveOps.StewardApi.Contracts.Common
{
    /// <summary>
    ///     Represents a backstage pass transaction.
    /// </summary>
    public sealed class BackstagePassUpdate
    {
        /// <summary>
        ///     Gets or sets the created at UTC time.
        /// </summary>
        public DateTime CreatedAtUtc { get; set; }

        /// <summary>
        ///     Gets or sets the unique ID.
        /// </summary>
        public Guid UniqueId { get; set; }

        /// <summary>
        ///     Gets or sets the transaction type.
        /// </summary>
        public string TransactionType { get; set; }

        /// <summary>
        ///     Gets or sets the backstage pass amount.
        /// </summary>
        public uint BackstagePassAmount { get; set; }
    }
}
