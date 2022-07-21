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
    public sealed class LogTagActionAttribute : ActionFilterAttribute
    {
        private readonly ActionTargetLogTags targets;
        private readonly IEnumerable<string> targetLabels;
        private readonly ActionAreaLogTags areas;
        private readonly IEnumerable<string> areaLabels;

        /// <summary>
        ///     Initializes a new instance of the <see cref="LogTagActionAttribute"/> class.
        /// </summary>
        /// <param name="targets">The targets of this request.</param>
        /// <param name="areas">The impacted areas of this request.</param>
        public LogTagActionAttribute(ActionTargetLogTags targets, ActionAreaLogTags areas)
        {
            this.targets = targets;
            this.targetLabels = this.targets.FlagsToStrings();
            this.areas = areas;
            this.areaLabels = this.targets.FlagsToStrings();
        }

        /// <inheritdoc/>
        public override void OnActionExecuting(ActionExecutingContext context)
        {
            var telemetry = context.HttpContext.Features.Get<RequestTelemetry>();
            foreach (var label in this.targetLabels)
            {
                var name = Invariant($"action-target-{label.ToDashedSnakeCase()}");
                telemetry.Properties.TryAdd(name, "t");
            }

            foreach (var label in this.areaLabels)
            {
                var name = Invariant($"action-area-{label.ToDashedSnakeCase()}");
                telemetry.Properties.TryAdd(name, "t");
            }
        }
    }

    [Flags]
    public enum ActionTargetLogTags
    {
        System = 1,
        Player = 2,
        Group = 4,
        Console = 8,
    }

    [Flags]
    public enum ActionAreaLogTags {
        Create = 1,
        Lookup = 2,
        Update = 4,
        Delete = 16,
        Action = 32,
        Auctions = 64,
        Ugc = 128,
        Banning = 256,
        Inventory = 512,
        Gifting = 1024,
        Group = 2048,
        Meta = 4096,
        Notification = 8192,
        Leaderboards = 16384,
    }
}
