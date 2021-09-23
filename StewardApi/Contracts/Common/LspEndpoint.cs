using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Turn10.Data.Common;

namespace Turn10.LiveOps.StewardApi.Contracts.Common
{
    /// <summary>
    ///     Represents a supported LSP endpoint.
    /// </summary>
    public sealed class LspEndpoint
    {
        /// <summary>
        ///     Initializes a new instance of the <see cref="LspEndpoint"/> class.
        /// </summary>
        public LspEndpoint(string name)
        {
            name.ShouldNotBeNullEmptyOrWhiteSpace(nameof(name));

            this.Name = name;
        }

        /// <summary>
        ///     Gets or sets the name.
        /// </summary>
        public string Name { get; set; }
    }
}
