﻿using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Globalization;
using System.Linq;
using AutoMapper;
using Forza.Scoreboard.FH5_main.Generated;
using Forza.UserGeneratedContent.FH5_main.Generated;
using Forza.UserInventory.FH5_main.Generated;
using Forza.WebServices.RareCarShopTransactionObjects.FH5_main.Generated;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Common.AuctionDataEndpoint;
using Turn10.LiveOps.StewardApi.Contracts.Data;
using Turn10.LiveOps.StewardApi.Contracts.Errors;
using Turn10.LiveOps.StewardApi.Contracts.Woodstock;
using Turn10.LiveOps.StewardApi.Helpers;
using Turn10.Services.LiveOps.FH5_main.Generated;
using Xls.Security.FH5_main.Generated;
using static Turn10.Services.LiveOps.FH5_main.Generated.UserManagementService;
using ServicesLiveOps = Turn10.Services.LiveOps.FH5_main.Generated;
using WebServicesContracts = Forza.WebServices.FH5_main.Generated;

namespace Turn10.LiveOps.StewardApi.ProfileMappers
{
    /// <summary>
    ///     Mapper for Woodstock DTOs.
    /// </summary>
    [SuppressMessage("Microsoft.Maintainability", "CA1506:AvoidExcessiveClassCoupling", Justification = "High class coupling by design.")]
    [SuppressMessage("Microsoft.Maintainability", "CA1505:AvoidUnmaintainableCode", Justification = "High class coupling by design.")]
    public sealed class WoodstockProfileMapper : Profile
    {
        /// <summary>
        ///     Initializes a new instance of the <see cref="WoodstockProfileMapper"/> class.
        /// </summary>
        public WoodstockProfileMapper()
        {
            this.CreateMap<InventoryItemSource, WoodstockInventoryItemSource>();
            this.CreateMap<AdminForzaCarUserInventoryItem, WoodstockPlayerInventoryItem>()
                .ForMember(des => des.Id, opt => opt.MapFrom(src => src.itemId))
                .ForMember(des => des.Quantity, opt => opt.MapFrom(src => src.quantity))
                .ForMember(dest => dest.AcquiredUtc, opt => opt.MapFrom(src => src.acquisitionTime))
                .ForMember(dest => dest.InventoryItemSource, opt => opt.MapFrom(src => src.itemSource))
                .ForMember(des => des.Error, opt => opt.Ignore())
                .ReverseMap();
            this.CreateMap<AdminForzaUserInventoryItem, WoodstockPlayerInventoryItem>()
                .ForMember(des => des.Id, opt => opt.MapFrom(src => src.itemId))
                .ForMember(des => des.Quantity, opt => opt.MapFrom(src => src.quantity))
                .ForMember(dest => dest.AcquiredUtc, opt => opt.MapFrom(src => src.acquisitionTime))
                .ForMember(dest => dest.InventoryItemSource, opt => opt.MapFrom(src => src.itemSource))
                .ForMember(des => des.Error, opt => opt.Ignore())
                .ReverseMap();
            this.CreateMap<AdminForzaUserInventorySummary, WoodstockPlayerInventory>()
                .ForMember(des => des.CreditRewards, opt => opt.MapFrom(src => new List<WoodstockPlayerInventoryItem>
                {
                    new WoodstockPlayerInventoryItem { Id = -1, Description = "Credits", Quantity = src.credits },
                    new WoodstockPlayerInventoryItem { Id = -1, Description = "WheelSpins", Quantity = src.wheelSpins },
                    new WoodstockPlayerInventoryItem { Id = -1, Description = "SuperWheelSpins", Quantity = src.superWheelSpins },
                    new WoodstockPlayerInventoryItem { Id = -1, Description = "SkillPoints", Quantity = src.skillPoints },
                }))
                .ReverseMap();
            this.CreateMap<ServicesLiveOps.AdminForzaProfile, WoodstockInventoryProfile>()
                .ForMember(dest => dest.DeviceType, opt => opt.MapFrom(src => this.PrepareDeviceType(src.deviceType)))
                .ReverseMap();
            this.CreateMap<ServicesLiveOps.ForzaUserBanSummary, BanSummary>()
                .ForMember(dest => dest.AdjustedBanCount, opt => opt.Ignore())
                .ForMember(dest => dest.BannedAreas, opt => opt.MapFrom(src => new List<string>() { LiveOpsBanHistoryMapper.PrepareWoodstockBanFeatureArea(src.FeatureAreas) }));
            this.CreateMap<ServicesLiveOps.ForzaUserBanDescription, BanDescription>()
                .ForMember(dest => dest.FeatureArea, opt => opt.MapFrom(src => LiveOpsBanHistoryMapper.PrepareWoodstockBanFeatureArea(src.FeatureAreas)))
                .ForMember(dest => dest.StartTimeUtc, opt => opt.MapFrom(src => src.StartTime))
                .ForMember(dest => dest.ExpireTimeUtc, opt => opt.MapFrom(src => src.ExpireTime))
                .ForMember(dest => dest.LastExtendedTimeUtc, opt => opt.MapFrom(src => src.LastExtendTime))
                .ForMember(dest => dest.CountOfTimesExtended, opt => opt.MapFrom(src => src.ExtendTimes))
                .ForMember(dest => dest.LastExtendedReason, opt => opt.Ignore());
            this.CreateMap<ServicesLiveOps.ForzaUserBanResult, BanResult>()
                .ForMember(dest => dest.Error, opt => opt.MapFrom(
                    src => src.Success ? null : new ServicesFailureStewardError($"LSP failed to ban player with XUID: {src.Xuid}")));
            this.CreateMap<WebServicesContracts.ForzaProfileSummary, ProfileSummary>()
                .ForMember(dest => dest.HackFlags, opt => opt.MapFrom(src => src.HackFlags.Select(t => t.Name)));
            this.CreateMap<WebServicesContracts.ForzaCredityUpdateEntry, CreditUpdate>().ReverseMap();
            this.CreateMap<ServicesLiveOps.ForzaConsole, ConsoleDetails>().ReverseMap();
            this.CreateMap<ServicesLiveOps.ForzaSharedConsoleUser, SharedConsoleUser>().ReverseMap();
            this.CreateMap<ServicesLiveOps.ForzaUserGroup, LspGroup>();
            this.CreateMap<WoodstockPlayerDetails, IdentityResultAlpha>()
                .ForMember(dest => dest.Query, opt => opt.Ignore())
                .ForMember(dest => dest.Error, opt => opt.Ignore())
                .ReverseMap();
            this.CreateMap<WoodstockUserFlagsInput, WoodstockUserFlags>().ReverseMap();
            this.CreateMap<WoodstockGroupGift, WoodstockGift>().ReverseMap();
            this.CreateMap<WebServicesContracts.ForzaUserData, WoodstockPlayerDetails>()
                .ForMember(dest => dest.Xuid, opt => opt.MapFrom(src => src.Xuid))
                .ForMember(dest => dest.Gamertag, opt => opt.MapFrom(src => src.Gamertag))
                .ForMember(dest => dest.CustomizationSlots, opt => opt.Ignore())
                .ReverseMap();
            this.CreateMap<WebServicesContracts.RareCarTicketBalance, WoodstockAccountInventory>()
                .ForMember(dest => dest.BackstagePasses, opt => opt.MapFrom(src => src.OfflineBalance))
                .ReverseMap();
            this.CreateMap<WebServicesContracts.RareCarShopTransaction, BackstagePassUpdate>()
                .ForMember(dest => dest.CreatedAtUtc, opt => opt.MapFrom(src => src.CreatedAt))
                .ForMember(dest => dest.BackstagePassAmount, opt => opt.MapFrom(src => src.OfflineTicketAmount))
                .ForMember(dest => dest.TransactionType, opt => opt.MapFrom(src => Enum.GetName(typeof(Operation), src.TransactionType)))
                .ReverseMap();
            this.CreateMap<ServicesLiveOps.ForzaLiveOpsNotification, Notification>()
                .ForMember(dest => dest.NotificationId, opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.SentDateUtc, opt => opt.MapFrom(src => src.SentDate))
                .ForMember(dest => dest.ExpirationDateUtc, opt => opt.MapFrom(src => src.ExpirationDate))
                .ReverseMap();
            this.CreateMap<ServicesLiveOps.ForzaUserGroupMessage, UserGroupNotification>()
                .ForMember(dest => dest.DeviceType, opt => opt.MapFrom(src => src.DeviceType))
                .ForMember(dest => dest.SentDateUtc, opt => opt.MapFrom(src => src.SentDate))
                .ForMember(dest => dest.ExpirationDateUtc, opt => opt.MapFrom(src => src.ExpirationDate))
                .ReverseMap();
            this.CreateMap<ServicesLiveOps.ForzaUserMessageSendResult, MessageSendResult<ulong>>()
                .ForMember(dest => dest.PlayerOrLspGroup, opt => opt.MapFrom(src => src.Xuid))
                .ForMember(dest => dest.IdentityAntecedent, opt => opt.MapFrom(src => GiftIdentityAntecedent.Xuid))
                .ForMember(dest => dest.Error, opt => opt.Ignore());
            this.CreateMap<ServicesLiveOps.ForzaUserAdminComment, ProfileNote>()
                .ForMember(dest => dest.DateUtc, opt => opt.MapFrom(source => source.date))
                .ForMember(dest => dest.Author, opt => opt.MapFrom(source => source.author))
                .ForMember(dest => dest.Text, opt => opt.MapFrom(source => source.text));
            this.CreateMap<AuctionFilters, ServicesLiveOps.ForzaAuctionFilters>()
                .ForMember(dest => dest.IncludeThumbnail, opt => opt.MapFrom(source => true))
                .ForMember(dest => dest.IncludeAdminTexture, opt => opt.MapFrom(source => true))
                .ForMember(dest => dest.CarId, opt => opt.MapFrom(source => source.CarId))
                .ForMember(dest => dest.MakeId, opt => opt.MapFrom(source => source.MakeId))
                .ForMember(dest => dest.AuctionStatus, opt => opt.MapFrom(source => source.Status))
                .ForMember(dest => dest.OrderBy, opt => opt.MapFrom(source => source.Sort == AuctionSort.ClosingDateAscending ? ServicesLiveOps.ForzaSearchOrderBy.ClosingDateAsc : ServicesLiveOps.ForzaSearchOrderBy.ClosingDateDesc))
                .ForMember(dest => dest.Seller, opt => opt.Ignore());

            this.CreateMap<ServicesLiveOps.ForzaAuctionWithFileData, PlayerAuction>()
                .ForMember(
                    dest => dest.TextureMapImageBase64,
                    opt => opt.MapFrom(source =>
                        source.AdminTexture.Length > 0
                            ? "data:image/jpeg;base64," + Convert.ToBase64String(source.AdminTexture)
                            : null))
                .ForMember(
                    dest => dest.LiveryImageBase64,
                    opt => opt.MapFrom(source =>
                        source.LargeThumbnail.Length > 0
                            ? "data:image/jpeg;base64," + Convert.ToBase64String(source.LargeThumbnail)
                            : null))
                .ForMember(dest => dest.Id, opt => opt.MapFrom(source => source.Auction.Id))
                .ForMember(dest => dest.Status, opt => opt.MapFrom(source => source.Auction.Status))
                .ForMember(dest => dest.CurrentPrice, opt => opt.MapFrom(source => source.Auction.CurrentPrice))
                .ForMember(dest => dest.BuyoutPrice, opt => opt.MapFrom(source => source.Auction.BuyoutPrice))
                .ForMember(dest => dest.ClosingDateUtc, opt => opt.MapFrom(source => source.Auction.ClosingDate))
                .ForMember(dest => dest.CreatedDateUtc, opt => opt.MapFrom(source => source.Auction.CreatedDate))
                .ForMember(dest => dest.MakeId, opt => opt.MapFrom(source => source.Auction.Car.make))
                .ForMember(dest => dest.ModelId, opt => opt.MapFrom(source => source.Auction.Car.carId))
                .ForMember(dest => dest.Bids, opt => opt.MapFrom(source => source.Auction.BidCount))
                .ForMember(dest => dest.TotalReports, opt => opt.MapFrom(source => source.Auction.UserReportTotal))
                .ForMember(dest => dest.TimeFlagged, opt => opt.MapFrom(source => source.Auction.TimeFlagged != default ? source.Auction.TimeFlagged : (DateTime?)null))
                .ForMember(dest => dest.ItemName, opt => opt.Ignore())
                .ForMember(dest => dest.ReviewState, opt => opt.Ignore());
            this.CreateMap<ulong, ServicesLiveOps.ForzaPlayerLookupParameters>()
                .ForMember(dest => dest.UserIDType, opt => opt.MapFrom(src => ServicesLiveOps.ForzaUserIdType.Xuid))
                .ForMember(dest => dest.UserID, opt => opt.MapFrom(xuid => xuid.ToInvariantString()));
            this.CreateMap<IdentityQueryAlpha, ServicesLiveOps.ForzaPlayerLookupParameters>()
                .ForMember(dest => dest.UserIDType, opt => opt.MapFrom(
                    src => src.Xuid.HasValue ? ServicesLiveOps.ForzaUserIdType.Xuid : ServicesLiveOps.ForzaUserIdType.Gamertag))
                .ForMember(dest => dest.UserID, opt => opt.MapFrom(
                    src => src.Xuid.HasValue ? src.Xuid.ToString() : src.Gamertag));
            this.CreateMap<ServicesLiveOps.ForzaPlayerLookupParameters, IdentityQueryAlpha>()
                .ForMember(dest => dest.Xuid, opt => opt.MapFrom(
                    src => src.UserIDType == ServicesLiveOps.ForzaUserIdType.Xuid ? (ulong?)Convert.ToUInt64(src.UserID, CultureInfo.InvariantCulture) : null))
                .ForMember(dest => dest.Gamertag, opt => opt.MapFrom(
                    src => src.UserIDType == ServicesLiveOps.ForzaUserIdType.Gamertag ? src.UserID : null));
            this.CreateMap<ServicesLiveOps.ForzaPlayerLookupResult, IdentityResultAlpha>()
                .ForMember(dest => dest.Query, opt => opt.MapFrom(src => src.Request))
                .ForMember(dest => dest.Error, opt => opt.MapFrom(
                    src => src.PlayerExists ? null :
                        new NotFoundStewardError(
                            $"No player found for {src.Request.UserIDType}: {src.Request.UserID}.")))
                .ForMember(dest => dest.Gamertag, opt => opt.MapFrom(src => src.PlayerExists ? src.Gamertag : null))
                .ForMember(dest => dest.Xuid, opt => opt.MapFrom(src => src.PlayerExists ? src.Xuid : 0))
                .ReverseMap();

            this.CreateMap<ServicesLiveOps.ForzaLiveryGiftResult, GiftResponse<ulong>>()
                .ForMember(dest => dest.PlayerOrLspGroup, opt => opt.MapFrom(source => source.xuid))
                .ForMember(dest => dest.TargetXuid, opt => opt.MapFrom(source => source.xuid))
                .ForMember(dest => dest.IdentityAntecedent, opt => opt.MapFrom(source => GiftIdentityAntecedent.Xuid))
                .ForMember(dest => dest.Errors, opt => opt.MapFrom(source =>
                        source.Success
                            ? new List<StewardError>()
                            : new List<StewardError>
                            {
                                new ServicesFailureStewardError(
                                    $"LSP failed to gift livery to player with XUID: {source.xuid}"),
                            }))
                .ForMember(dest => dest.TargetLspGroupId, opt => opt.Ignore());

            this.CreateMap<ServicesLiveOps.ForzaAuctionBlocklistEntry, AuctionBlockListEntry>()
                .ForMember(dest => dest.ExpireDateUtc, opt => opt.MapFrom(src => src.ExpireDate))
                .ForMember(dest => dest.Description, opt => opt.Ignore())
                .ForMember(dest => dest.Series, opt => opt.Ignore())
                .ReverseMap();
            this.CreateMap<DeviceType, ServicesLiveOps.ForzaLiveDeviceType>().ReverseMap();

            this.CreateMap<UgcFilters, ServicesLiveOps.ForzaUGCSearchRequest>()
                .ForMember(dest => dest.CarId, opt => opt.MapFrom(source => UgcSearchConstants.NoCarId))
                .ForMember(dest => dest.KeywordIdOne, opt => opt.MapFrom(source => UgcSearchConstants.NoKeywordId))
                .ForMember(dest => dest.KeywordIdTwo, opt => opt.MapFrom(source => UgcSearchConstants.NoKeywordId))
                .ForMember(dest => dest.ShowBothUnfeaturedAndFeatured, opt => opt.MapFrom(source => true))
                .ForMember(dest => dest.ManualKeywords, opt => opt.Ignore())
                .ForMember(dest => dest.OrderBy, opt => opt.Ignore())
                .ForMember(dest => dest.Featured, opt => opt.Ignore())
                .ForMember(dest => dest.ForceFeatured, opt => opt.Ignore())
                .ForMember(dest => dest.UnderReview, opt => opt.Ignore())
                .ReverseMap();
            this.CreateMap<UgcSearchFilters, ServicesLiveOps.ForzaUGCSearchRequest>()
                .ForMember(dest => dest.ManualKeywords, opt => opt.MapFrom(source => source.Keywords))
                .ForMember(dest => dest.Featured, opt => opt.MapFrom(source => source.IsFeatured))
                .ForMember(dest => dest.ShowBothUnfeaturedAndFeatured, opt => opt.MapFrom(source => !source.IsFeatured))
                .ForMember(dest => dest.KeywordIdOne, opt => opt.MapFrom(source => UgcSearchConstants.NoKeywordId))
                .ForMember(dest => dest.KeywordIdTwo, opt => opt.MapFrom(source => UgcSearchConstants.NoKeywordId))
                .ForMember(dest => dest.ShareCode, opt => opt.Ignore())
                .ForMember(dest => dest.ForceFeatured, opt => opt.Ignore())
                .ForMember(dest => dest.UnderReview, opt => opt.Ignore())
                .ReverseMap();
            this.CreateMap<UgcType, ServicesLiveOps.ForzaUGCContentType>().ReverseMap();
            this.CreateMap<ServicesLiveOps.ForzaUGCData, WoodstockUgcItem>()
                .ForMember(dest => dest.GeoFlags, opt => opt.MapFrom(source => source.Metadata.GeoFlags.AsEnumList<WoodstockUgcGeoFlagOption>()))
                .ForMember(dest => dest.IsPublic, opt => opt.MapFrom(source => source.Metadata.Searchable))
                .ForMember(
                    dest => dest.ThumbnailOneImageBase64,
                    opt => opt.MapFrom(source =>
                        source.Payloads.Length > 0
                            ? "data:image/jpeg;base64," + Convert.ToBase64String(source.Payloads[0].Payload)
                            : null))
                .ForMember(
                    dest => dest.ThumbnailTwoImageBase64,
                    opt => opt.MapFrom(source =>
                        source.Payloads.Length > 1
                            ? "data:image/jpeg;base64," + Convert.ToBase64String(source.Payloads[1].Payload)
                            : null))
                .ForMember(dest => dest.Type, opt => opt.MapFrom(source => source.Metadata.ContentType))
                .ForMember(dest => dest.Id, opt => opt.MapFrom(source => source.Metadata.GuidId))
                .ForMember(dest => dest.ShareCode, opt => opt.MapFrom(source => source.Metadata.ShareCode))
                .ForMember(dest => dest.CarId, opt => opt.MapFrom(source => source.Metadata.CarId))
                .ForMember(dest => dest.MakeId, opt => opt.MapFrom(source => source.Metadata.MakeId))
                .ForMember(dest => dest.CreatedDateUtc, opt => opt.MapFrom(source => source.Metadata.CreatedDate))
                .ForMember(dest => dest.Title, opt => opt.MapFrom(source => source.Metadata.Title))
                .ForMember(dest => dest.Description, opt => opt.MapFrom(source => source.Metadata.Description))
                .ForMember(dest => dest.FeaturedByT10, opt => opt.MapFrom(source => source.Metadata.FeaturedByT10))
                .ForMember(
                    dest => dest.ForceFeaturedEndDateUtc,
                    opt => opt.MapFrom(source => source.Metadata.ForceFeaturedEndDate.CovertToNullIfMin()))
                .ForMember(
                    dest => dest.FeaturedEndDateUtc,
                    opt => opt.MapFrom(source => source.Metadata.FeaturedEndDate.CovertToNullIfMin()))
                .ForMember(dest => dest.GameTitle, opt => opt.MapFrom(source => source.Metadata.GameTitle))
                .ForMember(dest => dest.OwnerXuid, opt => opt.MapFrom(source => source.Metadata.Owner))
                .ForMember(dest => dest.KeywordIdOne, opt => opt.MapFrom(source => source.Metadata.KeywordIdOne))
                .ForMember(dest => dest.KeywordIdTwo, opt => opt.MapFrom(source => source.Metadata.KeywordIdTwo))
                .ForMember(
                    dest => dest.PopularityBucket,
                    opt => opt.MapFrom(source => source.Metadata.PopularityBucket))
                .ForMember(dest => dest.ReportingState, opt => opt.MapFrom(source => source.Metadata.ReportingState))
                .ForMember(dest => dest.Type, opt => opt.MapFrom(source => source.Metadata.ContentType))
                .ForMember(dest => dest.TimesDisliked, opt => opt.MapFrom(source => source.Metadata.TimesDisliked))
                .ForMember(dest => dest.TimesLiked, opt => opt.MapFrom(source => source.Metadata.TimesLiked))
                .ForMember(dest => dest.TimesDownloaded, opt => opt.MapFrom(source => source.Metadata.TimesDownloaded))
                .ForMember(dest => dest.TimesUsed, opt => opt.MapFrom(source => source.Metadata.TimesUsed))
                .ForMember(dest => dest.IsHidden, opt => opt.MapFrom(source => source.Metadata.HiddenTime != default(DateTime)))
                .ForMember(dest => dest.HiddenTimeUtc, opt => opt.MapFrom(source => source.Metadata.HiddenTime.CovertToNullIfMin()))
                .ForMember(dest => dest.OwnerGamertag, opt => opt.Ignore())
                .ForMember(dest => dest.CarDescription, opt => opt.Ignore())
                .ReverseMap();

            this.CreateMap<ServicesLiveOps.ForzaUGCMetadata, WoodstockUgcItem>()
                .ForMember(dest => dest.GeoFlags, opt => opt.MapFrom(source => source.GeoFlags.AsEnumList<WoodstockUgcGeoFlagOption>()))
                .ForMember(dest => dest.IsPublic, opt => opt.MapFrom(source => source.Searchable))
                .ForMember(dest => dest.Type, opt => opt.MapFrom(source => source.ContentType))
                .ForMember(dest => dest.Id, opt => opt.MapFrom(source => source.GuidId))
                .ForMember(dest => dest.ShareCode, opt => opt.MapFrom(source => source.ShareCode))
                .ForMember(dest => dest.CarId, opt => opt.MapFrom(source => source.CarId))
                .ForMember(dest => dest.MakeId, opt => opt.MapFrom(source => source.MakeId))
                .ForMember(dest => dest.CreatedDateUtc, opt => opt.MapFrom(source => source.CreatedDate))
                .ForMember(dest => dest.Title, opt => opt.MapFrom(source => source.Title))
                .ForMember(dest => dest.Description, opt => opt.MapFrom(source => source.Description))
                .ForMember(dest => dest.FeaturedByT10, opt => opt.MapFrom(source => source.FeaturedByT10))
                .ForMember(
                    dest => dest.ForceFeaturedEndDateUtc,
                    opt => opt.MapFrom(source => source.ForceFeaturedEndDate.CovertToNullIfMin()))
                .ForMember(
                    dest => dest.FeaturedEndDateUtc,
                    opt => opt.MapFrom(source => source.FeaturedEndDate.CovertToNullIfMin()))
                .ForMember(dest => dest.GameTitle, opt => opt.MapFrom(source => source.GameTitle))
                .ForMember(dest => dest.OwnerXuid, opt => opt.MapFrom(source => source.Owner))
                .ForMember(dest => dest.KeywordIdOne, opt => opt.MapFrom(source => source.KeywordIdOne))
                .ForMember(dest => dest.KeywordIdTwo, opt => opt.MapFrom(source => source.KeywordIdTwo))
                .ForMember(
                    dest => dest.PopularityBucket,
                    opt => opt.MapFrom(source => source.PopularityBucket))
                .ForMember(dest => dest.ReportingState, opt => opt.MapFrom(source => source.ReportingState))
                .ForMember(dest => dest.Type, opt => opt.MapFrom(source => source.ContentType))
                .ForMember(dest => dest.TimesDisliked, opt => opt.MapFrom(source => source.TimesDisliked))
                .ForMember(dest => dest.TimesLiked, opt => opt.MapFrom(source => source.TimesLiked))
                .ForMember(dest => dest.TimesDownloaded, opt => opt.MapFrom(source => source.TimesDownloaded))
                .ForMember(dest => dest.TimesUsed, opt => opt.MapFrom(source => source.TimesUsed))
                .ForMember(dest => dest.OwnerGamertag, opt => opt.Ignore())
                .ForMember(dest => dest.ThumbnailOneImageBase64, opt => opt.Ignore())
                .ForMember(dest => dest.ThumbnailTwoImageBase64, opt => opt.Ignore())
                .ForMember(dest => dest.CarDescription, opt => opt.Ignore())
                .ForMember(dest => dest.HiddenTimeUtc, opt => opt.Ignore())
                .ReverseMap();

            this.CreateMap<ServicesLiveOps.ForzaLiveryData, WoodstockUgcLiveryItem>()
                .ForMember(dest => dest.LiveryDownloadDataBase64, opt => opt.MapFrom(source => source.LiveryData))
                .ForMember(dest => dest.GeoFlags, opt => opt.MapFrom(source => source.Metadata.GeoFlags.AsEnumList<WoodstockUgcGeoFlagOption>()))
                .ForMember(dest => dest.IsPublic, opt => opt.MapFrom(source => source.Metadata.Searchable))
                .ForMember(dest => dest.ThumbnailOneImageBase64, opt => opt.MapFrom(source => source.Thumbnail.Length > 0 ? "data:image/jpeg;base64," + Convert.ToBase64String(source.Thumbnail) : null))
                .ForMember(dest => dest.ThumbnailTwoImageBase64, opt => opt.MapFrom(source => source.AdminTexture.Length > 0 ? "data:image/jpeg;base64," + Convert.ToBase64String(source.AdminTexture) : null))
                .ForMember(dest => dest.Type, opt => opt.MapFrom(source => UgcType.Livery))
                .ForMember(dest => dest.Id, opt => opt.MapFrom(source => source.Metadata.GuidId))
                .ForMember(dest => dest.ShareCode, opt => opt.MapFrom(source => source.Metadata.ShareCode))
                .ForMember(dest => dest.CarId, opt => opt.MapFrom(source => source.Metadata.CarId))
                .ForMember(dest => dest.MakeId, opt => opt.MapFrom(source => source.Metadata.MakeId))
                .ForMember(dest => dest.CreatedDateUtc, opt => opt.MapFrom(source => source.Metadata.CreatedDate))
                .ForMember(dest => dest.Title, opt => opt.MapFrom(source => source.Metadata.Title))
                .ForMember(dest => dest.Description, opt => opt.MapFrom(source => source.Metadata.Description))
                .ForMember(dest => dest.FeaturedByT10, opt => opt.MapFrom(source => source.Metadata.FeaturedByT10))
                .ForMember(dest => dest.ForceFeaturedEndDateUtc, opt => opt.MapFrom(source => source.Metadata.ForceFeaturedEndDate.CovertToNullIfMin()))
                .ForMember(dest => dest.FeaturedEndDateUtc, opt => opt.MapFrom(source => source.Metadata.FeaturedEndDate.CovertToNullIfMin()))
                .ForMember(dest => dest.GameTitle, opt => opt.MapFrom(source => source.Metadata.GameTitle))
                .ForMember(dest => dest.OwnerXuid, opt => opt.MapFrom(source => source.Metadata.Owner))
                .ForMember(dest => dest.KeywordIdOne, opt => opt.MapFrom(source => source.Metadata.KeywordIdOne))
                .ForMember(dest => dest.KeywordIdTwo, opt => opt.MapFrom(source => source.Metadata.KeywordIdTwo))
                .ForMember(dest => dest.PopularityBucket, opt => opt.MapFrom(source => source.Metadata.PopularityBucket))
                .ForMember(dest => dest.ReportingState, opt => opt.MapFrom(source => source.Metadata.ReportingState))
                .ForMember(dest => dest.Type, opt => opt.MapFrom(source => source.Metadata.ContentType))
                .ForMember(dest => dest.TimesDisliked, opt => opt.MapFrom(source => source.Metadata.TimesDisliked))
                .ForMember(dest => dest.TimesLiked, opt => opt.MapFrom(source => source.Metadata.TimesLiked))
                .ForMember(dest => dest.TimesDownloaded, opt => opt.MapFrom(source => source.Metadata.TimesDownloaded))
                .ForMember(dest => dest.TimesUsed, opt => opt.MapFrom(source => source.Metadata.TimesUsed))
                .ForMember(dest => dest.IsHidden, opt => opt.MapFrom(source => source.Metadata.HiddenTime != default(DateTime)))
                .ForMember(dest => dest.HiddenTimeUtc, opt => opt.MapFrom(source => source.Metadata.HiddenTime.CovertToNullIfMin()))
                .ForMember(dest => dest.OwnerGamertag, opt => opt.Ignore())
                .ForMember(dest => dest.CarDescription, opt => opt.Ignore())
                .ReverseMap();

            this.CreateMap<ServicesLiveOps.ForzaPhotoData, WoodstockUgcItem>()
                .ForMember(dest => dest.GeoFlags, opt => opt.MapFrom(source => source.Metadata.GeoFlags.AsEnumList<WoodstockUgcGeoFlagOption>()))
                .ForMember(dest => dest.IsPublic, opt => opt.MapFrom(source => source.Metadata.Searchable))
                .ForMember(dest => dest.ThumbnailOneImageBase64, opt => opt.MapFrom(source => source.PhotoData.Length > 0 ? "data:image/jpeg;base64," + Convert.ToBase64String(source.PhotoData) : null))
                .ForMember(dest => dest.Type, opt => opt.MapFrom(source => UgcType.Photo))
                .ForMember(dest => dest.Id, opt => opt.MapFrom(source => source.Metadata.GuidId))
                .ForMember(dest => dest.ShareCode, opt => opt.MapFrom(source => source.Metadata.ShareCode))
                .ForMember(dest => dest.CarId, opt => opt.MapFrom(source => source.Metadata.CarId))
                .ForMember(dest => dest.MakeId, opt => opt.MapFrom(source => source.Metadata.MakeId))
                .ForMember(dest => dest.CreatedDateUtc, opt => opt.MapFrom(source => source.Metadata.CreatedDate))
                .ForMember(dest => dest.Title, opt => opt.MapFrom(source => source.Metadata.Title))
                .ForMember(dest => dest.Description, opt => opt.MapFrom(source => source.Metadata.Description))
                .ForMember(dest => dest.FeaturedByT10, opt => opt.MapFrom(source => source.Metadata.FeaturedByT10))
                .ForMember(dest => dest.ForceFeaturedEndDateUtc, opt => opt.MapFrom(source => source.Metadata.ForceFeaturedEndDate.CovertToNullIfMin()))
                .ForMember(dest => dest.FeaturedEndDateUtc, opt => opt.MapFrom(source => source.Metadata.FeaturedEndDate.CovertToNullIfMin()))
                .ForMember(dest => dest.GameTitle, opt => opt.MapFrom(source => source.Metadata.GameTitle))
                .ForMember(dest => dest.OwnerXuid, opt => opt.MapFrom(source => source.Metadata.Owner))
                .ForMember(dest => dest.KeywordIdOne, opt => opt.MapFrom(source => source.Metadata.KeywordIdOne))
                .ForMember(dest => dest.KeywordIdTwo, opt => opt.MapFrom(source => source.Metadata.KeywordIdTwo))
                .ForMember(dest => dest.PopularityBucket, opt => opt.MapFrom(source => source.Metadata.PopularityBucket))
                .ForMember(dest => dest.ReportingState, opt => opt.MapFrom(source => source.Metadata.ReportingState))
                .ForMember(dest => dest.Type, opt => opt.MapFrom(source => source.Metadata.ContentType))
                .ForMember(dest => dest.TimesDisliked, opt => opt.MapFrom(source => source.Metadata.TimesDisliked))
                .ForMember(dest => dest.TimesLiked, opt => opt.MapFrom(source => source.Metadata.TimesLiked))
                .ForMember(dest => dest.TimesDownloaded, opt => opt.MapFrom(source => source.Metadata.TimesDownloaded))
                .ForMember(dest => dest.TimesUsed, opt => opt.MapFrom(source => source.Metadata.TimesUsed))
                .ForMember(dest => dest.IsHidden, opt => opt.MapFrom(source => source.Metadata.HiddenTime != default(DateTime)))
                .ForMember(dest => dest.HiddenTimeUtc, opt => opt.MapFrom(source => source.Metadata.HiddenTime.CovertToNullIfMin()))
                .ForMember(dest => dest.OwnerGamertag, opt => opt.Ignore())
                .ForMember(dest => dest.ThumbnailTwoImageBase64, opt => opt.Ignore())
                .ForMember(dest => dest.CarDescription, opt => opt.Ignore())
                .ReverseMap();

            this.CreateMap<ServicesLiveOps.ForzaTuneData, WoodstockUgcItem>()
                .ForMember(dest => dest.GeoFlags, opt => opt.MapFrom(source => source.Metadata.GeoFlags.AsEnumList<WoodstockUgcGeoFlagOption>()))
                .ForMember(dest => dest.IsPublic, opt => opt.MapFrom(source => source.Metadata.Searchable))
                .ForMember(dest => dest.Type, opt => opt.MapFrom(source => UgcType.Photo))
                .ForMember(dest => dest.Id, opt => opt.MapFrom(source => source.Metadata.GuidId))
                .ForMember(dest => dest.ShareCode, opt => opt.MapFrom(source => source.Metadata.ShareCode))
                .ForMember(dest => dest.CarId, opt => opt.MapFrom(source => source.Metadata.CarId))
                .ForMember(dest => dest.MakeId, opt => opt.MapFrom(source => source.Metadata.MakeId))
                .ForMember(dest => dest.CreatedDateUtc, opt => opt.MapFrom(source => source.Metadata.CreatedDate))
                .ForMember(dest => dest.Title, opt => opt.MapFrom(source => source.Metadata.Title))
                .ForMember(dest => dest.Description, opt => opt.MapFrom(source => source.Metadata.Description))
                .ForMember(dest => dest.FeaturedByT10, opt => opt.MapFrom(source => source.Metadata.FeaturedByT10))
                .ForMember(dest => dest.ForceFeaturedEndDateUtc, opt => opt.MapFrom(source => source.Metadata.ForceFeaturedEndDate.CovertToNullIfMin()))
                .ForMember(dest => dest.FeaturedEndDateUtc, opt => opt.MapFrom(source => source.Metadata.FeaturedEndDate.CovertToNullIfMin()))
                .ForMember(dest => dest.GameTitle, opt => opt.MapFrom(source => source.Metadata.GameTitle))
                .ForMember(dest => dest.OwnerXuid, opt => opt.MapFrom(source => source.Metadata.Owner))
                .ForMember(dest => dest.KeywordIdOne, opt => opt.MapFrom(source => source.Metadata.KeywordIdOne))
                .ForMember(dest => dest.KeywordIdTwo, opt => opt.MapFrom(source => source.Metadata.KeywordIdTwo))
                .ForMember(dest => dest.PopularityBucket, opt => opt.MapFrom(source => source.Metadata.PopularityBucket))
                .ForMember(dest => dest.ReportingState, opt => opt.MapFrom(source => source.Metadata.ReportingState))
                .ForMember(dest => dest.Type, opt => opt.MapFrom(source => source.Metadata.ContentType))
                .ForMember(dest => dest.TimesDisliked, opt => opt.MapFrom(source => source.Metadata.TimesDisliked))
                .ForMember(dest => dest.TimesLiked, opt => opt.MapFrom(source => source.Metadata.TimesLiked))
                .ForMember(dest => dest.TimesDownloaded, opt => opt.MapFrom(source => source.Metadata.TimesDownloaded))
                .ForMember(dest => dest.TimesUsed, opt => opt.MapFrom(source => source.Metadata.TimesUsed))
                .ForMember(dest => dest.IsHidden, opt => opt.MapFrom(source => source.Metadata.HiddenTime != default(DateTime)))
                .ForMember(dest => dest.HiddenTimeUtc, opt => opt.MapFrom(source => source.Metadata.HiddenTime.CovertToNullIfMin()))
                .ForMember(dest => dest.OwnerGamertag, opt => opt.Ignore())
                .ForMember(dest => dest.ThumbnailOneImageBase64, opt => opt.Ignore())
                .ForMember(dest => dest.ThumbnailTwoImageBase64, opt => opt.Ignore())
                .ForMember(dest => dest.CarDescription, opt => opt.Ignore())
                .ReverseMap();

            this.CreateMap<WebServicesContracts.ForzaEventBlueprint, WoodstockUgcItem>()
                .ForMember(dest => dest.GeoFlags, opt => opt.MapFrom(source => source.Metadata.GeoFlags.AsEnumList<WoodstockUgcGeoFlagOption>()))
                .ForMember(dest => dest.IsPublic, opt => opt.MapFrom(source => source.Metadata.Searchable))
                .ForMember(dest => dest.Type, opt => opt.MapFrom(source => UgcType.EventBlueprint))
                .ForMember(dest => dest.Id, opt => opt.MapFrom(source => source.Metadata.GuidId))
                .ForMember(dest => dest.ShareCode, opt => opt.MapFrom(source => source.Metadata.ShareCode))
                .ForMember(dest => dest.CarId, opt => opt.MapFrom(source => source.Metadata.CarId))
                .ForMember(dest => dest.MakeId, opt => opt.MapFrom(source => source.Metadata.MakeId))
                .ForMember(dest => dest.CreatedDateUtc, opt => opt.MapFrom(source => source.Metadata.CreatedDate))
                .ForMember(dest => dest.Title, opt => opt.MapFrom(source => source.Metadata.Title))
                .ForMember(dest => dest.Description, opt => opt.MapFrom(source => source.Metadata.Description))
                .ForMember(dest => dest.FeaturedByT10, opt => opt.MapFrom(source => source.Metadata.FeaturedByT10))
                .ForMember(dest => dest.ForceFeaturedEndDateUtc, opt => opt.MapFrom(source => source.Metadata.ForceFeaturedEndDate.CovertToNullIfMin()))
                .ForMember(dest => dest.FeaturedEndDateUtc, opt => opt.MapFrom(source => source.Metadata.FeaturedEndDate.CovertToNullIfMin()))
                .ForMember(dest => dest.GameTitle, opt => opt.MapFrom(source => source.Metadata.GameTitle))
                .ForMember(dest => dest.OwnerXuid, opt => opt.MapFrom(source => source.Metadata.Owner))
                .ForMember(dest => dest.KeywordIdOne, opt => opt.MapFrom(source => source.Metadata.KeywordIdOne))
                .ForMember(dest => dest.KeywordIdTwo, opt => opt.MapFrom(source => source.Metadata.KeywordIdTwo))
                .ForMember(dest => dest.PopularityBucket, opt => opt.MapFrom(source => source.Metadata.PopularityBucket))
                .ForMember(dest => dest.ReportingState, opt => opt.MapFrom(source => source.Metadata.ReportingState))
                .ForMember(dest => dest.Type, opt => opt.MapFrom(source => source.Metadata.ContentType))
                .ForMember(dest => dest.TimesDisliked, opt => opt.MapFrom(source => source.Metadata.TimesDisliked))
                .ForMember(dest => dest.TimesLiked, opt => opt.MapFrom(source => source.Metadata.TimesLiked))
                .ForMember(dest => dest.TimesDownloaded, opt => opt.MapFrom(source => source.Metadata.TimesDownloaded))
                .ForMember(dest => dest.TimesUsed, opt => opt.MapFrom(source => source.Metadata.TimesUsed))
                .ForMember(dest => dest.IsHidden, opt => opt.MapFrom(source => source.Metadata.HiddenTime != default(DateTime)))
                .ForMember(dest => dest.HiddenTimeUtc, opt => opt.MapFrom(source => source.Metadata.HiddenTime.CovertToNullIfMin()))
                .ForMember(dest => dest.OwnerGamertag, opt => opt.Ignore())
                .ForMember(dest => dest.ThumbnailOneImageBase64, opt => opt.Ignore())
                .ForMember(dest => dest.ThumbnailTwoImageBase64, opt => opt.Ignore())
                .ForMember(dest => dest.CarDescription, opt => opt.Ignore())
                .ReverseMap();

            this.CreateMap<WebServicesContracts.ForzaUGCCommunityChallenge, WoodstockUgcItem>()
                .ForMember(dest => dest.GeoFlags, opt => opt.MapFrom(source => source.Metadata.GeoFlags.AsEnumList<WoodstockUgcGeoFlagOption>()))
                .ForMember(dest => dest.IsPublic, opt => opt.MapFrom(source => source.Metadata.Searchable))
                .ForMember(dest => dest.Type, opt => opt.MapFrom(source => UgcType.CommunityChallenge))
                .ForMember(dest => dest.Id, opt => opt.MapFrom(source => source.Metadata.GuidId))
                .ForMember(dest => dest.ShareCode, opt => opt.MapFrom(source => source.Metadata.ShareCode))
                .ForMember(dest => dest.CarId, opt => opt.MapFrom(source => source.Metadata.CarId))
                .ForMember(dest => dest.MakeId, opt => opt.MapFrom(source => source.Metadata.MakeId))
                .ForMember(dest => dest.CreatedDateUtc, opt => opt.MapFrom(source => source.Metadata.CreatedDate))
                .ForMember(dest => dest.Title, opt => opt.MapFrom(source => source.Metadata.Title))
                .ForMember(dest => dest.Description, opt => opt.MapFrom(source => source.Metadata.Description))
                .ForMember(dest => dest.FeaturedByT10, opt => opt.MapFrom(source => source.Metadata.FeaturedByT10))
                .ForMember(dest => dest.ForceFeaturedEndDateUtc, opt => opt.MapFrom(source => source.Metadata.ForceFeaturedEndDate.CovertToNullIfMin()))
                .ForMember(dest => dest.FeaturedEndDateUtc, opt => opt.MapFrom(source => source.Metadata.FeaturedEndDate.CovertToNullIfMin()))
                .ForMember(dest => dest.GameTitle, opt => opt.MapFrom(source => source.Metadata.GameTitle))
                .ForMember(dest => dest.OwnerXuid, opt => opt.MapFrom(source => source.Metadata.Owner))
                .ForMember(dest => dest.KeywordIdOne, opt => opt.MapFrom(source => source.Metadata.KeywordIdOne))
                .ForMember(dest => dest.KeywordIdTwo, opt => opt.MapFrom(source => source.Metadata.KeywordIdTwo))
                .ForMember(dest => dest.PopularityBucket, opt => opt.MapFrom(source => source.Metadata.PopularityBucket))
                .ForMember(dest => dest.ReportingState, opt => opt.MapFrom(source => source.Metadata.ReportingState))
                .ForMember(dest => dest.Type, opt => opt.MapFrom(source => source.Metadata.ContentType))
                .ForMember(dest => dest.TimesDisliked, opt => opt.MapFrom(source => source.Metadata.TimesDisliked))
                .ForMember(dest => dest.TimesLiked, opt => opt.MapFrom(source => source.Metadata.TimesLiked))
                .ForMember(dest => dest.TimesDownloaded, opt => opt.MapFrom(source => source.Metadata.TimesDownloaded))
                .ForMember(dest => dest.TimesUsed, opt => opt.MapFrom(source => source.Metadata.TimesUsed))
                .ForMember(dest => dest.IsHidden, opt => opt.MapFrom(source => source.Metadata.HiddenTime != default(DateTime)))
                .ForMember(dest => dest.HiddenTimeUtc, opt => opt.MapFrom(source => source.Metadata.HiddenTime.CovertToNullIfMin()))
                .ForMember(dest => dest.OwnerGamertag, opt => opt.Ignore())
                .ForMember(dest => dest.ThumbnailOneImageBase64, opt => opt.Ignore())
                .ForMember(dest => dest.ThumbnailTwoImageBase64, opt => opt.Ignore())
                .ForMember(dest => dest.CarDescription, opt => opt.Ignore());

            this.CreateMap<ForzaLayerGroupData, WoodstockUgcItem>()
                .ForMember(dest => dest.GeoFlags, opt => opt.MapFrom(source => source.Metadata.GeoFlags.AsEnumList<WoodstockUgcGeoFlagOption>()))
                .ForMember(dest => dest.IsPublic, opt => opt.MapFrom(source => source.Metadata.Searchable))
                .ForMember(dest => dest.Type, opt => opt.MapFrom(source => UgcType.LayerGroup))
                .ForMember(dest => dest.Id, opt => opt.MapFrom(source => source.Metadata.GuidId))
                .ForMember(dest => dest.ShareCode, opt => opt.MapFrom(source => source.Metadata.ShareCode))
                .ForMember(dest => dest.CarId, opt => opt.MapFrom(source => source.Metadata.CarId))
                .ForMember(dest => dest.MakeId, opt => opt.MapFrom(source => source.Metadata.MakeId))
                .ForMember(dest => dest.CreatedDateUtc, opt => opt.MapFrom(source => source.Metadata.CreatedDate))
                .ForMember(dest => dest.Title, opt => opt.MapFrom(source => source.Metadata.Title))
                .ForMember(dest => dest.Description, opt => opt.MapFrom(source => source.Metadata.Description))
                .ForMember(dest => dest.FeaturedByT10, opt => opt.MapFrom(source => source.Metadata.FeaturedByT10))
                .ForMember(dest => dest.ForceFeaturedEndDateUtc, opt => opt.MapFrom(source => source.Metadata.ForceFeaturedEndDate.CovertToNullIfMin()))
                .ForMember(dest => dest.FeaturedEndDateUtc, opt => opt.MapFrom(source => source.Metadata.FeaturedEndDate.CovertToNullIfMin()))
                .ForMember(dest => dest.GameTitle, opt => opt.MapFrom(source => source.Metadata.GameTitle))
                .ForMember(dest => dest.OwnerXuid, opt => opt.MapFrom(source => source.Metadata.Owner))
                .ForMember(dest => dest.KeywordIdOne, opt => opt.MapFrom(source => source.Metadata.KeywordIdOne))
                .ForMember(dest => dest.KeywordIdTwo, opt => opt.MapFrom(source => source.Metadata.KeywordIdTwo))
                .ForMember(dest => dest.PopularityBucket, opt => opt.MapFrom(source => source.Metadata.PopularityBucket))
                .ForMember(dest => dest.ReportingState, opt => opt.MapFrom(source => source.Metadata.ReportingState))
                .ForMember(dest => dest.Type, opt => opt.MapFrom(source => source.Metadata.ContentType))
                .ForMember(dest => dest.TimesDisliked, opt => opt.MapFrom(source => source.Metadata.TimesDisliked))
                .ForMember(dest => dest.TimesLiked, opt => opt.MapFrom(source => source.Metadata.TimesLiked))
                .ForMember(dest => dest.TimesDownloaded, opt => opt.MapFrom(source => source.Metadata.TimesDownloaded))
                .ForMember(dest => dest.TimesUsed, opt => opt.MapFrom(source => source.Metadata.TimesUsed))
                .ForMember(dest => dest.IsHidden, opt => opt.MapFrom(source => source.Metadata.HiddenTime != default(DateTime)))
                .ForMember(dest => dest.HiddenTimeUtc, opt => opt.MapFrom(source => source.Metadata.HiddenTime.CovertToNullIfMin()))

                // TODO: Handle ForzaCurationMethod
                .ForMember(
                    dest => dest.ThumbnailOneImageBase64,
                    opt => opt.MapFrom(source =>
                        source.Thumbnail.Length > 0
                            ? "data:image/jpeg;base64," + Convert.ToBase64String(source.Thumbnail)
                            : null))
                .ForMember(dest => dest.OwnerGamertag, opt => opt.Ignore())
                .ForMember(dest => dest.ThumbnailTwoImageBase64, opt => opt.Ignore())
                .ForMember(dest => dest.CarDescription, opt => opt.Ignore());

            this.CreateMap<WebServicesContracts.ForzaPropPrefabData, WoodstockUgcProPrefabItem>()
                .ForMember(dest => dest.PropPrefabDownloadDataBase64, opt => opt.MapFrom(source => source.PropPrefabData))
                .ForMember(dest => dest.GeoFlags, opt => opt.MapFrom(source => source.Metadata.GeoFlags.AsEnumList<WoodstockUgcGeoFlagOption>()))
                .ForMember(dest => dest.IsPublic, opt => opt.MapFrom(source => source.Metadata.Searchable))
                .ForMember(dest => dest.ThumbnailOneImageBase64, opt => opt.MapFrom(source => source.Thumbnail.Length > 0 ? "data:image/jpeg;base64," + Convert.ToBase64String(source.Thumbnail) : null))
                .ForMember(dest => dest.Type, opt => opt.MapFrom(source => UgcType.PropPrefab))
                .ForMember(dest => dest.Id, opt => opt.MapFrom(source => source.Metadata.GuidId))
                .ForMember(dest => dest.ShareCode, opt => opt.MapFrom(source => source.Metadata.ShareCode))
                .ForMember(dest => dest.CarId, opt => opt.MapFrom(source => source.Metadata.CarId))
                .ForMember(dest => dest.MakeId, opt => opt.MapFrom(source => source.Metadata.MakeId))
                .ForMember(dest => dest.CreatedDateUtc, opt => opt.MapFrom(source => source.Metadata.CreatedDate))
                .ForMember(dest => dest.Title, opt => opt.MapFrom(source => source.Metadata.Title))
                .ForMember(dest => dest.Description, opt => opt.MapFrom(source => source.Metadata.Description))
                .ForMember(dest => dest.FeaturedByT10, opt => opt.MapFrom(source => source.Metadata.FeaturedByT10))
                .ForMember(dest => dest.ForceFeaturedEndDateUtc, opt => opt.MapFrom(source => source.Metadata.ForceFeaturedEndDate.CovertToNullIfMin()))
                .ForMember(dest => dest.FeaturedEndDateUtc, opt => opt.MapFrom(source => source.Metadata.FeaturedEndDate.CovertToNullIfMin()))
                .ForMember(dest => dest.GameTitle, opt => opt.MapFrom(source => source.Metadata.GameTitle))
                .ForMember(dest => dest.OwnerXuid, opt => opt.MapFrom(source => source.Metadata.Owner))
                .ForMember(dest => dest.KeywordIdOne, opt => opt.MapFrom(source => source.Metadata.KeywordIdOne))
                .ForMember(dest => dest.KeywordIdTwo, opt => opt.MapFrom(source => source.Metadata.KeywordIdTwo))
                .ForMember(dest => dest.PopularityBucket, opt => opt.MapFrom(source => source.Metadata.PopularityBucket))
                .ForMember(dest => dest.ReportingState, opt => opt.MapFrom(source => source.Metadata.ReportingState))
                .ForMember(dest => dest.Type, opt => opt.MapFrom(source => source.Metadata.ContentType))
                .ForMember(dest => dest.TimesDisliked, opt => opt.MapFrom(source => source.Metadata.TimesDisliked))
                .ForMember(dest => dest.TimesLiked, opt => opt.MapFrom(source => source.Metadata.TimesLiked))
                .ForMember(dest => dest.TimesDownloaded, opt => opt.MapFrom(source => source.Metadata.TimesDownloaded))
                .ForMember(dest => dest.TimesUsed, opt => opt.MapFrom(source => source.Metadata.TimesUsed))
                .ForMember(dest => dest.IsHidden, opt => opt.MapFrom(source => source.Metadata.HiddenTime != default(DateTime)))
                .ForMember(dest => dest.HiddenTimeUtc, opt => opt.MapFrom(source => source.Metadata.HiddenTime.CovertToNullIfMin()))
                .ForMember(dest => dest.OwnerGamertag, opt => opt.Ignore())
                .ForMember(dest => dest.ThumbnailTwoImageBase64, opt => opt.Ignore())
                .ForMember(dest => dest.CarDescription, opt => opt.Ignore());

            this.CreateMap<ServicesLiveOps.ForzaAuction, AuctionData>()
                .ForMember(dest => dest.AuctionId, opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.TimeFlaggedUtc, opt => opt.MapFrom(src => src.TimeFlagged.DefaultAsNull()))
                .ForMember(dest => dest.CreatedDateUtc, opt => opt.MapFrom(src => src.CreatedDate))
                .ForMember(dest => dest.ClosingDateUtc, opt => opt.MapFrom(src => src.ClosingDate))
                .ForMember(dest => dest.SellerXuid, opt => opt.MapFrom(src => src.Seller))
                .ForMember(dest => dest.TopBidderXuid, opt => opt.MapFrom(src => src.TopBidder))
                .ForMember(dest => dest.Duration, opt => opt.MapFrom(src => TimeSpan.FromMilliseconds(src.DurationInMS)));

            this.CreateMap<ServicesLiveOps.ForzaBid, AuctionDataBid>()
                .ForMember(dest => dest.DateUtc, opt => opt.MapFrom(src => src.Date))
                .ReverseMap();

            this.CreateMap<ServicesLiveOps.ForzaLiveOpsCar, AuctionDataCar>()
                .ReverseMap();

            this.CreateMap<ServicesLiveOps.ForzaCarHistory, AuctionDataCarHistory>()
                .ReverseMap();

            this.CreateMap<ServicesLiveOps.ForzaAuctionStatus, AuctionReviewState>().ReverseMap();
            this.CreateMap<ServicesLiveOps.ForzaAuctionAction, AuctionDataAuctionAction>().ReverseMap();
            this.CreateMap<ServicesLiveOps.ForzaBidStatus, AuctionDataBidStatus>().ReverseMap();

            this.CreateMap<WebServicesContracts.ForzaStorefrontFile, HideableUgc>()
                .ForMember(dest => dest.HiddenUtc, opt => opt.MapFrom(src => src.HiddenTime.DefaultAsNull()))
                .ForMember(dest => dest.SubmissionUtc, opt => opt.MapFrom(src => src.SubmissionTime.DefaultAsNull()))
                .ForMember(dest => dest.UgcId, opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.PreviewUrl, opt => opt.MapFrom(src => src.PreviewPayload.ToImageDataUrl()))
                .ForMember(dest => dest.FileType, opt => opt.MapFrom(src => Enum.GetName(typeof(FileType), src.Type)))
                .ReverseMap();

            this.CreateMap<WoodstockLiveOpsContent.LeaderboardV2, Leaderboard>()
                .ForMember(dest => dest.ScoreType, opt => opt.MapFrom(src => Enum.GetName(typeof(ScoreType), src.ScoreType)))
                .ForMember(dest => dest.ScoreTypeId, opt => opt.MapFrom(src => src.ScoreType))
                .ForMember(dest => dest.ScoreboardType, opt => opt.MapFrom(src => Enum.GetName(typeof(WoodstockLiveOpsContent.ScoreboardType), src.ScoreboardType)))
                .ForMember(dest => dest.ScoreboardTypeId, opt => opt.MapFrom(src => src.ScoreboardType))
                .ForMember(dest => dest.CarClassId, opt => opt.MapFrom(src => src.ExpectedCarClass.ValueOrDefault(-1)))
                .ForMember(dest => dest.CarClass, opt => opt.Ignore())
                .ForMember(dest => dest.LastRulesChange, opt => opt.Ignore());

            this.CreateMap<ServicesLiveOps.ForzaRankedLeaderboardRow, LeaderboardScore>()
                .ForMember(dest => dest.SubmissionTimeUtc, opt => opt.MapFrom(src => src.SubmissionTime))
                .ForMember(dest => dest.CarPerformanceIndex, opt => opt.MapFrom(src => src.CarPI))
                .ForMember(dest => dest.StabilityManagement, opt => opt.MapFrom(src => src.STM))
                .ForMember(dest => dest.AntiLockBrakingSystem, opt => opt.MapFrom(src => src.ABS))
                .ForMember(dest => dest.TractionControlSystem, opt => opt.MapFrom(src => src.TCS))
                .ForMember(dest => dest.AutomaticTransmission, opt => opt.MapFrom(src => src.Auto));

            this.CreateMap<WoodstockLiveOpsContent.CarClass, CarClass>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.CarClassId));

            this.CreateMap<WoodstockLiveOpsContent.DataCar, MasterInventoryItem>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.CarId))
                .ForMember(dest => dest.Description, opt => opt.MapFrom(src => $"{src.MakeDisplayName} {src.DisplayName} ({src.Year})"))
                .ForMember(dest => dest.Quantity, opt => opt.Ignore())
                .ForMember(dest => dest.Error, opt => opt.Ignore());
            this.CreateMap<WoodstockLiveOpsContent.DataCar, SimpleCar>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.CarId))
                .ForMember(dest => dest.Model, opt => opt.MapFrom(src => src.DisplayName))
                .ForMember(dest => dest.MakeId, opt => opt.MapFrom(src => src.MakeID))
                .ForMember(dest => dest.Make, opt => opt.MapFrom(src => src.MakeDisplayName));
            this.CreateMap<WoodstockLiveOpsContent.DataCar, DetailedCar>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.CarId))
                .ForMember(dest => dest.Model, opt => opt.MapFrom(src => src.DisplayName))
                .ForMember(dest => dest.MakeId, opt => opt.MapFrom(src => src.MakeID))
                .ForMember(dest => dest.Make, opt => opt.MapFrom(src => src.MakeDisplayName))
                .ForMember(dest => dest.EnginePlacementId, opt => opt.MapFrom(src => src.EnginePlacementID))
                .ForMember(dest => dest.PowertrainId, opt => opt.MapFrom(src => src.PowertrainID))
                .ForMember(dest => dest.ClassId, opt => opt.MapFrom(src => src.ClassID))
                .ForMember(dest => dest.CarTypeId, opt => opt.MapFrom(src => src.CarTypeID))
                .ForMember(dest => dest.FamilyModelId, opt => opt.MapFrom(src => src.FamilyModelID))
                .ForMember(dest => dest.FamilySpecialId, opt => opt.MapFrom(src => src.FamilySpecialID))
                .ForMember(dest => dest.RegionId, opt => opt.MapFrom(src => src.RegionID))
                .ForMember(dest => dest.CountryId, opt => opt.MapFrom(src => src.CountryID))
                .ForMember(dest => dest.IsAvailableInAutoshow, opt => opt.MapFrom(src => src.NotAvailableInAutoshow == null || src.NotAvailableInAutoshow.Value == 0))
                .ForMember(dest => dest.PerformanceIndex, opt => opt.MapFrom(src => src.PerformanceIndex))
                .ForMember(dest => dest.PowertrainName, opt => opt.MapFrom(src => src.PowertrainName))
                .ForMember(dest => dest.CarTypeName, opt => opt.MapFrom(src => src.CarTypeName))
                .ForMember(dest => dest.CarClassName, opt => opt.MapFrom(src => src.CarClassName))
                .ForMember(dest => dest.RegionName, opt => opt.MapFrom(src => src.RegionName))
                .ForMember(dest => dest.Series, opt => opt.MapFrom(src => src.ReleaseIndex))
                .ForMember(dest => dest.ReleaseDateUtc, opt => opt.MapFrom(src => src.ReleaseDate));

            this.CreateMap<WoodstockLiveOpsContent.CarHorn, MasterInventoryItem>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.id))
                .ForMember(dest => dest.Description, opt => opt.MapFrom(src => src.DisplayName))
                .ForMember(dest => dest.Quantity, opt => opt.Ignore())
                .ForMember(dest => dest.Error, opt => opt.Ignore());

            this.CreateMap<WoodstockLiveOpsContent.VanityItem, MasterInventoryItem>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.id))
                .ForMember(dest => dest.Description, opt => opt.MapFrom(src => src.DisplayName))
                .ForMember(dest => dest.Quantity, opt => opt.Ignore())
                .ForMember(dest => dest.Error, opt => opt.Ignore());

            this.CreateMap<WoodstockLiveOpsContent.EmoteData, MasterInventoryItem>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.id))
                .ForMember(dest => dest.Description, opt => opt.MapFrom(src => src.Name))
                .ForMember(dest => dest.Quantity, opt => opt.Ignore())
                .ForMember(dest => dest.Error, opt => opt.Ignore());

            this.CreateMap<WoodstockLiveOpsContent.QuickChat, MasterInventoryItem>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.id))
                .ForMember(dest => dest.Description, opt => opt.MapFrom(src => src.ChatMessage))
                .ForMember(dest => dest.Quantity, opt => opt.Ignore())
                .ForMember(dest => dest.Error, opt => opt.Ignore());

            this.CreateMap<int, ServicesLiveOps.ForzaUserExpireBanParameters>()
                .ForMember(dest => dest.banEntryIds, opt => opt.MapFrom(src => new int[] { src }))
                .ForMember(dest => dest.Reason, opt => opt.MapFrom(src => "Ban expired by Steward"));

            this.CreateMap<ServicesLiveOps.ForzaUserUnBanResult, UnbanResult>();
            this.CreateMap<ForzaUserReportWeightType, UserReportWeightType>();
            this.CreateMap<GetUserReportWeightOutput, UserReportWeight>()
                .ForMember(dest => dest.Weight, opt => opt.MapFrom(src => src.reportWeight))
                .ForMember(dest => dest.Type, opt => opt.MapFrom(src => src.reportWeightType));
            this.CreateMap<ServicesLiveOps.ForzaLiveOpsHasPlayedRecord, HasPlayedRecord>() // Use UGC contracts GameTitle, confirmed with Caleb 6/23/22
                .ForMember(dest => dest.GameTitle, opt => opt.MapFrom(src => Enum.GetName(typeof(Turn10.UGC.Contracts.GameTitle), src.gameTitle)))
                .ReverseMap();
            this.CreateMap<ForzaUser, PlayerGameDetails>()
                .ForMember(dest => dest.LastLoginDateUtc, opt => opt.MapFrom(src => src.LastLogin))
                .ForMember(dest => dest.FirstLoginDateUtc, opt => opt.MapFrom(src => src.FirstLogin));

            this.CreateMap<string, ForzaUserIds>()
               .ForMember(dest => dest.gamertag, opt => opt.MapFrom(src => src))
               .ForMember(dest => dest.xuid, opt => opt.Ignore());

            this.CreateMap<ulong, ForzaUserIds>()
                .ForMember(dest => dest.gamertag, opt => opt.Ignore())
                .ForMember(dest => dest.xuid, opt => opt.MapFrom(src => src));

            this.CreateMap<ForzaBulkOperationType, UserGroupBulkOperationType>().ReverseMap();
            this.CreateMap<ForzaBulkOperationStatus, UserGroupBulkOperationStatus>().ReverseMap();
            this.CreateMap<ForzaUserIds, BasicPlayer>()

                // Map empty string to null
                .ForMember(dest => dest.Gamertag, opt => opt.MapFrom(src => string.IsNullOrEmpty(src.gamertag) ? null : src.gamertag))
                .ForMember(dest => dest.Xuid, opt => opt.MapFrom(src => src.xuid))
                .ForMember(dest => dest.Error, opt => opt.Ignore());
            this.CreateMap<ForzaUserGroupBulkOperationStatus, UserGroupBulkOperationStatusOutput>()
                .ForMember(dest => dest.FailedUsers, opt => opt.MapFrom(src => src.failedUsers.SelectMany(x => x.userIds).ToList()));

            this.CreateMap<WoodstockLiveOpsContent.BanConfiguration, BanConfiguration>();

            this.CreateMap<ForzaUGCDataLight, HideableUgc>()
                .ForMember(dest => dest.Title, opt => opt.MapFrom(src => src.Metadata.Title))
                .ForMember(dest => dest.Description, opt => opt.MapFrom(src => src.Metadata.Description))
                .ForMember(dest => dest.UgcId, opt => opt.MapFrom(src => src.Metadata.GuidId))
                .ForMember(dest => dest.Sharecode, opt => opt.MapFrom(src => src.Metadata.ShareCode))
                .ForMember(dest => dest.PreviewUrl, opt => opt.MapFrom(src => src.Thumbnail.ToImageDataUrl()))
                .ForMember(dest => dest.SubmissionUtc, opt => opt.MapFrom(src => src.Metadata.CreatedDate.DefaultAsNull()))
                .ForMember(dest => dest.HiddenUtc, opt => opt.MapFrom(src => src.Metadata.HiddenTime))
                .ForMember(dest => dest.FileType, opt => opt.MapFrom(src => Enum.GetName(typeof(ForzaUGCContentType), src.Metadata.ContentType)));

            this.CreateMap<ForzaUGCDataLight, WoodstockUgcItem>()
                .ForMember(dest => dest.ThumbnailOneImageBase64, opt => opt.MapFrom(source => source.Thumbnail.ToImageDataUrl()))
                .ForMember(dest => dest.ThumbnailTwoImageBase64, opt => opt.MapFrom(source => source.AdminTexture.ToImageDataUrl()))
                .ForMember(dest => dest.GeoFlags, opt => opt.MapFrom(source => source.Metadata.GeoFlags.AsEnumList<WoodstockUgcGeoFlagOption>()))
                .ForMember(dest => dest.IsPublic, opt => opt.MapFrom(source => source.Metadata.Searchable))
                .ForMember(dest => dest.Type, opt => opt.MapFrom(source => source.Metadata.ContentType))
                .ForMember(dest => dest.Id, opt => opt.MapFrom(source => source.Metadata.GuidId))
                .ForMember(dest => dest.ShareCode, opt => opt.MapFrom(source => source.Metadata.ShareCode))
                .ForMember(dest => dest.CarId, opt => opt.MapFrom(source => source.Metadata.CarId))
                .ForMember(dest => dest.MakeId, opt => opt.MapFrom(source => source.Metadata.MakeId))
                .ForMember(dest => dest.CreatedDateUtc, opt => opt.MapFrom(source => source.Metadata.CreatedDate))
                .ForMember(dest => dest.Title, opt => opt.MapFrom(source => source.Metadata.Title))
                .ForMember(dest => dest.Description, opt => opt.MapFrom(source => source.Metadata.Description))
                .ForMember(dest => dest.FeaturedByT10, opt => opt.MapFrom(source => source.Metadata.FeaturedByT10))
                .ForMember(
                    dest => dest.ForceFeaturedEndDateUtc,
                    opt => opt.MapFrom(source => source.Metadata.ForceFeaturedEndDate.CovertToNullIfMin()))
                .ForMember(
                    dest => dest.FeaturedEndDateUtc,
                    opt => opt.MapFrom(source => source.Metadata.FeaturedEndDate.CovertToNullIfMin()))
                .ForMember(dest => dest.GameTitle, opt => opt.MapFrom(source => source.Metadata.GameTitle))
                .ForMember(dest => dest.OwnerXuid, opt => opt.MapFrom(source => source.Metadata.Owner))
                .ForMember(dest => dest.KeywordIdOne, opt => opt.MapFrom(source => source.Metadata.KeywordIdOne))
                .ForMember(dest => dest.KeywordIdTwo, opt => opt.MapFrom(source => source.Metadata.KeywordIdTwo))
                .ForMember(
                    dest => dest.PopularityBucket,
                    opt => opt.MapFrom(source => source.Metadata.PopularityBucket))
                .ForMember(dest => dest.ReportingState, opt => opt.MapFrom(source => source.Metadata.ReportingState))
                .ForMember(dest => dest.Type, opt => opt.MapFrom(source => source.Metadata.ContentType))
                .ForMember(dest => dest.TimesDisliked, opt => opt.MapFrom(source => source.Metadata.TimesDisliked))
                .ForMember(dest => dest.TimesLiked, opt => opt.MapFrom(source => source.Metadata.TimesLiked))
                .ForMember(dest => dest.TimesDownloaded, opt => opt.MapFrom(source => source.Metadata.TimesDownloaded))
                .ForMember(dest => dest.TimesUsed, opt => opt.MapFrom(source => source.Metadata.TimesUsed))
                .ForMember(dest => dest.IsHidden, opt => opt.MapFrom(source => source.Metadata.IsHidden))
                .ForMember(dest => dest.HiddenTimeUtc, opt => opt.MapFrom(source => source.Metadata.HiddenTime))
                .ForMember(dest => dest.OwnerGamertag, opt => opt.Ignore())
                .ForMember(dest => dest.CarDescription, opt => opt.Ignore())
                .ReverseMap();

            this.CreateMap<ForzaTask, LspTask>()
                .ForMember(dest => dest.LastEventUtc, opt => opt.MapFrom(source => source.LastEvent))
                .ForMember(dest => dest.LockTakenUntilUtc, opt => opt.MapFrom(source => source.LockTakenUntil))
                .ForMember(dest => dest.NextExecutionUtc, opt => opt.MapFrom(source => source.NextExecution));

            this.CreateMap<LspTask, ForzaTaskUpdateParameters>()
                .ForMember(dest => dest.NextExecution, opt => opt.MapFrom(source => source.NextExecutionUtc));

            this.CreateMap<(V2BanParametersInput banParams, BanReasonGroup<FeatureAreas> banReasonGroup), ForzaUserBanParametersV2>()
                .ForMember(dest => dest.xuids, opt => opt.MapFrom(source => new ulong[] { source.banParams.Xuid }))
                .ForMember(dest => dest.DeleteLeaderboardEntries, opt => opt.MapFrom(source => source.banParams.DeleteLeaderboardEntries.Value))
                .ForMember(dest => dest.BanEntryReason, opt => opt.MapFrom(source => source.banParams.Reason))
                .ForMember(dest => dest.PegasusBanConfigurationId, opt => opt.MapFrom(source => source.banReasonGroup.BanConfigurationId))
                .ForMember(dest => dest.FeatureArea, opt => opt.MapFrom(source => source.banReasonGroup.FeatureAreas.Select(x => (uint)x).Aggregate((a, b) => a | b)))
                .ForMember(dest => dest.OverrideBanDuration, opt => opt.MapFrom(source => source.banParams.Override))
                .ForMember(dest => dest.BanDurationOverride, opt => opt.MapFrom(source => new ForzaBanDuration()
                {
                    IsDeviceBan = source.banParams.OverrideBanConsoles.Value,
                    IsPermaBan = source.banParams.OverrideDurationPermanent.Value,
                    BanDuration = source.banParams.OverrideDuration.HasValue ? new ForzaTimeSpan()
                    {
                        Days = (uint)source.banParams.OverrideDuration.Value.Days,
                        Hours = (uint)source.banParams.OverrideDuration.Value.Hours,
                        Minutes = (uint)source.banParams.OverrideDuration.Value.Minutes,
                        Seconds = (uint)source.banParams.OverrideDuration.Value.Seconds,
                    }
                    : new ForzaTimeSpan(),
                }));
        }

        private string PrepareDeviceType(string deviceType)
        {
            switch (deviceType)
            {
                case "Invalid":
                    return "Legacy";
                case "Win32":
                    return "Steam";
                default:
                    return deviceType;
            }
        }
    }
}
