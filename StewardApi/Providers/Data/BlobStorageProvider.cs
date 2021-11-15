using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Threading.Tasks;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Azure.Storage.Blobs.Specialized;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using Turn10.Data.Azure;
using Turn10.Data.Common;
using Turn10.Data.SecretProvider;
using Turn10.LiveOps.StewardApi.Common;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Helpers;

namespace Turn10.LiveOps.StewardApi.Providers.Data
{
    /// <inheritdoc />
    public sealed class BlobStorageProvider : IBlobStorageProvider
    {
        private const string SettingsContainerName = "settings";
        private const string ToolsAvailabilityBlobName = "tool-availability.json";

        private readonly BlobClient blobClient;

        /// <summary>
        ///     Initializes a new instance of the <see cref="BlobStorageProvider"/> class.
        /// </summary>
        public BlobStorageProvider(IKeyVaultProvider keyVaultProvider, IConfiguration configuration)
        {
            keyVaultProvider.ShouldNotBeNull(nameof(keyVaultProvider));
            configuration.ShouldNotBeNull(nameof(configuration));

            var keyVaultUrl = configuration[ConfigurationKeyConstants.KeyVaultUrl];
            var blobConnectionSecretName = configuration[ConfigurationKeyConstants.BlobConnectionSecretName];
            var blobConnectionString = keyVaultProvider.GetSecretAsync(keyVaultUrl, blobConnectionSecretName).GetAwaiter().GetResult();

            var serviceClient = new BlobServiceClient(blobConnectionString);
            var containerClient = serviceClient.GetBlobContainerClient(SettingsContainerName);
            this.blobClient = containerClient.GetBlobClient(ToolsAvailabilityBlobName);
        }

        /// <inheritdoc />
        public async Task<ToolsAvailability> GetToolsAvailability()
        {
            if (!await this.EnsureBlobClientExists().ConfigureAwait(false))
            {
                throw new UnknownFailureStewardException($"Blob client could not be found. Container name: {SettingsContainerName}. Blob name: {ToolsAvailabilityBlobName}.");
            }

            try
            {
                var response = await this.blobClient.DownloadAsync().ConfigureAwait(false);
                var download = response.Value;

                return await download.Deserialize<ToolsAvailability>().ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException($"Could not retrieve tools availability JSON from blob storage. Container name: {SettingsContainerName}. Blob name: {ToolsAvailabilityBlobName}.", ex);
            }
        }

        /// <inheritdoc />
        public async Task<ToolsAvailability> SetToolsAvailability(ToolsAvailability updatedToolsAvailability)
        {
            if (!await this.EnsureBlobClientExists().ConfigureAwait(false))
            {
                throw new UnknownFailureStewardException($"Blob client could not be found. Container name: {SettingsContainerName}. Blob name: {ToolsAvailabilityBlobName}.");
            }

            try
            {
                var blobLease = this.blobClient.GetBlobLeaseClient();
                var lease = await blobLease.AcquireAsync(new TimeSpan(TimeSpan.TicksPerSecond * 15)).ConfigureAwait(false);

                var serializedContent = JsonConvert.SerializeObject(updatedToolsAvailability, new JsonSerializerSettings
                {
                    ContractResolver = new CamelCasePropertyNamesContractResolver()
                });

                var dataBytes = Encoding.UTF8.GetBytes(serializedContent);
                await this.blobClient.UploadAsync(new BinaryData(dataBytes), new BlobUploadOptions()
                {
                    Conditions = new BlobRequestConditions() { LeaseId = lease.Value.LeaseId }
                }).ConfigureAwait(false);

                await blobLease.ReleaseAsync().ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException($"Could not update tools availability JSON in blob storage. Container name: {SettingsContainerName}. Blob name: {ToolsAvailabilityBlobName}.", ex);
            }

            return await this.GetToolsAvailability().ConfigureAwait(false);
        }

        private async Task<bool> EnsureBlobClientExists()
        {
            var response = await this.blobClient.ExistsAsync().ConfigureAwait(false);
            return response.Value;
        }
    }
}
