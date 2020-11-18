using System;

namespace Turn10.LiveOps.StewardApi.Contracts.Legacy
{
    /// <summary>
    ///     Represents the heat node.
    /// </summary>
    public sealed class HeatNode
    {
        /// <summary>
        ///     Gets or sets the ID.
        /// </summary>
        public uint Id { get; set; }

        /// <summary>
        ///     Gets or sets the car.
        /// </summary>
        public Guid Car { get; set; }

        /// <summary>
        ///     Gets or sets the score.
        /// </summary>
        public uint Score { get; set; }
    }
}