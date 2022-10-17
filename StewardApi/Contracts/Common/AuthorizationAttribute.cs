using Newtonsoft.Json;
using System;
using System.Collections.Generic;

using Turn10.Data.Common;

namespace Turn10.LiveOps.StewardApi.Contracts.Common
{
    /// <summary>
    /// Represents a Steward User Authorization Attribute
    /// See: UserAttribute.
    /// </summary>
    public class AuthorizationAttribute
    {
        /// <summary>
        ///     Gets or sets attribute.
        /// </summary>
        public string Attribute { get; set; }

        /// <summary>
        ///     Gets or sets environment.
        /// </summary>
        public string Environment { get; set; }

        /// <summary>
        ///     Gets or sets title.
        /// </summary>
        public string Title { get; set; }
    }
}
