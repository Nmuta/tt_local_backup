using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;

namespace Turn10.LiveOps.StewardApi.Contracts.Data
{
    /// <summary>
    ///     Represents a Kusto Query.
    /// </summary>
    public sealed class KustoQuery
    {
        /// <summary>
        ///     Initializes a new instance of the <see cref="KustoQuery"/> class.
        /// </summary>
        public KustoQuery()
        {
        }

        /// <summary>
        ///     Initializes a new instance of the <see cref="KustoQuery"/> class.
        /// </summary>
        /// <param name="name">The name.</param>
        /// <param name="title">The title.</param>
        /// <param name="query">The query.</param>
        public KustoQuery(string name, string title, string query)
        {
            this.Name = name;
            this.Title = title;
            this.Query = query;
        }

        /// <summary>
        ///     Gets or sets the Id.
        /// </summary>
        public Guid Id { get; set; }

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
