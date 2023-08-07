using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Forza.Notifications.FM7.Generated;
using Forza.UserInventory.FM7.Generated;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Contracts.Apollo;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Data;
using Turn10.LiveOps.StewardApi.Contracts.Errors;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Helpers;
using Turn10.LiveOps.StewardApi.Providers.Apollo.ServiceConnections;
using Turn10.LiveOps.StewardApi.Providers.Data;

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
        private readonly INotificationHistoryProvider notificationHistoryProvider;
        private readonly IMapper mapper;

        /// <summary>
        ///     Initializes a new instance of the <see cref="ApolloPlayerInventoryProvider"/> class.
        /// </summary>
        public ApolloPlayerInventoryProvider(
            IApolloService apolloService,
            IApolloGiftHistoryProvider giftHistoryProvider,
            INotificationHistoryProvider notificationHistoryProvider,
            IMapper mapper)
        {
            apolloService.ShouldNotBeNull(nameof(apolloService));
            giftHistoryProvider.ShouldNotBeNull(nameof(giftHistoryProvider));
            notificationHistoryProvider.ShouldNotBeNull(nameof(notificationHistoryProvider));
            mapper.ShouldNotBeNull(nameof(mapper));

            this.apolloService = apolloService;
            this.giftHistoryProvider = giftHistoryProvider;
            this.notificationHistoryProvider = notificationHistoryProvider;
            this.mapper = mapper;
        }

        /// <inheritdoc/>
        public async Task<ApolloPlayerInventory> GetPlayerInventoryAsync(ulong xuid, string endpoint)
        {
            endpoint.ShouldNotBeNull(nameof(endpoint));

            Forza.WebServices.FM7.Generated.UserInventoryService.GetAdminUserInventoryOutput response = null;

            try
            {
                response = await this.apolloService.GetAdminUserInventoryAsync(xuid, endpoint)
                    .ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                throw new NotFoundStewardException($"No inventory found for XUID: {xuid}.", ex);
            }

            return this.mapper.SafeMap<ApolloPlayerInventory>(response.summary);
        }

        /// <inheritdoc/>
        public async Task<ApolloPlayerInventory> GetPlayerInventoryAsync(int profileId, string endpoint)
        {
            endpoint.ShouldNotBeNull(nameof(endpoint));

            Forza.WebServices.FM7.Generated.UserInventoryService.GetAdminUserInventoryByProfileIdOutput response = null;

            try
            {
                response = await this.apolloService.GetAdminUserInventoryByProfileIdAsync(profileId, endpoint)
                     .ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                throw new NotFoundStewardException($"No inventory found for Profile ID: {profileId}.", ex);
            }

            return this.mapper.SafeMap<ApolloPlayerInventory>(response.summary);
        }

        /// <inheritdoc/>
        public async Task<IList<ApolloInventoryProfile>> GetInventoryProfilesAsync(ulong xuid, string endpoint)
        {
            endpoint.ShouldNotBeNull(nameof(endpoint));

            Forza.WebServices.FM7.Generated.UserInventoryService.GetAdminUserProfilesOutput response = null;

            try
            {
                response = await this.apolloService.GetAdminUserProfilesAsync(xuid, MaxProfileResults, endpoint)
                    .ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                throw new NotFoundStewardException($"No inventory profiles found for XUID: {xuid}", ex);
            }

            return this.mapper.SafeMap<IList<ApolloInventoryProfile>>(response.profiles);
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

            var giftResponse = new GiftResponse<ulong>()
            {
                TargetXuid = xuid,
                PlayerOrLspGroup = xuid,
                IdentityAntecedent = GiftIdentityAntecedent.Xuid,
            };

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

                giftResponse.Errors = await this.SendGiftsAsync(ServiceCall, inventoryGifts, currencyGifts).ConfigureAwait(false);

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
            var gift = this.mapper.SafeMap<ApolloGift>(groupGift);
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

            var giftResponse = new GiftResponse<int>
            {
                TargetLspGroupId = groupId,
                PlayerOrLspGroup = groupId,
                IdentityAntecedent = GiftIdentityAntecedent.LspGroupId,
            };

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

                giftResponse.Errors = await this.SendGiftsAsync(ServiceCall, inventoryGifts, currencyGifts).ConfigureAwait(false);

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

        /// <inheritdoc/>
        public async Task<IList<GiftResponse<ulong>>> SendCarLiveryAsync(GroupGift groupGift, ApolloUgcItem livery, string requesterObjectId, string endpoint)
        {
            requesterObjectId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(requesterObjectId));

            var result = await this.apolloService.SendCarLiveryAsync(groupGift.Xuids.ToArray(), livery.Id, endpoint).ConfigureAwait(false);

            var giftResponses = this.mapper.SafeMap<IList<GiftResponse<ulong>>>(result.giftResult);
            var notificationBatchId = Guid.NewGuid();
            foreach (var giftResponse in giftResponses)
            {
                // Do not log if the gift failed to send to the player.
                if (giftResponse.Errors.Count > 0)
                {
                    continue;
                }

                try
                {
                    var createdDate = DateTime.UtcNow;
                    var notificationHistory = new NotificationHistory
                    {
                        Id = string.Empty, // No notification ids yet for individual player gifting
                        Title = TitleConstants.ApolloCodeName,
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
                        Metadata = $"{livery.Id}|{livery.CarId}|{livery.Title}",
                    };

                    await this.notificationHistoryProvider.UpdateNotificationHistoryAsync(
                        notificationHistory).ConfigureAwait(false);
                }
                catch (Exception ex)
                {
                    giftResponse.Errors.Add(new FailedToSendStewardError("Successfully gifted car livery; Logging of notification event failed.", ex));
                }
            }

            return giftResponses;
        }

        /// <inheritdoc/>
        public async Task<GiftResponse<int>> SendCarLiveryAsync(Gift gift, int groupId, ApolloUgcItem livery, string requesterObjectId, string endpoint)
        {
            requesterObjectId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(requesterObjectId));

            var result = new GiftResponse<int>()
            {
                IdentityAntecedent = GiftIdentityAntecedent.LspGroupId,
                PlayerOrLspGroup = groupId,
                TargetLspGroupId = groupId,
            };

            long? notificationId = null;
            try
            {
                // TODO: Log gift to gift history
                var response = await this.apolloService.SendCarLiveryAsync(groupId, livery.Id, endpoint).ConfigureAwait(false);
                notificationId = response.notificationId;
            }
            catch (Exception ex)
            {
                result.Errors.Add(new ServicesFailureStewardError($"LSP failed to gift livery to user group: {groupId}", ex));
            }

            try
            {
                if (!notificationId.HasValue)
                {
                    throw new UnknownFailureStewardException($"Failed to get notification id from gifted livery. LSP Group: {groupId}. Livery Id: {livery.Id}");
                }

                var createdDate = DateTime.UtcNow;
                var notificationHistory = new NotificationHistory
                {
                    Id = notificationId.ToString(),
                    Title = TitleConstants.ApolloCodeName,
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
                    Metadata = $"{livery.Id}|{livery.CarId}|{livery.Title}",
                };

                await this.notificationHistoryProvider.UpdateNotificationHistoryAsync(
                    notificationHistory).ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                throw new FailedToSendStewardException("Successfully gifted car livery; Logging of notification event failed.", ex);
            }

            return result;
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
                { InventoryItemType.VanityItem, this.EmptyIfNull(giftInventory.VanityItems) },
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
