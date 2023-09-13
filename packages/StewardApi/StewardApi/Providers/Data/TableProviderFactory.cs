using System;
using System.Linq;
using System.Text.RegularExpressions;
using Microsoft.WindowsAzure.Storage.RetryPolicies;
using Microsoft.WindowsAzure.Storage.Table;
using Turn10.Services.Diagnostics;
using Turn10.Services.Storage.Table;

#pragma warning disable CS1591 // Missing XML comment for publicly visible type or member
#pragma warning disable SA1300 // Element should begin with upper-case letter
#pragma warning disable SA1600 // Elements should be documented

namespace Turn10.LiveOps.StewardApi.Providers.Data
{
    /// <summary>
    ///     Factory for creating Azure Table Providers
    /// </summary>
    public class TableProviderFactory
    {
        public TableProviderFactory(string[] connectionStrings, string instanceName, LogManager logManager)
        {
            this.ConnectionStrings = connectionStrings;
            this.InstanceName = instanceName;
            this.LogManager = logManager;
            this.MetricsManager = new Turn10.Services.Diagnostics.MetricsManager(Enumerable.Empty<IMetricsSink>());
            this.TimeoutMilliseconds = 30000;
        }

        public string[] ConnectionStrings { get; private set; }

        public string InstanceName { get; private set; }

        public LogManager LogManager { get; private set; }

        public MetricsManager MetricsManager { get; private set; }

        public int TimeoutMilliseconds { get; private set; }

        /// <summary>
        ///     Retireves AzureTableProvider
        /// </summary>
        public IAzureTableProvider GetAzureTableProvider()
        {
            IAzureTableProvider[] tableProviders = new AzureTableProvider[this.ConnectionStrings.Length];
            for (int i = 0; i < this.ConnectionStrings.Length; i++)
            {
                tableProviders[i] = new AzureTableProvider(
                    this.ConnectionStrings[i],
                    this.GetTableName(),
                    this.MetricsManager,
                    new TableRequestOptions()
                    {
                        MaximumExecutionTime = TimeSpan.FromMilliseconds(this.TimeoutMilliseconds),
                        ServerTimeout = TimeSpan.FromMilliseconds(this.TimeoutMilliseconds),
                        RetryPolicy = new NoRetry(),
                    });
            }

            return new ShardedAzureTableProvider(tableProviders);
        }

        private string GetTableName()
        {
            Regex invalidTableNameCharacters = new Regex("[^a-zA-Z0-9]");
            if (!string.IsNullOrEmpty(this.InstanceName))
            {
                return invalidTableNameCharacters.Replace(this.InstanceName, string.Empty).ToLowerInvariant();
            }
            else
            {
                return invalidTableNameCharacters.Replace(Environment.MachineName, string.Empty).ToLowerInvariant();
            }
        }
    }
}
