﻿using System;
using System.Diagnostics.CodeAnalysis;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using Azure.Storage;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Azure.Storage.Blobs.Specialized;
using Azure.Storage.Sas;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using Turn10.Data.Common;
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

        private const string LeaderboardContainerName = "leaderboards";

        private readonly BlobClient toolsBlobClient;
        private readonly BlobClient playFabBlobClient;
        private readonly BlobContainerClient leaderboardsContainerClient;

        /// <summary>
        ///     Initializes a new instance of the <see cref="BlobStorageProvider"/> class.
        /// </summary>
        [SuppressMessage("Usage", "VSTHRD002:Avoid problematic synchronous waits", Justification = "Constructor")]
        public BlobStorageProvider(KeyVaultConfig keyVaultConfig)
        {
            keyVaultConfig.ShouldNotBeNull(nameof(keyVaultConfig));

            var blobConnectionString = keyVaultConfig.BlobConnectionString;

            var serviceClient = new BlobServiceClient(blobConnectionString);

            var settingsContainerClient = serviceClient.GetBlobContainerClient(SettingsContainerName);
            this.toolsBlobClient = settingsContainerClient.GetBlobClient(ToolsAvailabilityBlobName);
            this.playFabBlobClient = settingsContainerClient.GetBlobClient(PlayFabSettingsBlobName);

            this.leaderboardsContainerClient = serviceClient.GetBlobContainerClient(LeaderboardContainerName);
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
                    ContractResolver = new CamelCasePropertyNamesContractResolver(),
                });

                var dataBytes = Encoding.UTF8.GetBytes(serializedContent);
                await this.toolsBlobClient.UploadAsync(new BinaryData(dataBytes), new BlobUploadOptions()
                {
                    Conditions = new BlobRequestConditions() { LeaseId = lease.Value.LeaseId },
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
                    ContractResolver = new CamelCasePropertyNamesContractResolver(),
                });

                var dataBytes = Encoding.UTF8.GetBytes(serializedContent);
                await this.playFabBlobClient.UploadAsync(new BinaryData(dataBytes), new BlobUploadOptions()
                {
                    Conditions = new BlobRequestConditions() { LeaseId = lease.Value.LeaseId },
                }).ConfigureAwait(false);

                await blobLease.ReleaseAsync().ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException($"Could not update PlayFab settings JSON in blob storage. Container name: {SettingsContainerName}. Blob name: {PlayFabSettingsBlobName}.", ex);
            }

            return await this.GetStewardPlayFabSettingsAsync().ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task SetLeaderboardDataAsync(string leaderboardIdentifier, string csv)
        {
            var blobFileName = leaderboardIdentifier + ".csv";
            var leaderboardClient = this.leaderboardsContainerClient.GetBlobClient(blobFileName);

            try
            {
                var dataBytes = Encoding.UTF8.GetBytes(csv);
                await leaderboardClient.UploadAsync(new BinaryData(dataBytes), overwrite: true).ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException($"Could not upload leaderboard scores to blob storage. Container name: {LeaderboardContainerName}. Blob name: {blobFileName}.", ex);
            }

            return;
        }

        /// <inheritdoc />
        public async Task<BlobFileInfo> VerifyLeaderboardScoresFileAsync(string leaderboardIdentifier)
        {
            var blobFileName = leaderboardIdentifier + ".csv";
            var leaderboardClient = this.leaderboardsContainerClient.GetBlobClient(blobFileName);

            var exists = await leaderboardClient.ExistsAsync();
            if (!exists.Value)
            {
                return new BlobFileInfo { LastModifiedUtc = null, Exists = false };
            }

            var metadata = await leaderboardClient.GetPropertiesAsync();

            return new BlobFileInfo { LastModifiedUtc = metadata.Value.LastModified, Exists = true };
        }

        /// <inheritdoc />
        public async Task<Uri> GetLeaderboardDataLinkAsync(string leaderboardIdentifier)
        {
            var blobFileName = leaderboardIdentifier + ".csv";
            var leaderboardClient = this.leaderboardsContainerClient.GetBlobClient(blobFileName);

            var exists = await leaderboardClient.ExistsAsync();
            if (!exists.Value)
            {
                throw new NotFoundStewardException($"Leaderboard score file with name {blobFileName} does not exist.");
            }

            if (leaderboardClient.CanGenerateSasUri)
            {
                // Create a SAS token that's valid for a short time
                var sasBuilder = new BlobSasBuilder()
                {
                    StartsOn = DateTime.UtcNow.AddMinutes(-2),
                    ExpiresOn = DateTime.UtcNow.AddMinutes(2),
                    BlobContainerName = leaderboardClient.GetParentBlobContainerClient().Name,
                    BlobName = leaderboardClient.Name,
                    Resource = "b", // b = blob, c = container
                };

                sasBuilder.SetPermissions(BlobSasPermissions.Read);

                var sasURI = leaderboardClient.GenerateSasUri(sasBuilder);

                return sasURI;
            }
            else
            {
                throw new BadRequestStewardException($"Failed to generate SAS for leaderboard file with identifier {blobFileName}");
            }
        }

        private async Task<bool> EnsureBlobClientExistsAsync(BlobClient blobClient)
        {
            var response = await blobClient.ExistsAsync().ConfigureAwait(false);
            return response.Value;
        }
    }
}
