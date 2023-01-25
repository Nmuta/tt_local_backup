using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.ApplicationInsights.DataContracts;
using Microsoft.AspNetCore.Mvc.Filters;
using Turn10.LiveOps.StewardApi.Helpers;
using static System.FormattableString;

namespace Turn10.LiveOps.StewardApi.Filters
{
    /// <summary>
    ///     Applies tag information to system generated logs.
    /// </summary>
    public sealed class LogTagDependencyAttribute : ActionFilterAttribute
    {
        private readonly DependencyLogTags dependencies;
        private readonly IEnumerable<string> labels;

        /// <summary>
        ///     Initializes a new instance of the <see cref="LogTagDependencyAttribute"/> class.
        /// </summary>
        /// <param name="dependencies">The upstream dependencies of this service.</param>
        public LogTagDependencyAttribute(DependencyLogTags dependencies)
        {
            this.dependencies = dependencies;
            this.labels = this.dependencies.FlagsToStrings();
        }

        /// <inheritdoc/>
        public override void OnActionExecuting(ActionExecutingContext context)
        {
            var telemetry = context.HttpContext.Features.Get<RequestTelemetry>();
            foreach (var label in this.labels)
            {
                var name = Invariant($"dep-on-{label.ToDashedSnakeCase()}");
                telemetry.Properties.TryAdd(name, "t");
            }
        }
    }

    [Flags]
    public enum DependencyLogTags {
        Lsp = 1,
        Kusto = 2,
        AuctionHouse = 4,
        UserInventory = 8,
        Ugc = 16,
        Leaderboards = 32,
        BackgroundProcessing = 64,
        Pegasus = 128,
        Cosmos = 256,
    }
}
