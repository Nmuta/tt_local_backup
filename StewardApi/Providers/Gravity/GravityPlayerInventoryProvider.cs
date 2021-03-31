﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Forza.WebServices.FMG.Generated;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Contracts;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Contracts.Gravity;

namespace Turn10.LiveOps.StewardApi.Providers.Gravity
{
    /// <inheritdoc />
    public sealed class GravityPlayerInventoryProvider : IGravityPlayerInventoryProvider
    {
        private const string Title = "Gravity";
        private const int MaxLookupResults = 5;
        private const int HardCurrencyLimit = 15000;
        private const int AgentSoftCurrencyLimit = 500_000_000;
        private const int AdminSoftCurrencyLimit = 999_999_999;
        private const int HardCurrencyId = 1;
        private const int SoftCurrencyId = 0;

        private readonly IGravityUserService gravityUserService;
        private readonly IGravityUserInventoryService gravityUserInventoryService;
        private readonly IMapper mapper;
        private readonly IGravityGiftHistoryProvider giftHistoryProvider;

        /// <summary>
        ///     Initializes a new instance of the <see cref="GravityPlayerInventoryProvider"/> class.
        /// </summary>
        public GravityPlayerInventoryProvider(
            IGravityUserService gravityUserService,
            IGravityUserInventoryService gravityUserInventoryService,
            IMapper mapper,
            IGravityGiftHistoryProvider giftHistoryProvider)
        {
            gravityUserService.ShouldNotBeNull(nameof(gravityUserService));
            gravityUserInventoryService.ShouldNotBeNull(nameof(gravityUserInventoryService));
            mapper.ShouldNotBeNull(nameof(mapper));
            giftHistoryProvider.ShouldNotBeNull(nameof(giftHistoryProvider));

            this.gravityUserService = gravityUserService;
            this.gravityUserInventoryService = gravityUserInventoryService;
            this.mapper = mapper;
            this.giftHistoryProvider = giftHistoryProvider;
        }

        /// <inheritdoc />
        public async Task<GravityPlayerInventoryBeta> GetPlayerInventoryAsync(ulong xuid)
        {
            try
            {
                var identity = await this.gravityUserService.LiveOpsGetUserDetailsByXuidAsync(xuid, MaxLookupResults).ConfigureAwait(false);
                var profile = identity.userDetails.OrderByDescending(e => e.LastLogin).FirstOrDefault();

                var response = await this.gravityUserInventoryService.LiveOpsGetUserInventoryByT10IdAsync(profile.Turn10Id).ConfigureAwait(false);

                return this.mapper.Map<GravityPlayerInventoryBeta>(response.userInventory);
            }
            catch (Exception ex)
            {
                throw new NotFoundStewardException($"No inventory found for XUID: {xuid}.", ex);
            }
        }

        /// <inheritdoc />
        public async Task<GravityPlayerInventoryBeta> GetPlayerInventoryAsync(string t10Id)
        {
            t10Id.ShouldNotBeNullEmptyOrWhiteSpace(nameof(t10Id));

            try
            {
                var response = await this.gravityUserInventoryService.LiveOpsGetUserInventoryByT10IdAsync(t10Id)
                    .ConfigureAwait(false);

                return this.mapper.Map<GravityPlayerInventoryBeta>(response.userInventory);
            }
            catch (Exception ex)
            {
                throw new NotFoundStewardException($"No inventory found for Turn 10 ID: {t10Id}.", ex);
            }
        }

        /// <inheritdoc />
        public async Task<GravityPlayerInventoryBeta> GetPlayerInventoryAsync(ulong xuid, string profileId)
        {
            profileId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(profileId));

            try
            {
                var identity = await this.gravityUserService.LiveOpsGetUserDetailsByXuidAsync(xuid, MaxLookupResults).ConfigureAwait(false);
                var profile = identity.userDetails.OrderByDescending(e => e.LastLogin).FirstOrDefault();

                var response = await this.gravityUserInventoryService.LiveOpsGetInventoryByProfileIdAsync(profile.Turn10Id, profileId).ConfigureAwait(false);

                return this.mapper.Map<GravityPlayerInventoryBeta>(response.userInventory);
            }
            catch (Exception ex)
            {
                throw new NotFoundStewardException($"No inventory found for XUID: {xuid} and Profile ID: {profileId}.", ex);
            }
        }

        /// <inheritdoc />
        public async Task<GravityPlayerInventoryBeta> GetPlayerInventoryAsync(string t10Id, string profileId)
        {
            t10Id.ShouldNotBeNullEmptyOrWhiteSpace(nameof(t10Id));
            profileId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(profileId));

            try
            {
                var response = await this.gravityUserInventoryService.LiveOpsGetInventoryByProfileIdAsync(t10Id, profileId)
                    .ConfigureAwait(false);

                return this.mapper.Map<GravityPlayerInventoryBeta>(response.userInventory);
            }
            catch (Exception ex)
            {
                throw new NotFoundStewardException($"No inventory found for Turn 10 ID: {t10Id} and Profile ID: {profileId}.", ex);
            }
        }

        /// <inheritdoc />
        public async Task<GiftResponse<string>> UpdatePlayerInventoryAsync(string t10Id, Guid gameSettingsId, GravityGift gift, string requestingAgent, bool useAdminCurrencyLimit)
        {
            t10Id.ShouldNotBeNullEmptyOrWhiteSpace(nameof(t10Id));
            gift.ShouldNotBeNull(nameof(gift));
            gift.Inventory.ShouldNotBeNull(nameof(gift.Inventory));
            requestingAgent.ShouldNotBeNullEmptyOrWhiteSpace(nameof(requestingAgent));

            var giftResponse = new GiftResponse<string>();
            giftResponse.PlayerOrLspGroup = t10Id;
            giftResponse.IdentityAntecedent = GiftIdentityAntecedent.T10Id;

            var hardCurrency = gift.Inventory.CreditRewards.Where(x => x.Id == HardCurrencyId).FirstOrDefault();
            if (hardCurrency != null)
            {
                hardCurrency.Quantity = hardCurrency.Quantity > HardCurrencyLimit ? HardCurrencyLimit : hardCurrency.Quantity;
            }

            var softCurrency = gift.Inventory.CreditRewards.Where(x => x.Id == SoftCurrencyId).FirstOrDefault();
            if (softCurrency != null)
            {
                var softCurrencyLimit = useAdminCurrencyLimit ? AdminSoftCurrencyLimit : AgentSoftCurrencyLimit;
                softCurrency.Quantity = softCurrency.Quantity > softCurrencyLimit ? softCurrencyLimit : softCurrency.Quantity;
            }

            try
            {
                await this.UpdatePlayerInventoryHelperAsync(t10Id, gameSettingsId, gift.Inventory.CreditRewards, ForzaUserInventoryItemType.Currency).ConfigureAwait(true);
                await this.UpdatePlayerInventoryHelperAsync(t10Id, gameSettingsId, gift.Inventory.Cars, ForzaUserInventoryItemType.Car).ConfigureAwait(true);
                await this.UpdatePlayerInventoryHelperAsync(t10Id, gameSettingsId, gift.Inventory.EnergyRefills, ForzaUserInventoryItemType.EnergyRefill).ConfigureAwait(true);
                await this.UpdatePlayerInventoryHelperAsync(t10Id, gameSettingsId, gift.Inventory.UpgradeKits, ForzaUserInventoryItemType.UpgradeKit).ConfigureAwait(true);
                await this.UpdatePlayerInventoryHelperAsync(t10Id, gameSettingsId, gift.Inventory.MasteryKits, ForzaUserInventoryItemType.MasteryKit).ConfigureAwait(true);
                await this.UpdatePlayerInventoryHelperAsync(t10Id, gameSettingsId, gift.Inventory.RepairKits, ForzaUserInventoryItemType.RepairKit).ConfigureAwait(true);

                await this.giftHistoryProvider.UpdateGiftHistoryAsync(t10Id, Title, requestingAgent, GiftIdentityAntecedent.T10Id, gift).ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                giftResponse.Error = new StewardError(StewardErrorCode.FailedToSend, $"Failed to send gift to Turn 10 Id: {t10Id}.", ex);
            }

            return giftResponse;
        }

        /// <summary>
        ///     UpdatePlayerInventoryAsync Helper to process each item type in the GravityMasterInventory.
        /// </summary>
        private async Task UpdatePlayerInventoryHelperAsync(string t10Id, Guid gameSettingsId, IList<MasterInventoryItem> items, ForzaUserInventoryItemType itemType)
        {
            foreach (var item in items ?? Enumerable.Empty<MasterInventoryItem>())
            {
                await this.gravityUserInventoryService.LiveOpsGrantItem(t10Id, gameSettingsId, itemType, item.Id, item.Quantity).ConfigureAwait(true);
            }
        }
    }
}
