using System;
using System.Collections.Generic;
using Microsoft.Azure.Cosmos.Table;
using Newtonsoft.Json;
using Turn10.Data.Common;

namespace Turn10.LiveOps.StewardApi.Contracts.Data
{
    /// <summary>
    ///     Represents a Kusto Query.
    /// </summary>
    public sealed class KustoQueryInternal : TableEntity
    {
        /// <summary>
        ///     Initializes a new instance of the <see cref="KustoQueryInternal"/> class.
        /// </summary>
        public KustoQueryInternal()
        {
        }

        /// <summary>
        ///     Initializes a new instance of the <see cref="KustoQueryInternal"/> class.
        /// </summary>
        public KustoQueryInternal(string name, string title, string query)
        {
            name.ShouldNotBeNullEmptyOrWhiteSpace(nameof(name));
            title.ShouldNotBeNullEmptyOrWhiteSpace(nameof(title));
            query.ShouldNotBeNullEmptyOrWhiteSpace(nameof(query));

            // We do not need unique partition keys. Even with insanely huge queries (~10KB) we'll need 1 mil entries before partition key matters.
            this.PartitionKey = "0";
            this.Name = name;
            this.RowKey = Guid.NewGuid().ToString();
            this.Title = title;
            this.Query = query;
        }

        /// <summary>
        ///     Gets or sets the name.
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        ///     Gets or sets the titles.
        /// </summary>
        public string Title { get; set; }

        /// <summary>
        ///     Gets or sets the query.
        /// </summary>
        public string Query { get; set; }
    }
}
