using System;

namespace Turn10.LiveOps.StewardApi.Contracts.Legacy
{
    /// <summary>
    ///     Represents the car team member.
    /// </summary>
    public sealed class CarTeamMember
    {
        /// <summary>
        ///     Gets or sets the VIN.
        /// </summary>
        public Guid Vin { get; set; }

        /// <summary>
        ///     Gets or sets the repair state.
        /// </summary>
        public uint RepairState { get; set; }
    }
}