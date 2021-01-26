﻿using Newtonsoft.Json;

namespace Turn10.LiveOps.StewardApi.Obligation
{
    /// <summary>
    ///     A dependency represents a relationship between two data activities.
    /// </summary>
    public sealed class Dependency
    {
        /// <summary>
        ///     Initializes a new instance of the <see cref="Dependency"/> class.
        /// </summary>
        /// <param name="type">The type.</param>
        /// <param name="name">The name.</param>
        public Dependency(string type, string name)
        {
            this.Type = type;
            this.DataActivityDependencyName = name;
        }

        /// <summary>
        ///     Gets or sets the type.
        /// </summary>
        [JsonProperty("type")]
        public string Type { get; set; }

        /// <summary>
        ///     Gets or sets the data activity dependency name.
        /// </summary>
        [JsonProperty("dependency_name", DefaultValueHandling = DefaultValueHandling.IgnoreAndPopulate)]
        public string DataActivityDependencyName { get; set; }
    }
}
