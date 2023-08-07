using System;
using System.Collections.Generic;

namespace Turn10.LiveOps.StewardApi.Contracts.Common
{
    /// <summary>
    ///     Represents a Steward team.
    /// </summary>
    public class Team
    {
        /// <summary>
        ///     Gets or sets team name.
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        ///     Gets or sets team members (by guid).
        /// </summary>
        public IEnumerable<Guid> Members { get; set; } = new List<Guid>();
    }
}
