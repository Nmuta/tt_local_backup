using System;
using System.Collections.Generic;
using Microsoft.ApplicationInsights.DataContracts;
using Microsoft.AspNetCore.Mvc.Filters;
using Turn10.LiveOps.StewardApi.Helpers;
using static System.FormattableString;

namespace Turn10.LiveOps.StewardApi.Filters
{
    /// <summary>
    ///     Applies tag information to system generated logs.
    /// </summary>
    public sealed class LogTagTitleAttribute : ActionFilterAttribute
    {
        private readonly TitleLogTags dependencies;
        private readonly IEnumerable<string> labels;

        /// <summary>
        ///     Initializes a new instance of the <see cref="LogTagTitleAttribute"/> class.
        /// </summary>
        /// <param name="dependencies">The upstream dependencies of this service.</param>
        public LogTagTitleAttribute(TitleLogTags dependencies)
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

    /// <summary>
    ///     Title tags for action logging
    /// </summary>
    [Flags]
    public enum TitleLogTags
    {
        TitleAgnostic = 1,
        Opus = 2,
        Apollo = 4,
        Sunrise = 8,
        [Obsolete("Gravity has been deleted.")]
        Gravity = 16,
        Woodstock = 32,
        Steelhead = 64,
        Forte = 128,
    }
}
