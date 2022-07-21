# Steelhead APIs

## Forza.WebServices.FM8.Generated

<br />

### LiveOpsService

Tested by v-jyates on Steelhead ForzaClient nuget: 2.5.1-prerelease

```c#
// Works as expected
Task<GetLiveOpsUserDataByXuidOutput> GetLiveOpsUserDataByXuid(ulong xuid) { }

// Works as expected
Task<GetLiveOpsUserDataByGamerTagOutput> GetLiveOpsUserDataByGamerTag(string gamertag)  { }

// Works as expected
Task<GetCMSRacersCupScheduleOutput> GetCMSRacersCupSchedule(string environment, string slotId, string snapshotId, DateTime startDate, int daysForwardToProject, ForzaEventSessionType[] gameOptionsFilter)  { }

// Works as expected
Task<GetCMSRacersCupScheduleForUserOutput> GetCMSRacersCupScheduleForUser(ulong xuid, DateTime startDate, int daysForwardToProject, ForzaEventSessionType[] gameOptionsFilter)  { }

// Unused in Woodstock, and I believe unused in Steelhead. We have a better API for sending Notifications in the Notifications Service. Not needed or tested.
Task<SendMessageOutput> SendMessage(ulong[] recipients, Guid messageId, DateTime expirationTime, ForzaNotificationType notificationType)  { }

// Unused in Woodstock, and I believe unused in Steelhead. Not needed or tested.
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

Tested by lugeiken; FM8 nuget version 2.5.1-prerelease
Cannot test sending cars/vanity item/liveries as none exist in pegasus

```c#
// Unused. We now use AdminSendItemGiftV2
Task AdminSendCreditsGift(ulong recipientXuid, uint creditAmount, string reason) {}

Task AdminSendCarGift(ulong recipientXuid, int carId) {}

Task<AdminSendLiveryGiftOutput> AdminSendLiveryGift(ulong[] recipientXuids, int xuidCount, Guid liveryId)  {}

Task<AdminSendGroupLiveryGiftOutput> AdminSendGroupLiveryGift(int groupId, Guid liveryId) {}

// Ignore this one. We will want to integrate V2 endpoints only in Steelhead.
Task AdminSendItemGift(ulong recipientXuid, int itemType, int itemValue) {}

/// Tested with only credits; GiftReceiveMoneyNotification Sent; XUID: 1234; Credit: 10;
Task AdminSendItemGiftV2(ulong recipientXuid, string itemType, int itemValue) {}

// Ignore this one. We will want to integrate V2 endpoints only in Steelhead.
Task AdminSendItemGroupGift(int groupId, int itemType, int itemValue) {}

/// Tested with only credits; GiftReceiveMoneyNotification Sent; GroupId: 23; Credit: 10;
Task AdminSendItemGroupGiftV2(int groupId, string itemType, int itemValue) {}

// Ignore this one. We will want to integrate V2 endpoints only in Steelhead.
Task<AdminGetSupportedGiftTypesOutput> AdminGetSupportedGiftTypes(int maxResults) {}

// Unused
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

Tested by v-jyates on Steelhead ForzaClient nuget: 2.5.1-prerelease
Found issues tracked by: https://dev.azure.com/t10motorsport/Motorsport/_workitems/edit/1222065

```c#
/// Not working, returning 500 for all requests I've tried. Mostly I was looking for any Livery/Photo/Tune so I could test below APIs
Task<SearchUGCOutput> SearchUGC(ForzaUGCSearchRequest searchRequest, ForzaUGCContentType contentType, bool includeThumbnails, int maxResults) { }

/// UGC ID: ca6c0853-ef54-4b66-9af8-29b0cd441d77 Throws: System.ComponentModel.DataAnnotations.ValidationException: 'Length of field LiveryData exceeded the max of 5242880. Length: 942887663'
Task<GetUGCLiveryOutput> GetUGCLivery(Guid id) { }

/// UGC ID: 60754c0e-a3dd-4fab-abf3-e6f464796e73 Works as expected
Task<GetUGCPhotoOutput> GetUGCPhoto(Guid id) { }

/// UGC ID: e000adb1-7233-4918-ad60-341b1aaec5d6 Works as expected
Task<GetUGCTuneOutput> GetUGCTune(Guid id) { }

/// Need valid UGC ID to test.
Task SetFeatured(Guid id, bool featured, DateTime featureEndDate, DateTime forceFeatureEndDate) { }

// Unused and untested.
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

Tested by v-jyates on Steelhead ForzaClient nuget: 2.5.1-prerelease
V2 report weight endpoints in Woodstock need to be ported to Steelhead as well (Report Weight Locktypes)
We also need the user groups endpoints added to woodstock added to steelhead as well
Found issues tracked by: https://dev.azure.com/t10motorsport/Motorsport/_workitems/edit/1222002

```c#
// Works as expected
Task<BanUsersOutput> BanUsers(ForzaUserBanParameters[] banParameters, int xuidCount) { }

// Works as expected
Task<GetUserBanHistoryOutput> GetUserBanHistory(ulong xuid, int startIndex, int maxResults) { }

// Works as expected
Task<GetUserBanSummariesOutput> GetUserBanSummaries(ulong[] xuids, int xuidCount) { }

// Works as expected
Task<ExpireBanEntriesOutput> ExpireBanEntries(ForzaUserExpireBanParameters[] parameters, int entryCount) { }

// Works as expected
Task<DeleteBanEntriesOutput> DeleteBanEntries(int[] banEntryIds) { }

// Works as expected
Task<GetUserGroupsOutput> GetUserGroups(int startIndex, int maxResults) { }

// Works as expected
Task<GetUserGroupMembershipsOutput> GetUserGroupMemberships(ulong xuid, int[] groupIdFilter, int maxResults) { }

// Works as expected
Task AddToUserGroups(ulong xuid, int[] groupIds) { }

// Works as expected
Task RemoveFromUserGroups(ulong xuid, int[] groupIds) { }

// Works as expected
Task<GetIsUnderReviewOutput> GetIsUnderReview(ulong xuid) { }

// Works as expected
Task SetIsUnderReview(ulong xuid, bool isUnderReview) { }

// Works as expected
Task<GetConsolesOutput> GetConsoles(ulong xuid, int maxResults) { }

// Works as expected
Task SetConsoleBanStatus(ulong consoleId, bool isBanned) { }

// Works as expected
Task<GetSharedConsoleUsersOutput> GetSharedConsoleUsers(ulong xuid, int startAt, int maxResults) { }

// Works as expected
Task<GetAdminCommentsOutput> GetAdminComments(ulong xuid, int maxResults) { }

Task AddAdminComment(ulong xuid, string text, string author) { }

// Works as expected
Task<GetUserIdsOutput> GetUserIds(int paramCount, ForzaPlayerLookupParameters[] playerLookupParameters) { }

// Blocked, need new report weight logic ala woodstock
Task<GetUserReportWeightOutput> GetUserReportWeight(ulong xuid) { }

// Blocked, need new report weight logic ala woodstock
Task SetUserReportWeight(ulong xuid, int reportWeight) { }

// API is not working
Task<GetHasPlayedRecordOutput> GetHasPlayedRecord(ulong xuid, Guid externalProfileId) { }

// This is unused per Supports request. They don't want to be in the business of changing these values.
Task SetHasPlayedRecord(ulong xuid, int title, bool hasPlayed) { }

// Cannot verify results without GetHasPlayedRecord
Task ResendProfileHasPlayedNotification(ulong xuid, Guid externalProfileId, int[] titles) { }
```