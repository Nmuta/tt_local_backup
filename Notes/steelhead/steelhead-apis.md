# Steelhead APIs

## Forza.WebServices.FM8.Generated

<br />

### LiveOpsService

```c#
Task<GetLiveOpsUserDataByXuidOutput> GetLiveOpsUserDataByXuid(ulong xuid) { }

Task<GetLiveOpsUserDataByGamerTagOutput> GetLiveOpsUserDataByGamerTag(string gamertag)  { }

Task<GetCMSRacersCupScheduleOutput> GetCMSRacersCupSchedule(string environment, string slotId, string snapshotId, DateTime startDate, int daysForwardToProject, ForzaEventSessionType[] gameOptionsFilter)  { }

Task<GetCMSRacersCupScheduleForUserOutput> GetCMSRacersCupScheduleForUser(ulong xuid, DateTime startDate, int daysForwardToProject, ForzaEventSessionType[] gameOptionsFilter)  { }

// Don't think we need this. Message sending will be through NotificationManagementService
Task<SendMessageOutput> SendMessage(ulong[] recipients, Guid messageId, DateTime expirationTime, ForzaNotificationType notificationType)  { }

// Don't think we need this. It goes unused in Woodstock and I don't see a scenario for it yet in Steelhead.
Task<LiveOpsUpdateCarDataOutput> LiveOpsUpdateCarData(ulong xuid, ForzaCarUserInventoryItem[] clientCars)  { }
```

<br /><br />

## Turn10.Services.LiveOps.FM8.Generated
<br />

### AuctionManagementService

```c#
Task<SearchAuctionHouseOutput> SearchAuctionHouse(ForzaAuctionFilters auctionFilters) { }

// Need to confirm pre-release cars will be automated in Steelhead as well. If so, we dont need this.
Task AddToAuctionBlocklist(ForzaAuctionBlocklistEntry[] carsToBlock) { }

Task<GetAuctionBlocklistOutput> GetAuctionBlocklist(int maxResult) { }

Task DeleteAuctionBlocklistEntries(int[] carIds) { }

Task<GetAuctionDataOutput> GetAuctionData(Guid auctionId) { }

Task<DeleteAuctionsOutput> DeleteAuctions(Guid[] auctionIds) { }
```

### GiftingManagementService

```c#
Task AdminSendCreditsGift(ulong recipientXuid, uint creditAmount, string reason) {}

Task AdminSendCarGift(ulong recipientXuid, int carId) {}

Task<AdminSendLiveryGiftOutput> AdminSendLiveryGift(ulong[] recipientXuids, int xuidCount, Guid liveryId)  {}

Task<AdminSendGroupLiveryGiftOutput> AdminSendGroupLiveryGift(int groupId, Guid liveryId) {}

// Ignore this one. We will want to integrate V2 endpoints only in Steelhead.
Task AdminSendItemGift(ulong recipientXuid, int itemType, int itemValue) {}

Task AdminSendItemGiftV2(ulong recipientXuid, string itemType, int itemValue) {}

// Ignore this one. We will want to integrate V2 endpoints only in Steelhead.
Task AdminSendItemGroupGift(int groupId, int itemType, int itemValue) {}

Task AdminSendItemGroupGiftV2(int groupId, string itemType, int itemValue) {}

// Ignore this one. We will want to integrate V2 endpoints only in Steelhead.
Task<AdminGetSupportedGiftTypesOutput> AdminGetSupportedGiftTypes(int maxResults) {}

Task<AdminGetSupportedGiftTypesV2Output> AdminGetSupportedGiftTypesV2(int maxResults) {}
```

<br />

### LocalizationManagementService

```c#
Task<AddStringToLocalizeOutput> AddStringToLocalize(ForzaLocalizedStringData localizedStringData) {}
```

### NotificationManagementService

```c#
Task<LiveOpsRetrieveForUserOutput> LiveOpsRetrieveForUser(ulong xuid, int maxResults) { }

Task<SendMessageNotificationToMultipleUsersOutput> SendMessageNotificationToMultipleUsers(ulong[] recipients, int xuidCount, string message, DateTime expirationTime, string imageUrl) { }

Task<SendGroupMessageNotificationOutput> SendGroupMessageNotification(int groupId, string message, DateTime expirationTime, bool hasDeviceType, ForzaLiveDeviceType deviceType) { }

Task<SendNotificationByDeviceTypeOutput> SendNotificationByDeviceType(ForzaLiveDeviceType deviceType, string message, DateTime expirationTime) { }

Task EditNotification(Guid notificationId, ulong xuid, ForzaCommunityMessageNotificationEditParameters editParameters) { }

Task EditGroupNotification(Guid notificationId, ForzaCommunityMessageNotificationEditParameters editParameters) { }

Task<GetAllUserGroupMessagesOutput> GetAllUserGroupMessages(int groupId, int maxResults) { }

Task<GetUserGroupMessageOutput> GetUserGroupMessage(Guid notificationId) { }

Task<GetNotificationOutput> GetNotification(ulong xuid, Guid notificationId) { }

Task<DeleteNotificationsForUserOutput> DeleteNotificationsForUser(ulong xuid) { }

// This is unused in Woodstock. I don't think we will need this in Steelhead either.
Task<SendMessageOutput> SendMessage(ulong[] recipients, Guid messageId, DateTime expirationTime) { }
```

### ScorebaordManagementService

No service for leaderboards in FM8 yet.

<br />

### StorefrontManagementService

```c#
Task<SearchUGCOutput> SearchUGC(ForzaUGCSearchRequest searchRequest, ForzaUGCContentType contentType, bool includeThumbnails, int maxResults) { }

Task<GetUGCLiveryOutput> GetUGCLivery(Guid id) { }

Task<GetUGCPhotoOutput> GetUGCPhoto(Guid id) { }

Task<GetUGCTuneOutput> GetUGCTune(Guid id) { }

Task SetFeatured(Guid id, bool featured, DateTime featureEndDate, DateTime forceFeatureEndDate) { }

// This is unused in Woodstock. I don't think we will need this in Steelhead either.
Task<GetUGCObjectOutput> GetUGCObject(Guid id) { }
```

### UserInventoryManagementService

This is missing `GetAdminUserInventoryAsync` and `GetAdminUserInventoryByProfileIdAsync` that exists in old user inventory service: `Forza.LiveOps.FM8.Generated.UserInventoryService;`

```c#
Task<GetAdminUserProfilesOutput> GetAdminUserProfiles(ulong xuid, uint maxProfiles) {}

Task RemoveCarFromUserInventoryWithCarId(int carId, int profileId) {}

Task RemoveCarFromUserInventoryWithVin(Guid vin, int profileId) {}
```

<br />

### UserManagementService

V2 report weight endpoints in Woodstock need to be ported to Steelhead as well (Report Weight Locktypes)

```c#
Task<BanUsersOutput> BanUsers(ForzaUserBanParameters[] banParameters, int xuidCount) { }

Task<GetUserBanHistoryOutput> GetUserBanHistory(ulong xuid, int startIndex, int maxResults) { }

Task<GetUserBanSummariesOutput> GetUserBanSummaries(ulong[] xuids, int xuidCount) { }

Task<ExpireBanEntriesOutput> ExpireBanEntries(ForzaUserExpireBanParameters[] parameters, int entryCount) { }

Task<DeleteBanEntriesOutput> DeleteBanEntries(int[] banEntryIds) { }

Task<GetUserGroupsOutput> GetUserGroups(int startIndex, int maxResults) { }

Task<GetUserGroupMembershipsOutput> GetUserGroupMemberships(ulong xuid, int[] groupIdFilter, int maxResults) { }

Task AddToUserGroups(ulong xuid, int[] groupIds) { }

Task RemoveFromUserGroups(ulong xuid, int[] groupIds) { }

Task<GetIsUnderReviewOutput> GetIsUnderReview(ulong xuid) { }

Task SetIsUnderReview(ulong xuid, bool isUnderReview) { }

Task<GetConsolesOutput> GetConsoles(ulong xuid, int maxResults) { }

Task SetConsoleBanStatus(ulong consoleId, bool isBanned) { }

Task<GetSharedConsoleUsersOutput> GetSharedConsoleUsers(ulong xuid, int startAt, int maxResults) { }

Task<GetAdminCommentsOutput> GetAdminComments(ulong xuid, int maxResults) { }

Task AddAdminComment(ulong xuid, string text, string author) { }

Task<GetUserIdsOutput> GetUserIds(int paramCount, ForzaPlayerLookupParameters[] playerLookupParameters) { }

Task<GetUserReportWeightOutput> GetUserReportWeight(ulong xuid) { }

Task SetUserReportWeight(ulong xuid, int reportWeight) { }

Task<GetHasPlayedRecordOutput> GetHasPlayedRecord(ulong xuid, Guid externalProfileId) { }

Task SetHasPlayedRecord(ulong xuid, int title, bool hasPlayed) { }

Task ResendProfileHasPlayedNotification(ulong xuid, Guid externalProfileId, int[] titles) { }
```