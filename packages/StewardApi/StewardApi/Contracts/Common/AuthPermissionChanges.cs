﻿using System.Collections.Generic;

namespace Turn10.LiveOps.StewardApi.Contracts.Common
{
    /// <summary>
    ///     Represents permission changes that should be applied to a user.
    /// </summary>
    public sealed class AuthPermissionChanges
    {
        /// <summary>
        ///     Gets or sets the list of perm attributes to add.
        /// </summary>
        public IEnumerable<AuthorizationAttributeData> AttributesToAdd { get; set; }

        /// <summary>
        ///     Gets or sets the list of perm attributes to remove.
        /// </summary>
        public IEnumerable<AuthorizationAttributeData> AttributesToRemove { get; set; }
    }
}
