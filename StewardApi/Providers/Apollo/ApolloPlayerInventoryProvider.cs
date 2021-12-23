using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Forza.UserInventory.FM7.Generated;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Contracts.Apollo;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Errors;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Providers.Apollo.ServiceConnections;

namespace Turn10.LiveOps.StewardApi.Providers.Apollo
{
    /// <inheritdoc/>
    public sealed class ApolloPlayerInventoryProvider : IApolloPlayerInventoryProvider
    {
        private const int MaxProfileResults = 50;
        private const int AgentCreditSendAmount = 500_000_000;
        private const int AdminCreditSendAmount = 999_999_999;

        private readonly IApolloService apolloService;
        private readonly IApolloGiftHistoryProvider giftHistoryProvider;
        private readonly IMapper mapper;

        /// <summary>
        ///     Initializes a new instance of the <see cref="ApolloPlayerInventoryProvider"/> class.
        /// </summary>
        public ApolloPlayerInventoryProvider(
                                             IApolloService apolloService,
                                             IApolloGiftHistoryProvider giftHistoryProvider,
                                             IMapper mapper)
        {
            apolloService.ShouldNotBeNull(nameof(apolloService));
            giftHistoryProvider.ShouldNotBeNull(nameof(giftHistoryProvider));
            mapper.ShouldNotBeNull(nameof(mapper));

            this.apolloService = apolloService;
            this.giftHistoryProvider = giftHistoryProvider;
            this.mapper = mapper;
        }

        /// <inheritdoc/>
        public async Task<ApolloPlayerInventory> GetPlayerInventoryAsync(ulong xuid, string endpoint)
        {
            endpoint.ShouldNotBeNull(nameof(endpoint));

            try
            {
                var response = await this.apolloService.GetAdminUserInventoryAsync(xuid, endpoint)
                    .ConfigureAwait(false);

                return this.mapper.Map<ApolloPlayerInventory>(response.summary);
            }
            catch (Exception ex)
            {
                throw new NotFoundStewardException($"No inventory found for XUID: {xuid}.", ex);
            }
        }

        /// <inheritdoc/>
        public async Task<ApolloPlayerInventory> GetPlayerInventoryAsync(int profileId, string endpoint)
        {
            endpoint.ShouldNotBeNull(nameof(endpoint));

            try
            {
                var response = await this.apolloService.GetAdminUserInventoryByProfileIdAsync(profileId, endpoint)
                    .ConfigureAwait(false);

                return this.mapper.Map<ApolloPlayerInventory>(response.summary);
            }
            catch (Exception ex)
            {
                throw new NotFoundStewardException($"No inventory found for Profile ID: {profileId}.", ex);
            }
        }

        /// <inheritdoc/>
        public async Task<IList<ApolloInventoryProfile>> GetInventoryProfilesAsync(ulong xuid, string endpoint)
        {
            endpoint.ShouldNotBeNull(nameof(endpoint));

            try
            {
                var response = await this.apolloService.GetAdminUserProfilesAsync(xuid, MaxProfileResults, endpoint)
                    .ConfigureAwait(false);

                return this.mapper.Map<IList<ApolloInventoryProfile>>(response.profiles);
            }
            catch (Exception ex)
            {
                throw new NotFoundStewardException($"No inventory profiles found for XUID: {xuid}", ex);
            }
        }

        /// <inheritdoc />
        public async Task<GiftResponse<ulong>> UpdatePlayerInventoryAsync(
            ulong xuid,
            ApolloGift gift,
            string requesterObjectId,
            bool useAdminCreditLimit,
            string endpoint)
        {
            gift.ShouldNotBeNull(nameof(gift));
            gift.Inventory.ShouldNotBeNull(nameof(gift.Inventory));
            requesterObjectId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(requesterObjectId));
            endpoint.ShouldNotBeNull(nameof(endpoint));

            var giftResponse = new GiftResponse<ulong>();
            giftResponse.PlayerOrLspGroup = xuid;
            giftResponse.IdentityAntecedent = GiftIdentityAntecedent.Xuid;

            try
            {
                var inventoryGifts = this.BuildInventoryItems(gift.Inventory);
                var currencyGifts = this.BuildCurrencyItems(gift.Inventory);
                this.SetCurrencySendLimits(currencyGifts, useAdminCreditLimit);

                async Task ServiceCall(InventoryItemType inventoryItemType, int itemId)
                {
                    await this.apolloService.AdminSendItemGiftAsync(
                        xuid,
                        inventoryItemType,
                        itemId,
                        endpoint).ConfigureAwait(false);
                }

                giftResponse.Errors = await this.SendGifts(ServiceCall, inventoryGifts, currencyGifts).ConfigureAwait(false);

                await this.giftHistoryProvider.UpdateGiftHistoryAsync(
                    xuid.ToString(CultureInfo.InvariantCulture),
                    TitleConstants.ApolloCodeName,
                    requesterObjectId,
                    GiftIdentityAntecedent.Xuid,
                    gift,
                    endpoint).ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                giftResponse.Errors.Add(new FailedToSendStewardError($"Failed to send gift to XUID: {xuid}.", ex));
            }

            return giftResponse;
        }

        /// <inheritdoc />
        public async Task<IList<GiftResponse<ulong>>> UpdatePlayerInventoriesAsync(
            ApolloGroupGift groupGift,
            string requesterObjectId,
            bool useAdminCreditLimit,
            string endpoint)
        {
            groupGift.ShouldNotBeNull(nameof(groupGift));
            groupGift.Xuids.ShouldNotBeNull(nameof(groupGift.Xuids));
            groupGift.Inventory.ShouldNotBeNull(nameof(groupGift.Inventory));
            requesterObjectId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(requesterObjectId));
            endpoint.ShouldNotBeNull(nameof(endpoint));

            var response = new List<GiftResponse<ulong>>();
            var gift = this.mapper.Map<ApolloGift>(groupGift);
            foreach (var xuid in groupGift.Xuids)
            {
                response.Add(await this.UpdatePlayerInventoryAsync(
                    xuid,
                    gift,
                    requesterObjectId,
                    useAdminCreditLimit,
                    endpoint).ConfigureAwait(false));
            }

            return response;
        }

        /// <inheritdoc/>
        public async Task<GiftResponse<int>> UpdateGroupInventoriesAsync(
            int groupId,
            ApolloGift gift,
            string requesterObjectId,
            bool useAdminCreditLimit,
            string endpoint)
        {
            gift.ShouldNotBeNull(nameof(gift));
            gift.Inventory.ShouldNotBeNull(nameof(gift.Inventory));
            requesterObjectId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(requesterObjectId));
            groupId.ShouldBeGreaterThanValue(-1, nameof(groupId));
            endpoint.ShouldNotBeNull(nameof(endpoint));

            var giftResponse = new GiftResponse<int>();
            giftResponse.PlayerOrLspGroup = groupId;
            giftResponse.IdentityAntecedent = GiftIdentityAntecedent.LspGroupId;

            try
            {
                var inventoryGifts = this.BuildInventoryItems(gift.Inventory);
                var currencyGifts = this.BuildCurrencyItems(gift.Inventory);
                this.SetCurrencySendLimits(currencyGifts, useAdminCreditLimit);

                async Task ServiceCall(InventoryItemType inventoryItemType, int itemId)
                {
                    await this.apolloService.AdminSendItemGroupGiftAsync(
                        groupId,
                        inventoryItemType,
                        itemId,
                        endpoint).ConfigureAwait(false);
                }

                giftResponse.Errors = await this.SendGifts(ServiceCall, inventoryGifts, currencyGifts).ConfigureAwait(false);

                await this.giftHistoryProvider.UpdateGiftHistoryAsync(
                    groupId.ToString(CultureInfo.InvariantCulture),
                    TitleConstants.ApolloCodeName,
                    requesterObjectId,
                    GiftIdentityAntecedent.LspGroupId,
                    gift,
                    endpoint).ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                giftResponse.Errors.Add(new FailedToSendStewardError($"Failed to send gift to group ID: {groupId}.", ex));
            }

            return giftResponse;
        }

        private async Task<IList<StewardError>> SendGifts(
            Func<InventoryItemType, int, Task> serviceCall,
            IDictionary<InventoryItemType, IList<MasterInventoryItem>> inventoryGifts,
            IDictionary<InventoryItemType, MasterInventoryItem> currencyGifts)
        {
            var errors = new List<StewardError>();
            foreach (var (key, value) in inventoryGifts)
            {
                foreach (var item in value)
                {
                    try
                    {
                        for (var i = 0; i < item.Quantity; i++)
                        {
                            await serviceCall(key, item.Id).ConfigureAwait(false);
                        }
                    }
                    catch
                    {
                        var error = new FailedToSendStewardError($"Failed to send item of type: {key} with ID: {item.Id}");
                        item.Error = error;
                        errors.Add(error);
                    }
                }
            }

            foreach (var (key, value) in currencyGifts)
            {
                if (value == null || value.Quantity <= 0)
                {
                    continue;
                }

                var remainingCurrencyToSend = value.Quantity;
                var failedToSendAmount = 0;

                while (remainingCurrencyToSend > 0)
                {
                    var creditsToSend = remainingCurrencyToSend >= AgentCreditSendAmount
                        ? AgentCreditSendAmount
                        : remainingCurrencyToSend;
                    try
                    {
                        remainingCurrencyToSend -= creditsToSend;
                        await serviceCall(key, creditsToSend).ConfigureAwait(false);
                    }
                    catch
                    {
                        failedToSendAmount += creditsToSend;
                    }
                }

                if (failedToSendAmount > 0)
                {
                    var error = new FailedToSendStewardError($"Failed to send {failedToSendAmount} of type: {key}");
                    value.Error = error;
                    errors.Add(error);
                }
            }

            return errors;
        }

        private IDictionary<InventoryItemType, IList<MasterInventoryItem>> BuildInventoryItems(
            ApolloMasterInventory giftInventory)
        {
            return new Dictionary<InventoryItemType, IList<MasterInventoryItem>>
            {
                { InventoryItemType.Car, this.EmptyIfNull(giftInventory.Cars) },
                { InventoryItemType.VanityItem, this.EmptyIfNull(giftInventory.VanityItems) }
            };
        }

        private IDictionary<InventoryItemType, MasterInventoryItem> BuildCurrencyItems(ApolloMasterInventory giftInventory)
        {
            var credits = giftInventory.CreditRewards.FirstOrDefault(data => { return data.Description == "Credits"; });

            return new Dictionary<InventoryItemType, MasterInventoryItem>
            {
                { InventoryItemType.Credits, credits },
            };
        }

        private void SetCurrencySendLimits(IDictionary<InventoryItemType, MasterInventoryItem> currencyGifts, bool useAdminCreditLimit)
        {
            var creditSendLimit = useAdminCreditLimit ? AdminCreditSendAmount : AgentCreditSendAmount;
            if (currencyGifts[InventoryItemType.Credits] != null)
            {
                currencyGifts[InventoryItemType.Credits].Quantity =
                    Math.Min(currencyGifts[InventoryItemType.Credits].Quantity, creditSendLimit);
            }
        }

        private List<T> EmptyIfNull<T>(IList<T> inputList)
        {
            return (List<T>)inputList ?? new List<T>();
        }
    }
}
