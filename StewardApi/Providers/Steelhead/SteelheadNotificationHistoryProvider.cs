using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Turn10.Data.Common;
using Turn10.Data.Kusto;
using Turn10.LiveOps.StewardApi.Common;
using Turn10.LiveOps.StewardApi.Contracts.Data;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Logging;
using Turn10.LiveOps.StewardApi.Providers.Data;

namespace Turn10.LiveOps.StewardApi.Providers.Steelhead
{
    /// <inheritdoc />
    public sealed class SteelheadNotificationHistoryProvider : ISteelheadNotificationHistoryProvider
    {
        private static readonly IList<string> RequiredSettings = new List<string>
        {
            ConfigurationKeyConstants.KustoLoggerDatabase
        };

        private readonly IKustoStreamingLogger kustoStreamingLogger;
        private readonly IKustoProvider kustoProvider;
        private readonly ILoggingService loggingService;
        private readonly string kustoDatabaseName;

        /// <summary>
        ///     Initializes a new instance of the <see cref="SteelheadNotificationHistoryProvider"/> class.
        /// </summary>
        public SteelheadNotificationHistoryProvider(
            IKustoStreamingLogger kustoStreamingLogger,
            IKustoProvider kustoProvider,
            ILoggingService loggingService,
            IConfiguration configuration)
        {
            kustoStreamingLogger.ShouldNotBeNull(nameof(kustoStreamingLogger));
            kustoProvider.ShouldNotBeNull(nameof(kustoProvider));
            loggingService.ShouldNotBeNull(nameof(loggingService));
            configuration.ShouldNotBeNull(nameof(configuration));
            configuration.ShouldContainSettings(RequiredSettings);

            this.kustoStreamingLogger = kustoStreamingLogger;
            this.kustoProvider = kustoProvider;
            this.loggingService = loggingService;
            this.kustoDatabaseName = configuration[ConfigurationKeyConstants.KustoLoggerDatabase];
        }

        /// <inheritdoc />
        public async Task UpdateNotificationHistoryAsync(
            NotificationHistory notificationHistory)
        {
            var kustoColumnMappings = notificationHistory.ToJsonColumnMappings();
            var tableName = nameof(NotificationHistory);
            var notificationHistories = new List<NotificationHistory> { notificationHistory };

            try
            {
                await this.kustoStreamingLogger.IngestFromStreamAsync(
                    notificationHistories,
                    this.kustoDatabaseName,
                    tableName,
                    kustoColumnMappings).ConfigureAwait(false);
            }
            catch
            {
                this.loggingService.LogException(new LoggingFailedAppInsightsException(
                    $"Failed to upload log for notification with ID: {notificationHistory.Id} and action: {notificationHistory.Action}"));
            }
        }

        /// <inheritdoc />
        public async Task<IList<NotificationHistory>> GetNotificationHistoriesAsync(string notificationId, string title, string endpoint)
        {
            notificationId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(notificationId));
            title.ShouldNotBeNullEmptyOrWhiteSpace(nameof(title));
            endpoint.ShouldNotBeNullEmptyOrWhiteSpace(nameof(endpoint));

            var notificationHistoryResult = await this.kustoProvider.GetNotificationHistoryAsync(notificationId, title, endpoint)
                .ConfigureAwait(false);
            var results = notificationHistoryResult.ToList();

            return results;
        }
    }
}
