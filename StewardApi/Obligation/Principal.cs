﻿using Newtonsoft.Json;

namespace Turn10.LiveOps.StewardApi.Obligation
{
    /// <summary>
    ///     An obligation principal represents an individual or a group associated with a type of permission.
    /// </summary>
    public sealed class Principal
    {
        /// <summary>
        ///     Initializes a new instance of the <see cref="Principal"/> class.
        /// </summary>
        /// <param name="value">The value.</param>
        /// <param name="type">The type.</param>
        /// <param name="role">The role.</param>
        public Principal(string value, string type, string role)
        {
            this.Value = value;
            this.Role = role;
            this.Type = type;
        }

        /// <summary>
        ///     Gets or sets the type.
        /// </summary>
        [JsonProperty("principal_type")]
        public string Type { get; set; }

        /// <summary>
        ///     Gets or sets the role.
        /// </summary>
        [JsonProperty("role")]
        public string Role { get; set; }

        /// <summary>
        ///     Gets or sets the value.
        /// </summary>
        /// <remarks>
        ///     For user roles, use the user's email address.
        ///     For group roles, use the AAD object ID of the group.
        /// </remarks>
        [JsonProperty("principal_value")]
        public string Value { get; set; }
    }
}
