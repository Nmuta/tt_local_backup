using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Forza.UserInventory.Steelhead_master.Generated;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead;
using Turn10.LiveOps.StewardApi.Providers.Steelhead.ServiceConnections;

namespace Turn10.LiveOps.StewardApi.Providers.Steelhead
{
    /// <inheritdoc />
    public class SteelheadPlayerInventoryProvider : ISteelheadPlayerInventoryProvider
    {
        private const string Title = "Steelhead";
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
        public async Task<SteelheadPlayerInventory> GetPlayerInventoryAsync(ulong xuid)
        {
            xuid.ShouldNotBeNull(nameof(xuid));

            try
            {
                var response = await this.steelheadService.GetAdminUserInventoryAsync(xuid)
                    .ConfigureAwait(false);
                var playerInventoryDetails = this.mapper.Map<SteelheadPlayerInventory>(response.summary);

                return playerInventoryDetails;
            }
            catch (Exception ex)
            {
                throw new NotFoundStewardException($"No player found for XUID: {xuid}.", ex);
            }
        }

        /// <inheritdoc />
        public async Task<SteelheadPlayerInventory> GetPlayerInventoryAsync(int profileId)
        {
            try
            {
                var response = await this.steelheadService.GetAdminUserInventoryByProfileIdAsync(profileId)
                    .ConfigureAwait(false);
                var inventoryProfile = this.mapper.Map<SteelheadPlayerInventory>(response.summary);

                return inventoryProfile;
            }
            catch (Exception ex)
            {
                throw new NotFoundStewardException($"No inventory found for Profile ID: {profileId}.", ex);
            }
        }

        /// <inheritdoc />
        public async Task<IList<SteelheadInventoryProfile>> GetInventoryProfilesAsync(ulong xuid)
        {
            xuid.ShouldNotBeNull(nameof(xuid));

            try
            {
                var response = await this.steelheadService.GetAdminUserProfilesAsync(xuid, MaxProfileResults).ConfigureAwait(false);

                return this.mapper.Map<IList<SteelheadInventoryProfile>>(response.profiles);
            }
            catch (Exception ex)
            {
                throw new NotFoundStewardException($"No inventory profiles found for XUID: {xuid}", ex);
            }
        }

        /// <inheritdoc />
        public async Task<GiftResponse<ulong>> UpdatePlayerInventoryAsync(ulong xuid, SteelheadGift gift, string requesterObjectId, bool useAdminCreditLimit)
        {
            gift.ShouldNotBeNull(nameof(gift));
            gift.Inventory.ShouldNotBeNull(nameof(gift.Inventory));
            requesterObjectId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(requesterObjectId));

            var giftResponse = new GiftResponse<ulong>
            {
                PlayerOrLspGroup = xuid,
                IdentityAntecedent = GiftIdentityAntecedent.Xuid
            };

            try
            {
                var inventoryGifts = this.BuildInventoryItems(gift.Inventory);
                var currencyGifts = this.BuildCurrencyItems(gift.Inventory);

                var creditSendLimit = useAdminCreditLimit ? AdminCreditSendAmount : AgentCreditSendAmount;
                currencyGifts[InventoryItemType.Credits] = Math.Min(currencyGifts[InventoryItemType.Credits], creditSendLimit);

                async Task ServiceCall(InventoryItemType inventoryItemType, int itemId)
                {
                    await this.steelheadService.AdminSendItemGiftAsync(xuid, inventoryItemType, itemId).ConfigureAwait(false);
                }

                await this.SendGifts(ServiceCall, inventoryGifts, currencyGifts).ConfigureAwait(false);

                await this.giftHistoryProvider.UpdateGiftHistoryAsync(xuid.ToString(CultureInfo.InvariantCulture), Title, requesterObjectId, GiftIdentityAntecedent.Xuid, gift).ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                giftResponse.Error = new StewardError(StewardErrorCode.FailedToSend, $"Failed to send gift to XUID: {xuid}.", ex);
            }

            return giftResponse;
        }

        /// <inheritdoc />
        public async Task<IList<GiftResponse<ulong>>> UpdatePlayerInventoriesAsync(SteelheadGroupGift groupGift, string requesterObjectId, bool useAdminCreditLimit)
        {
            groupGift.ShouldNotBeNull(nameof(groupGift));
            groupGift.Xuids.ShouldNotBeNull(nameof(groupGift.Xuids));
            groupGift.Inventory.ShouldNotBeNull(nameof(groupGift.Inventory));
            requesterObjectId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(requesterObjectId));

            var response = new List<GiftResponse<ulong>>();
            var gift = this.mapper.Map<SteelheadGift>(groupGift);
            foreach (var xuid in groupGift.Xuids)
            {
                response.Add(await this.UpdatePlayerInventoryAsync(xuid, gift, requesterObjectId, useAdminCreditLimit).ConfigureAwait(false));
            }

            return response;
        }

        /// <inheritdoc/>
        public async Task<GiftResponse<int>> UpdateGroupInventoriesAsync(int groupId, SteelheadGift gift, string requesterObjectId, bool useAdminCreditLimit)
        {
            groupId.ShouldBeGreaterThanValue(-1, nameof(groupId));
            gift.ShouldNotBeNull(nameof(gift));
            gift.Inventory.ShouldNotBeNull(nameof(gift.Inventory));
            requesterObjectId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(requesterObjectId));

            var giftResponse = new GiftResponse<int>
            {
                PlayerOrLspGroup = groupId,
                IdentityAntecedent = GiftIdentityAntecedent.LspGroupId
            };

            try
            {
                var inventoryGifts = this.BuildInventoryItems(gift.Inventory);
                var currencyGifts = this.BuildCurrencyItems(gift.Inventory);

                var creditSendLimit = useAdminCreditLimit ? AdminCreditSendAmount : AgentCreditSendAmount;
                currencyGifts[InventoryItemType.Credits] = Math.Min(currencyGifts[InventoryItemType.Credits], creditSendLimit);

                async Task ServiceCall(InventoryItemType inventoryItemType, int itemId)
                {
                    await this.steelheadService.AdminSendItemGroupGiftAsync(groupId, inventoryItemType, itemId).ConfigureAwait(false);
                }

                await this.SendGifts(ServiceCall, inventoryGifts, currencyGifts).ConfigureAwait(false);

                await this.giftHistoryProvider.UpdateGiftHistoryAsync(groupId.ToString(CultureInfo.InvariantCulture), Title, requesterObjectId, GiftIdentityAntecedent.LspGroupId, gift).ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                giftResponse.Error = new StewardError(StewardErrorCode.FailedToSend, $"Failed to send gift to group ID: {groupId}.", ex);
            }

            return giftResponse;
        }

        private async Task SendGifts(Func<InventoryItemType, int, Task> serviceCall, IDictionary<InventoryItemType, IList<MasterInventoryItem>> inventoryGifts, IDictionary<InventoryItemType, int> currencyGifts)
        {
            foreach (var (key, value) in inventoryGifts)
            {
                foreach (var item in value)
                {
                    for (var i = 0; i < item.Quantity; i++)
                    {
                        await serviceCall(key, item.Id).ConfigureAwait(false);
                    }
                }
            }

            foreach (var (key, value) in currencyGifts)
            {
                if (value <= 0)
                {
                    continue;
                }

                var batchLimit = AgentCreditSendAmount;
                var playerCurrency = value;

                while (playerCurrency > 0)
                {
                    var creditsToSend = playerCurrency >= batchLimit ? batchLimit : playerCurrency;
                    await serviceCall(key, creditsToSend).ConfigureAwait(false);

                    playerCurrency -= creditsToSend;
                }
            }
        }

        private IDictionary<InventoryItemType, IList<MasterInventoryItem>> BuildInventoryItems(SteelheadMasterInventory giftInventory)
        {
            return new Dictionary<InventoryItemType, IList<MasterInventoryItem>>
            {
                { InventoryItemType.Car, this.EmptyIfNull(giftInventory.Cars) },
                { InventoryItemType.VanityItem, this.EmptyIfNull(giftInventory.VanityItems) }
            };
        }

        private IDictionary<InventoryItemType, int> BuildCurrencyItems(SteelheadMasterInventory giftInventory)
        {
            var credits = giftInventory.CreditRewards.FirstOrDefault(data => { return data.Description == "Credits"; });

            return new Dictionary<InventoryItemType, int>
            {
                { InventoryItemType.Credits, credits != default(MasterInventoryItem) ? credits.Quantity : 0 },
            };
        }

        private List<T> EmptyIfNull<T>(IList<T> inputList)
        {
            return (List<T>)inputList ?? new List<T>();
        }
    }
}
