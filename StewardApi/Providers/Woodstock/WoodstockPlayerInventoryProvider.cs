using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Forza.Notifications.FH5.Generated;
using Forza.UserInventory.FH5.Generated;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Data;
using Turn10.LiveOps.StewardApi.Contracts.Errors;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Contracts.Woodstock;
using Turn10.LiveOps.StewardApi.Providers.Woodstock.ServiceConnections;

namespace Turn10.LiveOps.StewardApi.Providers.Woodstock
{
    /// <inheritdoc />
    public sealed class WoodstockPlayerInventoryProvider : IWoodstockPlayerInventoryProvider
    {
        private const int MaxProfileResults = 50;
        private const int AgentCreditSendAmount = 500_000_000;
        private const int AdminCreditSendAmount = 999_999_999;

        private readonly IWoodstockService woodstockService;
        private readonly IMapper mapper;
        private readonly IRefreshableCacheStore refreshableCacheStore;
        private readonly IWoodstockGiftHistoryProvider giftHistoryProvider;
        private readonly IWoodstockNotificationHistoryProvider notificationHistoryProvider;

        /// <summary>
        ///     Initializes a new instance of the <see cref="WoodstockPlayerInventoryProvider"/> class.
        /// </summary>
        public WoodstockPlayerInventoryProvider(
            IWoodstockService woodstockService,
            IMapper mapper,
            IRefreshableCacheStore refreshableCacheStore,
            IWoodstockGiftHistoryProvider giftHistoryProvider,
            IWoodstockNotificationHistoryProvider notificationHistoryProvider)
        {
            woodstockService.ShouldNotBeNull(nameof(woodstockService));
            mapper.ShouldNotBeNull(nameof(mapper));
            refreshableCacheStore.ShouldNotBeNull(nameof(refreshableCacheStore));
            giftHistoryProvider.ShouldNotBeNull(nameof(giftHistoryProvider));
            notificationHistoryProvider.ShouldNotBeNull(nameof(notificationHistoryProvider));

            this.woodstockService = woodstockService;
            this.mapper = mapper;
            this.refreshableCacheStore = refreshableCacheStore;
            this.giftHistoryProvider = giftHistoryProvider;
            this.notificationHistoryProvider = notificationHistoryProvider;
        }

        /// <inheritdoc />
        public async Task<WoodstockPlayerInventory> GetPlayerInventoryAsync(ulong xuid, string endpoint)
        {
            endpoint.ShouldNotBeNullEmptyOrWhiteSpace(nameof(endpoint));

            try
            {
                var response = await this.woodstockService.GetAdminUserInventoryAsync(xuid, endpoint)
                    .ConfigureAwait(false);
                var playerInventoryDetails = this.mapper.Map<WoodstockPlayerInventory>(response.summary);

                return playerInventoryDetails;
            }
            catch (Exception ex)
            {
                throw new NotFoundStewardException($"No player found for XUID: {xuid}.", ex);
            }
        }

        /// <inheritdoc />
        public async Task<WoodstockPlayerInventory> GetPlayerInventoryAsync(int profileId, string endpoint)
        {
            endpoint.ShouldNotBeNullEmptyOrWhiteSpace(nameof(endpoint));

            try
            {
                var response = await this.woodstockService.GetAdminUserInventoryByProfileIdAsync(profileId, endpoint)
                    .ConfigureAwait(false);
                var inventoryProfile = this.mapper.Map<WoodstockPlayerInventory>(response.summary);

                return inventoryProfile;
            }
            catch (Exception ex)
            {
                throw new NotFoundStewardException($"No inventory found for Profile ID: {profileId}.", ex);
            }
        }

        /// <inheritdoc />
        public async Task<IList<WoodstockInventoryProfile>> GetInventoryProfilesAsync(ulong xuid, string endpoint)
        {
            endpoint.ShouldNotBeNullEmptyOrWhiteSpace(nameof(endpoint));

            try
            {
                var response = await this.woodstockService.GetAdminUserProfilesAsync(
                    xuid,
                    MaxProfileResults,
                    endpoint).ConfigureAwait(false);

                return this.mapper.Map<IList<WoodstockInventoryProfile>>(response.profiles);
            }
            catch (Exception ex)
            {
                throw new NotFoundStewardException($"No inventory profiles found for XUID: {xuid}", ex);
            }
        }

        /// <inheritdoc />
        public async Task<WoodstockAccountInventory> GetAccountInventoryAsync(ulong xuid, string endpoint)
        {
            endpoint.ShouldNotBeNullEmptyOrWhiteSpace(nameof(endpoint));

            try
            {
                var response = await this.woodstockService.GetTokenBalanceAsync(xuid, endpoint)
                    .ConfigureAwait(false);

                return this.mapper.Map<WoodstockAccountInventory>(response.transactions);
            }
            catch (Exception ex)
            {
                throw new NotFoundStewardException($"No account found for XUID: {xuid}.", ex);
            }
        }

        /// <inheritdoc />
        public async Task<GiftResponse<ulong>> UpdatePlayerInventoryAsync(
            ulong xuid,
            WoodstockGift gift,
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
                IdentityAntecedent = GiftIdentityAntecedent.Xuid
            };

            try
            {
                var inventoryGifts = this.BuildInventoryItems(gift.Inventory);
                var currencyGifts = this.BuildCurrencyItems(gift.Inventory);
                var backstagePasses = gift.Inventory.CreditRewards
                    .FirstOrDefault(data => { return data.Description == "BackstagePasses"; });
                var backstagePassDelta = backstagePasses != default(MasterInventoryItem)
                    ? backstagePasses.Quantity
                    : 0;

                var creditSendLimit = useAdminCreditLimit ? AdminCreditSendAmount : AgentCreditSendAmount;
                currencyGifts[InventoryItemType.Credits] =
                    Math.Min(currencyGifts[InventoryItemType.Credits], creditSendLimit);

                async Task ServiceCall(InventoryItemType inventoryItemType, int itemId)
                {
                    await this.woodstockService.AdminSendItemGiftAsync(xuid, inventoryItemType, itemId, endpoint)
                        .ConfigureAwait(false);
                }

                await this.SendGifts(ServiceCall, inventoryGifts, currencyGifts).ConfigureAwait(false);
                await this.UpdateBackstagePasses(xuid, backstagePassDelta, endpoint).ConfigureAwait(false);

                await this.giftHistoryProvider.UpdateGiftHistoryAsync(
                    xuid.ToString(CultureInfo.InvariantCulture),
                    TitleConstants.WoodstockCodeName,
                    requesterObjectId,
                    GiftIdentityAntecedent.Xuid,
                    gift,
                    endpoint).ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                giftResponse.Error = new FailedToSendStewardError($"Failed to send gift to XUID: {xuid}.", ex);
            }

            return giftResponse;
        }

        /// <inheritdoc />
        public async Task<IList<GiftResponse<ulong>>> UpdatePlayerInventoriesAsync(
            WoodstockGroupGift groupGift,
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
            var gift = this.mapper.Map<WoodstockGift>(groupGift);
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
            WoodstockGift gift,
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
                IdentityAntecedent = GiftIdentityAntecedent.LspGroupId
            };

            try
            {
                var inventoryGifts = this.BuildInventoryItems(gift.Inventory);
                var currencyGifts = this.BuildCurrencyItems(gift.Inventory);

                var creditSendLimit = useAdminCreditLimit ? AdminCreditSendAmount : AgentCreditSendAmount;
                currencyGifts[InventoryItemType.Credits] =
                    Math.Min(currencyGifts[InventoryItemType.Credits], creditSendLimit);

                async Task ServiceCall(InventoryItemType inventoryItemType, int itemId)
                {
                    await this.woodstockService.AdminSendItemGroupGiftAsync(
                        groupId,
                        inventoryItemType,
                        itemId,
                        endpoint).ConfigureAwait(false);
                }

                await this.SendGifts(ServiceCall, inventoryGifts, currencyGifts).ConfigureAwait(false);

                await this.giftHistoryProvider.UpdateGiftHistoryAsync(
                    groupId.ToString(CultureInfo.InvariantCulture),
                    TitleConstants.WoodstockCodeName,
                    requesterObjectId,
                    GiftIdentityAntecedent.LspGroupId,
                    gift,
                    endpoint).ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                giftResponse.Error = new FailedToSendStewardError(
                    $"Failed to send gift to group ID: {groupId}.",
                    ex);
            }

            return giftResponse;
        }

        /// <inheritdoc/>
        public async Task<IList<GiftResponse<ulong>>> SendCarLiveryAsync(GroupGift groupGift, UgcItem livery, string requesterObjectId, string endpoint)
        {
            requesterObjectId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(requesterObjectId));
            endpoint.ShouldNotBeNullEmptyOrWhiteSpace(nameof(endpoint));

            // TODO: Log gift to gift history
            var xuids = groupGift.Xuids.ToArray();
            var result = await this.woodstockService.SendCarLiveryAsync(xuids, livery.GuidId, endpoint).ConfigureAwait(false);

            var giftResponses = this.mapper.Map<IList<GiftResponse<ulong>>>(result.giftResult);
            var notificationBatchId = Guid.NewGuid();
            foreach (var giftResponse in giftResponses)
            {
                // Do not log if the gift failed to send to the player.
                if (giftResponse.Error != null)
                {
                    continue;
                }

                try
                {
                    var createdDate = DateTime.UtcNow;
                    var notificationHistory = new NotificationHistory
                    {
                        Id = string.Empty, // No notification ids yet for individual player gifting
                        Title = TitleConstants.WoodstockCodeName,
                        RequesterObjectId = requesterObjectId,
                        RecipientId = giftResponse.PlayerOrLspGroup.ToString(CultureInfo.InvariantCulture),
                        Type = Enum.GetName(typeof(NotificationType), NotificationType.GiftingReceiveCar),
                        RecipientType = GiftIdentityAntecedent.Xuid.ToString(),
                        GiftType = GiftType.CarLivery.ToString(),
                        DeviceType = DeviceType.All.ToString(),
                        BatchReferenceId = notificationBatchId.ToString(),
                        Action = NotificationAction.Send.ToString(),
                        Endpoint = endpoint,
                        CreatedDateUtc = DateTime.UtcNow,
                        ExpireDateUtc = createdDate.AddYears(10),
                        Metadata = $"{livery.GuidId}|{livery.CarId}|{livery.Title}",
                    };

                    await this.notificationHistoryProvider.UpdateNotificationHistoryAsync(
                        notificationHistory).ConfigureAwait(false);
                }
                catch (Exception ex)
                {
                    giftResponse.Error = new FailedToSendStewardError("Successfully gifted car livery; Logging of notification event failed.", ex);
                }
            }

            return giftResponses;
        }

        /// <inheritdoc/>
        public async Task<GiftResponse<int>> SendCarLiveryAsync(Gift gift, int groupId, UgcItem livery, string requesterObjectId, string endpoint)
        {
            requesterObjectId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(requesterObjectId));
            endpoint.ShouldNotBeNullEmptyOrWhiteSpace(nameof(endpoint));

            // TODO: Log gift to gift history
            var result = new GiftResponse<int>()
            {
                IdentityAntecedent = GiftIdentityAntecedent.LspGroupId,
                PlayerOrLspGroup = groupId,
            };

            Guid? notificationId = null;
            try
            {
                // TODO: Log gift to gift history
                var response = await this.woodstockService.SendCarLiveryAsync(groupId, livery.GuidId, endpoint).ConfigureAwait(false);
                notificationId = response.notificationId;
            }
            catch (Exception ex)
            {
                result.Error = new ServicesFailureStewardError($"LSP failed to gift livery to user group: {groupId}", ex);
            }

            try
            {
                if (!notificationId.HasValue)
                {
                    throw new UnknownFailureStewardException($"Failed to get notification id from gifted livery. LSP Group: {groupId}. Livery Id: {livery.GuidId}");
                }

                var createdDate = DateTime.UtcNow;
                var notificationHistory = new NotificationHistory
                {
                    Id = notificationId.ToString(),
                    Title = TitleConstants.WoodstockCodeName,
                    RequesterObjectId = requesterObjectId,
                    RecipientId = groupId.ToString(CultureInfo.InvariantCulture),
                    Type = Enum.GetName(typeof(NotificationType), NotificationType.GiftingReceiveCar),
                    RecipientType = GiftIdentityAntecedent.LspGroupId.ToString(),
                    GiftType = GiftType.CarLivery.ToString(),
                    BatchReferenceId = string.Empty,
                    DeviceType = DeviceType.All.ToString(),
                    Action = NotificationAction.Send.ToString(),
                    Endpoint = endpoint,
                    CreatedDateUtc = DateTime.UtcNow,
                    ExpireDateUtc = createdDate.AddYears(10),
                    Metadata = $"{livery.GuidId}|{livery.CarId}|{livery.Title}"
                };

                await this.notificationHistoryProvider.UpdateNotificationHistoryAsync(
                    notificationHistory).ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                throw new FailedToSendStewardException("Message successfully edited; Logging of edit event failed.", ex);
            }

            return result;
        }

        private async Task SendGifts(
            Func<InventoryItemType, int, Task> serviceCall,
            IDictionary<InventoryItemType, IList<MasterInventoryItem>> inventoryGifts,
            IDictionary<InventoryItemType, int> currencyGifts)
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

        private async Task UpdateBackstagePasses(ulong xuid, int balanceDelta, string endpoint)
        {
            if (balanceDelta <= 0)
            {
                return;
            }

            var status = await this.woodstockService.GetTokenBalanceAsync(xuid, endpoint).ConfigureAwait(false);
            var currentBalance = status.transactions.OfflineBalance;
            var newBalance = (uint)Math.Max(0, currentBalance + balanceDelta);

            await this.woodstockService.SetTokenBalanceAsync(xuid, newBalance, endpoint).ConfigureAwait(false);

            this.refreshableCacheStore.ClearItem(WoodstockCacheKey.MakeBackstagePassKey(endpoint, xuid));
        }

        private IDictionary<InventoryItemType, IList<MasterInventoryItem>> BuildInventoryItems(
            WoodstockMasterInventory giftInventory)
        {
            return new Dictionary<InventoryItemType, IList<MasterInventoryItem>>
            {
                { InventoryItemType.Car, this.EmptyIfNull(giftInventory.Cars) },
                { InventoryItemType.CarHorns, this.EmptyIfNull(giftInventory.CarHorns) },
                { InventoryItemType.Emote, this.EmptyIfNull(giftInventory.Emotes) },
                { InventoryItemType.QuickChatLines, this.EmptyIfNull(giftInventory.QuickChatLines) },
                { InventoryItemType.VanityItem, this.EmptyIfNull(giftInventory.VanityItems) }
            };
        }

        private IDictionary<InventoryItemType, int> BuildCurrencyItems(WoodstockMasterInventory giftInventory)
        {
            var credits = giftInventory.CreditRewards.FirstOrDefault(
                data => { return data.Description == "Credits"; });
            var forzathonPoints = giftInventory.CreditRewards.FirstOrDefault(
                data => { return data.Description == "ForzathonPoints"; });
            var skillPoints = giftInventory.CreditRewards.FirstOrDefault(
                data => { return data.Description == "SkillPoints"; });
            var wheelSpins = giftInventory.CreditRewards.FirstOrDefault(
                data => { return data.Description == "WheelSpins"; });
            var superWheelSpins = giftInventory.CreditRewards.FirstOrDefault(
                data => { return data.Description == "SuperWheelSpins"; });

            return new Dictionary<InventoryItemType, int>
            {
                {
                    InventoryItemType.Credits, credits != default(MasterInventoryItem)
                        ? credits.Quantity : 0
                },
                {
                    InventoryItemType.ForzathonPoints, forzathonPoints != default(MasterInventoryItem)
                        ? forzathonPoints.Quantity : 0
                },
                {
                    InventoryItemType.SkillPoints, skillPoints != default(MasterInventoryItem)
                        ? skillPoints.Quantity : 0
                },
                {
                    InventoryItemType.WheelSpins, wheelSpins != default(MasterInventoryItem)
                        ? wheelSpins.Quantity : 0
                },
                {
                    InventoryItemType.SuperWheelSpins, superWheelSpins != default(MasterInventoryItem)
                        ? superWheelSpins.Quantity : 0
                },
            };
        }

        private List<T> EmptyIfNull<T>(IList<T> inputList)
        {
            return (List<T>)inputList ?? new List<T>();
        }
    }
}
