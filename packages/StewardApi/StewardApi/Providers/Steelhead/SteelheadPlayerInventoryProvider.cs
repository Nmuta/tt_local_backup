using AutoMapper;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Errors;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead;
using Turn10.LiveOps.StewardApi.Helpers;
using Turn10.LiveOps.StewardApi.Providers.Steelhead.ServiceConnections;
// Using this for type safety when sending gifts to LSP.
using InventoryItemType = Forza.UserInventory.FM8.Generated.InventoryItemType;

namespace Turn10.LiveOps.StewardApi.Providers.Steelhead
{
    /// <inheritdoc />
    public class SteelheadPlayerInventoryProvider : ISteelheadPlayerInventoryProvider
    {
        private const int MaxProfileResults = 50;
        private const int AgentCreditSendAmount = 500_000_000;
        private const int AdminCreditSendAmount = 999_999_999;

        private readonly ISteelheadService steelheadService;
        private readonly IMapper mapper;
        private readonly ISteelheadGiftHistoryProvider giftHistoryProvider;

        /// <summary>
        ///     Initializes a new instance of the <see cref="SteelheadPlayerInventoryProvider"/> class.
        /// </summary>
        public SteelheadPlayerInventoryProvider(
            ISteelheadService steelheadService,
            IMapper mapper,
            ISteelheadGiftHistoryProvider giftHistoryProvider)
        {
            steelheadService.ShouldNotBeNull(nameof(steelheadService));
            mapper.ShouldNotBeNull(nameof(mapper));
            giftHistoryProvider.ShouldNotBeNull(nameof(giftHistoryProvider));

            this.steelheadService = steelheadService;
            this.mapper = mapper;
            this.giftHistoryProvider = giftHistoryProvider;
        }

        /// <inheritdoc />
        public async Task<IList<SteelheadInventoryProfile>> GetInventoryProfilesAsync(ulong xuid, string endpoint)
        {
            endpoint.ShouldNotBeNullEmptyOrWhiteSpace(nameof(endpoint));

            Services.LiveOps.FM8.Generated.UserInventoryManagementService.GetAdminUserProfilesOutput response = null;

            try
            {
                response = await this.steelheadService.GetAdminUserProfilesAsync(
                    xuid,
                    MaxProfileResults,
                    endpoint).ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                throw new NotFoundStewardException($"No inventory profiles found for XUID: {xuid}", ex);
            }

            return this.mapper.SafeMap<IList<SteelheadInventoryProfile>>(response.profiles);
        }

        /// <inheritdoc />
        public async Task<GiftResponse<ulong>> UpdatePlayerInventoryAsync(
            ulong xuid,
            SteelheadGift gift,
            string requesterObjectId,
            bool useAdminCreditLimit,
            string endpoint)
        {
            gift.ShouldNotBeNull(nameof(gift));
            gift.Inventory.ShouldNotBeNull(nameof(gift.Inventory));
            requesterObjectId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(requesterObjectId));
            endpoint.ShouldNotBeNullEmptyOrWhiteSpace(nameof(endpoint));

            var giftResponse = new GiftResponse<ulong>
            {
                PlayerOrLspGroup = xuid,
                TargetXuid = xuid,
                IdentityAntecedent = GiftIdentityAntecedent.Xuid
            };

            try
            {
                var inventoryGifts = this.BuildInventoryItems(gift.Inventory);
                var currencyGifts = this.BuildCurrencyItems(gift.Inventory);
                this.SetCurrencySendLimits(currencyGifts, useAdminCreditLimit);

                async Task ServiceCall(InventoryItemType inventoryItemType, int itemId)
                {
                    await this.steelheadService.SendItemGiftV2Async(xuid, inventoryItemType.ToString(), itemId, endpoint)
                        .ConfigureAwait(false);
                }

                giftResponse.Errors = await this.SendGiftsAsync(ServiceCall, inventoryGifts, currencyGifts).ConfigureAwait(false);

                await this.giftHistoryProvider.UpdateGiftHistoryAsync(
                    xuid.ToString(CultureInfo.InvariantCulture),
                    TitleConstants.SteelheadCodeName,
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
            SteelheadGroupGift groupGift,
            string requesterObjectId,
            bool useAdminCreditLimit,
            string endpoint)
        {
            groupGift.ShouldNotBeNull(nameof(groupGift));
            groupGift.Xuids.ShouldNotBeNull(nameof(groupGift.Xuids));
            groupGift.Inventory.ShouldNotBeNull(nameof(groupGift.Inventory));
            requesterObjectId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(requesterObjectId));
            endpoint.ShouldNotBeNullEmptyOrWhiteSpace(nameof(endpoint));

            var response = new List<GiftResponse<ulong>>();
            var gift = this.mapper.SafeMap<SteelheadGift>(groupGift);
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
            SteelheadGift gift,
            string requesterObjectId,
            bool useAdminCreditLimit,
            string endpoint)
        {
            groupId.ShouldBeGreaterThanValue(-1, nameof(groupId));
            gift.ShouldNotBeNull(nameof(gift));
            gift.Inventory.ShouldNotBeNull(nameof(gift.Inventory));
            requesterObjectId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(requesterObjectId));
            endpoint.ShouldNotBeNullEmptyOrWhiteSpace(nameof(endpoint));

            var giftResponse = new GiftResponse<int>
            {
                PlayerOrLspGroup = groupId,
                TargetLspGroupId = groupId,
                IdentityAntecedent = GiftIdentityAntecedent.LspGroupId
            };

            try
            {
                var inventoryGifts = this.BuildInventoryItems(gift.Inventory);
                var currencyGifts = this.BuildCurrencyItems(gift.Inventory);
                this.SetCurrencySendLimits(currencyGifts, useAdminCreditLimit);

                async Task ServiceCall(InventoryItemType inventoryItemType, int itemId)
                {
                    await this.steelheadService.SendItemGroupGiftV2Async(
                        groupId,
                        inventoryItemType.ToString(),
                        itemId,
                        endpoint).ConfigureAwait(false);
                }

                giftResponse.Errors = await this.SendGiftsAsync(ServiceCall, inventoryGifts, currencyGifts).ConfigureAwait(false);

                await this.giftHistoryProvider.UpdateGiftHistoryAsync(
                    groupId.ToString(CultureInfo.InvariantCulture),
                    TitleConstants.SteelheadCodeName,
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

        private async Task<IList<StewardError>> SendGiftsAsync(
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

                var batchLimit = AgentCreditSendAmount;
                var remainingCurrencyToSend = value.Quantity;
                var failedToSendAmount = 0;

                while (remainingCurrencyToSend > 0)
                {
                    var creditsToSend = remainingCurrencyToSend >= batchLimit ? batchLimit : remainingCurrencyToSend;
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
            SteelheadMasterInventory giftInventory)
        {
            return new Dictionary<InventoryItemType, IList<MasterInventoryItem>>
            {
                { InventoryItemType.Car, this.EmptyIfNull(giftInventory.Cars) },
                { InventoryItemType.VanityItem, this.EmptyIfNull(giftInventory.VanityItems) }
            };
        }

        private IDictionary<InventoryItemType, MasterInventoryItem> BuildCurrencyItems(SteelheadMasterInventory giftInventory)
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

            // TODO Discuss Steelhead sending limits after we know what items will be sendable Task(961251)
        }

        private List<T> EmptyIfNull<T>(IList<T> inputList)
        {
            return (List<T>)inputList ?? new List<T>();
        }
    }
}
