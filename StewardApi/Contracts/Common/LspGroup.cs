using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Turn10.LiveOps.StewardApi.Contracts.Common
{
    /// <summary>
    ///     Represents a LSP group.
    /// </summary>
    public sealed class LspGroup
    {
        /// <summary>
        ///     Gets or sets the ID.
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        ///     Gets or sets the name.
        /// </summary>
        public string Name { get; set; }
    }
}
