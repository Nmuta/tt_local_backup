﻿using System.Collections.Generic;

namespace Turn10.LiveOps.StewardApi.Contracts.Pipelines
{
    /// <summary>
    ///     Represents the information required to create an Obligation pipeline.
    /// </summary>
    public sealed class SimplifiedObligationPipeline
    {
        /// <summary>
        ///     Gets or sets the pipeline name.
        /// </summary>
        public string PipelineName { get; set; }

        /// <summary>
        ///     Gets or sets pipeline description.
        /// </summary>
        public string PipelineDescription { get; set; }

        /// <summary>
        ///     Gets or sets the obligation pipelines.
        /// </summary>
        public IList<ObligationKustoDataActivity> KustoDataActivities { get; set; }

        /// <summary>
        ///     Gets or sets the obligation restate-o-matic pipelines.
        /// </summary>
        public IList<ObligationKustoRestateOMaticDataActivity> KustoRestateOMaticDataActivities { get; set; }

        /// <summary>
        ///     Gets or sets principals.
        /// </summary>
        public IList<ObligationPrincipal> Principals { get; set; }
    }
}
