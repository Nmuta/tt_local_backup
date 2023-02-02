using Microsoft.Azure.Cosmos.Table;
using Newtonsoft.Json;
using System.Collections.Generic;
using Turn10.Data.Common;

namespace Turn10.LiveOps.StewardApi.Contracts.Common
{
    /// <summary>
    ///     Represents a Live Ops user.
    /// </summary>
    public sealed class StewardUserInternal : TableEntity
    {
        /// <summary>
        ///     Initializes a new instance of the <see cref="StewardUserInternal"/> class.
        /// </summary>
        public StewardUserInternal()
        { }

        /// <summary>
        ///     Initializes a new instance of the <see cref="StewardUserInternal"/> class.
        /// </summary>
        public StewardUserInternal(string userObjectId, string name, string emailAddress, string role, string attributes, string team)
        {
            userObjectId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(userObjectId));
            name.ShouldNotBeNullEmptyOrWhiteSpace(nameof(name));
            emailAddress.ShouldNotBeNullEmptyOrWhiteSpace(nameof(emailAddress));
            emailAddress.ShouldNotBeNullEmptyOrWhiteSpace(nameof(role));

            this.RowKey = userObjectId;
            this.Name = name;
            this.PartitionKey = "Users";
            this.EmailAddress = emailAddress;
            this.Role = role;
            this.Attributes = attributes;
            this.Team = team;
        }

        /// <summary>
        ///     Gets the user's Azure object ID.
        /// </summary>
        public string ObjectId => this.RowKey;

        /// <summary>
        ///     Gets or sets the email address.
        /// </summary>
        public string EmailAddress { get; set; }

        /// <summary>
        ///     Gets or sets the name.
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        ///     Gets or sets the role.
        /// </summary>
        public string Role { get; set; }

        /// <summary>
        ///     Gets or sets the attributes.
        /// </summary>
        public string Attributes { get; set; }

        /// <summary>
        ///     Gets or sets the attributes.
        /// </summary>
        public string Team { get; set; }

        /// <summary>
        ///     Gets the autorization attributes as an object.
        /// </summary>
        /// <returns>List of <see cref="AuthorizationAttribute"/>.</returns>
        public IEnumerable<AuthorizationAttribute> AuthorizationAttributes()
        {
            if (string.IsNullOrEmpty(this.Attributes) || "null".Equals(this.Attributes, System.StringComparison.OrdinalIgnoreCase))
            {
                return System.Array.Empty<AuthorizationAttribute>();
            }

            return JsonConvert.DeserializeObject<IEnumerable<AuthorizationAttribute>>(this.Attributes);
        }

        /// <summary>
        ///     Gets the team as an object.
        /// </summary>
        /// <returns><see cref="Team"/>.</returns>
        public Team DeserializeTeam()
        {
            if (string.IsNullOrEmpty(this.Team) || "null".Equals(this.Team, System.StringComparison.OrdinalIgnoreCase))
            {
                return new Team(); // Empty team
            }

            return JsonConvert.DeserializeObject<Team>(this.Team);
        }
    }
}