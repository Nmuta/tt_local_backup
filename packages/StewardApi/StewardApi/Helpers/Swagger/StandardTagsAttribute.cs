﻿using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Metadata;
using System;
using System.Collections.Generic;
using System.Linq;

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
    public sealed class StandardTagsAttribute : Attribute, ITagsMetadata
    {
        /// <summary>
        ///     Initializes a new instance of the <see cref="StandardTagsAttribute"/> class.
        /// </summary>
        public StandardTagsAttribute(params string[] tags)
        {
            this.Tags = KnownTags.WithAll(tags).ToList();
        }

        /// <summary>Gets the tags.</summary>
        public IReadOnlyList<string> Tags { get; }
    }
}
