using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Turn10.Data.Common;
using Turn10.Data.Kusto;
using Turn10.LiveOps.StewardApi.Common;
using Turn10.LiveOps.StewardApi.Contracts.Data;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Logging;

namespace Turn10.LiveOps.StewardApi.Providers.Data
{
    /// <inheritdoc />
    public sealed class ActionLogger : IActionLogger
    {
        private const string KustoTableName = "ActionTracking";

        private static readonly IList<string> RequiredSettings = new List<string>
        {
            ConfigurationKeyConstants.KustoLoggerDatabase
        };

        private readonly ActionData actionData;
        private readonly ILoggingService loggingService;
        private readonly IKustoStreamingLogger kustoStreamingLogger;
        private readonly string kustoDatabase;

        /// <summary>
        ///     Initializes a new instance of the <see cref="ActionLogger"/> class.
        /// </summary>
        public ActionLogger(
            ActionData actionData,
            ILoggingService loggingService,
            IKustoStreamingLogger kustoStreamingLogger,
            IConfiguration configuration)
        {
            actionData.ShouldNotBeNull(nameof(actionData));
            loggingService.ShouldNotBeNull(nameof(loggingService));
            kustoStreamingLogger.ShouldNotBeNull(nameof(kustoStreamingLogger));
            configuration.ShouldNotBeNull(nameof(configuration));
            configuration.ShouldContainSettings(RequiredSettings);

            this.actionData = actionData;
            this.loggingService = loggingService;
            this.kustoStreamingLogger = kustoStreamingLogger;
            this.kustoDatabase = configuration[ConfigurationKeyConstants.KustoLoggerDatabase];
        }

        /// <inheritdoc />
        public async Task UpdateActionTrackingTableAsync()
        {
            var action = new StewardActionLog
            {
                Id = Guid.NewGuid().ToString(),
                Action = this.actionData.Action.ToString() ?? string.Empty,
                Subject = this.actionData.Subject.ToString() ?? string.Empty,
                RequestPath = this.actionData.RequestPath ?? string.Empty,
                RequesterObjectId = this.actionData.RequesterObjectId ?? string.Empty,
                RequesterRole = this.actionData.RequesterRole ?? string.Empty,
                HttpMethod = this.actionData.HttpMethod ?? string.Empty,
                RouteData = this.actionData.RouteData.ToJson() ?? string.Empty,
                Title = this.actionData.Title ?? string.Empty,
                Endpoint = this.actionData.Endpoint ?? string.Empty,
                CreatedDateUtc = DateTime.UtcNow,
                BatchReferenceId = this.actionData.RequestBatchId.ToString(),
                Metadata = this.actionData.Metadata ?? string.Empty
            };
            var kustoColumnMappings = action.ToJsonColumnMappings();

            try
            {
                await this.kustoStreamingLogger.IngestFromStreamAsync(
                    new List<StewardActionLog> { action },
                    this.kustoDatabase,
                    KustoTableName,
                    kustoColumnMappings).ConfigureAwait(false);
            }
            catch
            {
                this.loggingService.LogException(new LoggingFailedAppInsightsException(
                    $"Action logging has failed for request: {this.actionData.Action}{this.actionData.RequestPath} at {DateTime.UtcNow}."));
            }
        }

        /// <inheritdoc />
        public async Task UpdateActionTrackingTableAsync(RecipientType type, List<string> recipientIds)
        {
            // Coerce enum into camelcase to match values pulled from route data.
            var camelCaseType = char.ToLowerInvariant(type.ToString()[0]) + type.ToString().Substring(1);

            foreach (var id in recipientIds)
            {
                try
                {
                    this.actionData.RouteData[camelCaseType] = id;

                    await this.UpdateActionTrackingTableAsync().ConfigureAwait(false);
                }
                catch
                {
                    this.loggingService.LogException(new LoggingFailedAppInsightsException(
                        $"Action logging has failed for request: {this.actionData.Action}{this.actionData.RequestPath} at {DateTime.UtcNow}."));
                }
            }
        }
    }
}
