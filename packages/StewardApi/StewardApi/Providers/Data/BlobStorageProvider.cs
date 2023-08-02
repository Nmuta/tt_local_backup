using System;
using System.Diagnostics.CodeAnalysis;
using System.Text;
using System.Threading.Tasks;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Azure.Storage.Blobs.Specialized;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
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
        private const string PlayFabSettingsBlobName = "playfab.json";

        private readonly BlobClient toolsBlobClient;
        private readonly BlobClient playFabBlobClient;

        /// <summary>
        ///     Initializes a new instance of the <see cref="BlobStorageProvider"/> class.
        /// </summary>
        [SuppressMessage("Usage", "VSTHRD002:Avoid problematic synchronous waits", Justification = "Constructor")]
        public BlobStorageProvider(KeyVaultConfig keyVaultConfig)
        {
            keyVaultConfig.ShouldNotBeNull(nameof(keyVaultConfig));

            var blobConnectionString = keyVaultConfig.BlobConnectionString;

            var serviceClient = new BlobServiceClient(blobConnectionString);
            var containerClient = serviceClient.GetBlobContainerClient(SettingsContainerName);
            this.toolsBlobClient = containerClient.GetBlobClient(ToolsAvailabilityBlobName);
            this.playFabBlobClient = containerClient.GetBlobClient(PlayFabSettingsBlobName);
        }

        /// <inheritdoc />
        public async Task<ToolsAvailability> GetToolsAvailabilityAsync()
        {
            if (!await this.EnsureBlobClientExistsAsync(this.toolsBlobClient).ConfigureAwait(false))
            {
                throw new UnknownFailureStewardException($"Blob client could not be found. Container name: {SettingsContainerName}. Blob name: {ToolsAvailabilityBlobName}.");
            }

            try
            {
                var response = await this.toolsBlobClient.DownloadAsync().ConfigureAwait(false);
                var download = response.Value;

                return await download.DeserializeAsync<ToolsAvailability>().ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException($"Could not retrieve tools availability JSON from blob storage. Container name: {SettingsContainerName}. Blob name: {ToolsAvailabilityBlobName}.", ex);
            }
        }

        /// <inheritdoc />
        public async Task<ToolsAvailability> SetToolsAvailabilityAsync(ToolsAvailability updatedToolsAvailability)
        {
            if (!await this.EnsureBlobClientExistsAsync(this.toolsBlobClient).ConfigureAwait(false))
            {
                throw new UnknownFailureStewardException($"Blob client could not be found. Container name: {SettingsContainerName}. Blob name: {ToolsAvailabilityBlobName}.");
            }

            try
            {
                var blobLease = this.toolsBlobClient.GetBlobLeaseClient();
                var lease = await blobLease.AcquireAsync(new TimeSpan(TimeSpan.TicksPerSecond * 15)).ConfigureAwait(false);

                var serializedContent = JsonConvert.SerializeObject(updatedToolsAvailability, new JsonSerializerSettings
                {
                    ContractResolver = new CamelCasePropertyNamesContractResolver()
                });

                var dataBytes = Encoding.UTF8.GetBytes(serializedContent);
                await this.toolsBlobClient.UploadAsync(new BinaryData(dataBytes), new BlobUploadOptions()
                {
                    Conditions = new BlobRequestConditions() { LeaseId = lease.Value.LeaseId }
                }).ConfigureAwait(false);

                await blobLease.ReleaseAsync().ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException($"Could not update tools availability JSON in blob storage. Container name: {SettingsContainerName}. Blob name: {ToolsAvailabilityBlobName}.", ex);
            }

            return await this.GetToolsAvailabilityAsync().ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task<StewardPlayFabSettings> GetStewardPlayFabSettingsAsync()
        {
            if (!await this.EnsureBlobClientExistsAsync(this.playFabBlobClient).ConfigureAwait(false))
            {
                throw new UnknownFailureStewardException($"Blob client could not be found. Container name: {SettingsContainerName}. Blob name: {PlayFabSettingsBlobName}.");
            }

            try
            {
                var response = await this.playFabBlobClient.DownloadAsync().ConfigureAwait(false);
                var download = response.Value;

                return await download.DeserializeAsync<StewardPlayFabSettings>().ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException($"Could not retrieve PlayFab settings JSON from blob storage. Container name: {SettingsContainerName}. Blob name: {PlayFabSettingsBlobName}.", ex);
            }
        }

        /// <inheritdoc />
        public async Task<StewardPlayFabSettings> SetStewardPlayFabSettingsAsync(StewardPlayFabSettings updatedPlayFabSettings)
        {
            if (!await this.EnsureBlobClientExistsAsync(this.playFabBlobClient).ConfigureAwait(false))
            {
                throw new UnknownFailureStewardException($"Blob client could not be found. Container name: {SettingsContainerName}. Blob name: {PlayFabSettingsBlobName}.");
            }

            try
            {
                var blobLease = this.playFabBlobClient.GetBlobLeaseClient();
                var lease = await blobLease.AcquireAsync(new TimeSpan(TimeSpan.TicksPerSecond * 15)).ConfigureAwait(false);

                var serializedContent = JsonConvert.SerializeObject(updatedPlayFabSettings, new JsonSerializerSettings
                {
                    ContractResolver = new CamelCasePropertyNamesContractResolver()
                });

                var dataBytes = Encoding.UTF8.GetBytes(serializedContent);
                await this.playFabBlobClient.UploadAsync(new BinaryData(dataBytes), new BlobUploadOptions()
                {
                    Conditions = new BlobRequestConditions() { LeaseId = lease.Value.LeaseId }
                }).ConfigureAwait(false);

                await blobLease.ReleaseAsync().ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException($"Could not update PlayFab settings JSON in blob storage. Container name: {SettingsContainerName}. Blob name: {PlayFabSettingsBlobName}.", ex);
            }

            return await this.GetStewardPlayFabSettingsAsync().ConfigureAwait(false);
        }

        private async Task<bool> EnsureBlobClientExistsAsync(BlobClient blobClient)
        {
            var response = await blobClient.ExistsAsync().ConfigureAwait(false);
            return response.Value;
        }
    }
}
