using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Metadata;

namespace Turn10.LiveOps.StewardApi.Helpers.Swagger
{
    /// <summary>
    ///     Specifies a collection of tags in <see cref="Endpoint.Metadata"/>.
    /// </summary>
    /// <remarks>
    ///     The OpenAPI specification supports a tags classification to categorize operations
    ///     into related groups. These tags are typically included in the generated specification
    ///     and are typically used to group operations by tags in the UI.
    /// </remarks>
    [AttributeUsage(AttributeTargets.Method | AttributeTargets.Delegate | AttributeTargets.Class, Inherited = false, AllowMultiple = false)]
    public sealed class DangerousTagsAttribute : Attribute, ITagsMetadata
    {
        /// <summary>
        ///     Initializes a new instance of the <see cref="DangerousTagsAttribute"/> class.
        /// </summary>
        public DangerousTagsAttribute(params string[] tags)
        {
            this.Tags = KnownTags.MakeDangerous(KnownTags.WithAll(tags)).ToList();
        }

        /// <summary>Gets the tags.</summary>
        public IReadOnlyList<string> Tags { get; }
    }
}
