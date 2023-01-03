using Microsoft.AspNetCore.Authorization;

namespace Turn10.LiveOps.StewardApi.Authorization
{
    /// <summary>
    /// User attribute to check.
    /// </summary>
    public class AttributeRequirement : IAuthorizationRequirement
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="AttributeRequirement"/> class.
        /// </summary>
        /// <param name="attribute">attribute</param>
        public AttributeRequirement(string attribute) { this.Attribute = attribute; }

        /// <summary>
        /// Gets attribute.
        /// </summary>
        public string Attribute { get; private set; }
    }
}