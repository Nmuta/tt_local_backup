﻿using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Globalization;
using System.Linq;
using AutoMapper;
using Forza.LiveOps.FH5_main.Generated;
using Forza.Scoreboard.FH5_main.Generated;
using Forza.UserGeneratedContent.FH5_main.Generated;
using Forza.UserInventory.FH5_main.Generated;
using Forza.WebServices.RareCarShopTransactionObjects.FH5_main.Generated;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Common.AuctionDataEndpoint;
using Turn10.LiveOps.StewardApi.Contracts.Data;
using Turn10.LiveOps.StewardApi.Contracts.Errors;
using Turn10.LiveOps.StewardApi.Contracts.Woodstock;
using Turn10.LiveOps.StewardApi.Helpers;
using Xls.Security.FH5_main.Generated;
using Xls.WebServices.FH5_main.Generated;
using LiveOpsContracts = Forza.LiveOps.FH5_main.Generated;
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
            this.CreateMap<AdminForzaCarUserInventoryItem, PlayerInventoryItem>()
                .ForMember(des => des.Id, opt => opt.MapFrom(src => src.itemId))
                .ForMember(des => des.Quantity, opt => opt.MapFrom(src => src.quantity))
                .ForMember(dest => dest.AcquiredUtc, opt => opt.MapFrom(src => src.acquisitionTime))
                .ReverseMap();
            this.CreateMap<AdminForzaUserInventoryItem, PlayerInventoryItem>()
                .ForMember(des => des.Id, opt => opt.MapFrom(src => src.itemId))
                .ForMember(des => des.Quantity, opt => opt.MapFrom(src => src.quantity))
                .ForMember(dest => dest.AcquiredUtc, opt => opt.MapFrom(src => src.acquisitionTime))
                .ReverseMap();
            this.CreateMap<AdminForzaUserInventorySummary, WoodstockPlayerInventory>()
                .ForMember(des => des.CreditRewards, opt => opt.MapFrom(src => new List<PlayerInventoryItem>
                {
                    new PlayerInventoryItem { Id = -1, Description = "Credits", Quantity = src.credits },
                    new PlayerInventoryItem { Id = -1, Description = "WheelSpins", Quantity = src.wheelSpins },
                    new PlayerInventoryItem { Id = -1, Description = "SuperWheelSpins", Quantity = src.superWheelSpins },
                    new PlayerInventoryItem { Id = -1, Description = "SkillPoints", Quantity = src.skillPoints },
                }))
                .ReverseMap();
            this.CreateMap<AdminForzaProfile, WoodstockInventoryProfile>()
                .ForMember(dest => dest.DeviceType, opt => opt.MapFrom(src => this.PrepareDeviceType(src.deviceType)))
                .ReverseMap();
            this.CreateMap<ForzaUserBanSummary, BanSummary>();
            this.CreateMap<WoodstockBanParametersInput, WoodstockBanParameters>()
                .ForMember(dest => dest.StartTimeUtc, opt => opt.MapFrom(src => src.StartTimeUtc ?? DateTime.UtcNow))
                .ForMember(dest => dest.ExpireTimeUtc, opt => opt.MapFrom(src => (src.StartTimeUtc ?? DateTime.UtcNow) + src.Duration));
            this.CreateMap<WoodstockBanParameters, ForzaUserBanParameters>()
                .ForMember(dest => dest.xuids, opt => opt.MapFrom(source => new ulong[] { source.Xuid }))
                .ForMember(dest => dest.FeatureArea, opt => opt.MapFrom(source => Enum.Parse(typeof(FeatureAreas), source.FeatureArea, true)))
                .ForMember(dest => dest.StartTime, opt => opt.MapFrom(src => src.StartTimeUtc))
                .ForMember(dest => dest.ExpireTime, opt => opt.MapFrom(src => src.ExpireTimeUtc));
            this.CreateMap<ForzaUserBanDescription, BanDescription>()
                .ForMember(dest => dest.FeatureArea, opt => opt.MapFrom(source => Enum.GetName(typeof(FeatureAreas), source.FeatureAreas)))
                .ForMember(dest => dest.StartTimeUtc, opt => opt.MapFrom(src => src.StartTime))
                .ForMember(dest => dest.ExpireTimeUtc, opt => opt.MapFrom(src => src.ExpireTime))
                .ForMember(dest => dest.LastExtendedTimeUtc, opt => opt.MapFrom(src => src.LastExtendTime))
                .ForMember(dest => dest.CountOfTimesExtended, opt => opt.MapFrom(src => src.ExtendTimes));
            this.CreateMap<ForzaUserBanResult, BanResult>()
                .ForMember(dest => dest.Error, opt => opt.MapFrom(
                    src => src.Success ? null : new ServicesFailureStewardError($"LSP failed to ban player with XUID: {src.Xuid}")));
            this.CreateMap<WebServicesContracts.ForzaProfileSummary, ProfileSummary>()
                .ForMember(dest => dest.HackFlags, opt => opt.MapFrom(src => src.HackFlags.Select(t => t.Name)));
            this.CreateMap<WebServicesContracts.ForzaCredityUpdateEntry, CreditUpdate>().ReverseMap();
            this.CreateMap<ForzaConsole, ConsoleDetails>().ReverseMap();
            this.CreateMap<ForzaSharedConsoleUser, SharedConsoleUser>().ReverseMap();
            this.CreateMap<ForzaUserGroup, LspGroup>();
            this.CreateMap<WoodstockPlayerDetails, IdentityResultAlpha>().ReverseMap();
            this.CreateMap<WoodstockUserFlagsInput, WoodstockUserFlags>().ReverseMap();
            this.CreateMap<WoodstockGroupGift, WoodstockGift>().ReverseMap();
            this.CreateMap<UserData, WoodstockPlayerDetails>()
                .ForMember(dest => dest.Xuid, opt => opt.MapFrom(src => src.qwXuid))
                .ForMember(dest => dest.Gamertag, opt => opt.MapFrom(src => src.wzGamerTag))
                .ReverseMap();
            this.CreateMap<WebServicesContracts.RareCarTicketBalance, WoodstockAccountInventory>()
                .ForMember(dest => dest.BackstagePasses, opt => opt.MapFrom(src => src.OfflineBalance))
                .ReverseMap();
            this.CreateMap<WebServicesContracts.RareCarShopTransaction, BackstagePassUpdate>()
                .ForMember(dest => dest.CreatedAtUtc, opt => opt.MapFrom(src => src.CreatedAt))
                .ForMember(dest => dest.BackstagePassAmount, opt => opt.MapFrom(src => src.OfflineTicketAmount))
                .ForMember(dest => dest.TransactionType, opt => opt.MapFrom(src => Enum.GetName(typeof(Operation), src.TransactionType)))
                .ReverseMap();
            this.CreateMap<LiveOpsContracts.LiveOpsNotification, Notification>()
                .ForMember(dest => dest.NotificationId, opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.SentDateUtc, opt => opt.MapFrom(src => src.SentDate))
                .ForMember(dest => dest.ExpirationDateUtc, opt => opt.MapFrom(src => src.ExpirationDate))
                .ReverseMap();
            this.CreateMap<ForzaUserGroupMessage, UserGroupNotification>()
                .ForMember(dest => dest.DeviceType, opt => opt.MapFrom(src => src.DeviceType))
                .ForMember(dest => dest.SentDateUtc, opt => opt.MapFrom(src => src.SentDate))
                .ForMember(dest => dest.ExpirationDateUtc, opt => opt.MapFrom(src => src.ExpirationDate))
                .ReverseMap();
            this.CreateMap<ForzaUserMessageSendResult, MessageSendResult<ulong>>()
                .ForMember(dest => dest.PlayerOrLspGroup, opt => opt.MapFrom(src => src.Xuid))
                .ForMember(dest => dest.IdentityAntecedent, opt => opt.MapFrom(src => GiftIdentityAntecedent.Xuid));
            this.CreateMap<ForzaUserAdminComment, ProfileNote>()
                .ForMember(dest => dest.DateUtc, opt => opt.MapFrom(source => source.date))
                .ForMember(dest => dest.Author, opt => opt.MapFrom(source => source.author))
                .ForMember(dest => dest.Text, opt => opt.MapFrom(source => source.text));
            this.CreateMap<AuctionFilters, ForzaAuctionFilters>()
                .ForMember(dest => dest.IncludeThumbnail, opt => opt.MapFrom(source => true))
                .ForMember(dest => dest.IncludeAdminTexture, opt => opt.MapFrom(source => true))
                .ForMember(dest => dest.CarId, opt => opt.MapFrom(source => source.CarId))
                .ForMember(dest => dest.MakeId, opt => opt.MapFrom(source => source.MakeId))
                .ForMember(dest => dest.AuctionStatus, opt => opt.MapFrom(source => source.Status))
                .ForMember(dest => dest.OrderBy, opt => opt.MapFrom(source => source.Sort == AuctionSort.ClosingDateAscending ? ForzaSearchOrderBy.ClosingDateAsc : ForzaSearchOrderBy.ClosingDateDesc));

            this.CreateMap<ForzaAuctionWithFileData, PlayerAuction>()
                .ForMember(dest => dest.TextureMapImageBase64, opt => opt.MapFrom(source => source.AdminTexture.Length > 0 ? "data:image/jpeg;base64," + Convert.ToBase64String(source.AdminTexture) : null))
                .ForMember(dest => dest.LiveryImageBase64, opt => opt.MapFrom(source => source.LargeThumbnail.Length > 0 ? "data:image/jpeg;base64," + Convert.ToBase64String(source.LargeThumbnail) : null))
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
                .ForMember(dest => dest.TimeFlagged, opt => opt.MapFrom(source => source.Auction.TimeFlagged != default ? source.Auction.TimeFlagged : (DateTime?)null));
            this.CreateMap<IdentityQueryAlpha, ForzaPlayerLookupParameters>()
                .ForMember(dest => dest.UserIDType, opt => opt.MapFrom(
                    src => src.Xuid.HasValue ? ForzaUserIdType.Xuid : ForzaUserIdType.Gamertag))
                .ForMember(dest => dest.UserID, opt => opt.MapFrom(
                    src => src.Xuid.HasValue ? src.Xuid.ToString() : src.Gamertag));
            this.CreateMap<ForzaPlayerLookupParameters, IdentityQueryAlpha>()
                .ForMember(dest => dest.Xuid, opt => opt.MapFrom(
                    src => src.UserIDType == ForzaUserIdType.Xuid ? (ulong?)Convert.ToUInt64(src.UserID, CultureInfo.InvariantCulture) : null))
                .ForMember(dest => dest.Gamertag, opt => opt.MapFrom(
                    src => src.UserIDType == ForzaUserIdType.Gamertag ? src.UserID : null));
            this.CreateMap<ForzaPlayerLookupResult, IdentityResultAlpha>()
                .ForMember(dest => dest.Query, opt => opt.MapFrom(src => src.Request))
                .ForMember(dest => dest.Error, opt => opt.MapFrom(
                    src => src.PlayerExists ? null :
                        new NotFoundStewardError(
                            $"No player found for {src.Request.UserIDType}: {src.Request.UserID}.")))
                .ForMember(dest => dest.Gamertag, opt => opt.MapFrom(src => src.PlayerExists ? src.Gamertag : null))
                .ForMember(dest => dest.Xuid, opt => opt.MapFrom(src => src.PlayerExists ? src.Xuid : 0))
                .ReverseMap();

            this.CreateMap<ForzaLiveryGiftResult, GiftResponse<ulong>>()
                .ForMember(dest => dest.PlayerOrLspGroup, opt => opt.MapFrom(source => source.xuid))
                .ForMember(dest => dest.IdentityAntecedent, opt => opt.MapFrom(source => GiftIdentityAntecedent.Xuid))
                .ForMember(dest => dest.Errors, opt => opt.MapFrom(source =>
                        source.Success
                            ? new List<StewardError>()
                            : new List<StewardError>
                            {
                                new ServicesFailureStewardError(
                                    $"LSP failed to gift livery to player with XUID: {source.xuid}")
                            }));

            this.CreateMap<ForzaAuctionBlocklistEntry, AuctionBlockListEntry>()
                .ForMember(dest => dest.ExpireDateUtc, opt => opt.MapFrom(src => src.ExpireDate))
                .ReverseMap();
            this.CreateMap<DeviceType, ForzaLiveDeviceType>().ReverseMap();

            this.CreateMap<UGCFilters, ForzaUGCSearchRequest>().ReverseMap();
            this.CreateMap<UGCType, ForzaUGCContentType>().ReverseMap();
            this.CreateMap<ForzaUGCData, UgcItem>()
                .ForMember(dest => dest.IsPublic, opt => opt.MapFrom(source => source.Metadata.Searchable))
                .ForMember(
                    dest => dest.ThumbnailImageOneBase64,
                    opt => opt.MapFrom(source =>
                        source.Payloads.Length > 0
                            ? "data:image/jpeg;base64," + Convert.ToBase64String(source.Payloads[0].Payload)
                            : null))
                .ForMember(
                    dest => dest.ThumbnailImageTwoBase64,
                    opt => opt.MapFrom(source =>
                        source.Payloads.Length > 1
                            ? "data:image/jpeg;base64," + Convert.ToBase64String(source.Payloads[1].Payload)
                            : null))
                .ForMember(dest => dest.Type, opt => opt.MapFrom(source => UGCType.Livery))
                .ForMember(dest => dest.Id, opt => opt.MapFrom(source => source.Metadata.Id))
                .ForMember(dest => dest.GuidId, opt => opt.MapFrom(source => source.Metadata.GuidId))
                .ForMember(dest => dest.ShareCode, opt => opt.MapFrom(source => source.Metadata.ShareCode))
                .ForMember(dest => dest.CarId, opt => opt.MapFrom(source => source.Metadata.CarId))
                .ForMember(dest => dest.MakeId, opt => opt.MapFrom(source => source.Metadata.MakeId))
                .ForMember(dest => dest.CreatedDateUtc, opt => opt.MapFrom(source => source.Metadata.CreatedDate))
                .ForMember(dest => dest.Title, opt => opt.MapFrom(source => source.Metadata.Title))
                .ForMember(dest => dest.Description, opt => opt.MapFrom(source => source.Metadata.Description))
                .ForMember(dest => dest.FeaturedByT10, opt => opt.MapFrom(source => source.Metadata.FeaturedByT10))
                .ForMember(
                    dest => dest.ForceFeaturedEndDateUtc,
                    opt => opt.MapFrom(source => source.Metadata.ForceFeaturedEndDate))
                .ForMember(
                    dest => dest.FeaturedEndDateUtc,
                    opt => opt.MapFrom(source => source.Metadata.FeaturedEndDate))
                .ForMember(dest => dest.GameTitle, opt => opt.MapFrom(source => source.Metadata.GameTitle))
                .ForMember(dest => dest.Owner, opt => opt.MapFrom(source => source.Metadata.Owner))
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
                .ReverseMap();

            this.CreateMap<ForzaLiveryData, UgcItem>()
                .ForMember(dest => dest.IsPublic, opt => opt.MapFrom(source => source.Metadata.Searchable))
                .ForMember(dest => dest.ThumbnailImageOneBase64, opt => opt.MapFrom(source => source.Thumbnail.Length > 0 ? "data:image/jpeg;base64," + Convert.ToBase64String(source.Thumbnail) : null))
                .ForMember(dest => dest.ThumbnailImageTwoBase64, opt => opt.MapFrom(source => source.AdminTexture.Length > 0 ? "data:image/jpeg;base64," + Convert.ToBase64String(source.AdminTexture) : null))
                .ForMember(dest => dest.Type, opt => opt.MapFrom(source => UGCType.Livery))
                .ForMember(dest => dest.Id, opt => opt.MapFrom(source => source.Metadata.Id))
                .ForMember(dest => dest.GuidId, opt => opt.MapFrom(source => source.Metadata.GuidId))
                .ForMember(dest => dest.ShareCode, opt => opt.MapFrom(source => source.Metadata.ShareCode))
                .ForMember(dest => dest.CarId, opt => opt.MapFrom(source => source.Metadata.CarId))
                .ForMember(dest => dest.MakeId, opt => opt.MapFrom(source => source.Metadata.MakeId))
                .ForMember(dest => dest.CreatedDateUtc, opt => opt.MapFrom(source => source.Metadata.CreatedDate))
                .ForMember(dest => dest.Title, opt => opt.MapFrom(source => source.Metadata.Title))
                .ForMember(dest => dest.Description, opt => opt.MapFrom(source => source.Metadata.Description))
                .ForMember(dest => dest.FeaturedByT10, opt => opt.MapFrom(source => source.Metadata.FeaturedByT10))
                .ForMember(dest => dest.ForceFeaturedEndDateUtc, opt => opt.MapFrom(source => source.Metadata.ForceFeaturedEndDate))
                .ForMember(dest => dest.FeaturedEndDateUtc, opt => opt.MapFrom(source => source.Metadata.FeaturedEndDate))
                .ForMember(dest => dest.GameTitle, opt => opt.MapFrom(source => source.Metadata.GameTitle))
                .ForMember(dest => dest.Owner, opt => opt.MapFrom(source => source.Metadata.Owner))
                .ForMember(dest => dest.KeywordIdOne, opt => opt.MapFrom(source => source.Metadata.KeywordIdOne))
                .ForMember(dest => dest.KeywordIdTwo, opt => opt.MapFrom(source => source.Metadata.KeywordIdTwo))
                .ForMember(dest => dest.PopularityBucket, opt => opt.MapFrom(source => source.Metadata.PopularityBucket))
                .ForMember(dest => dest.ReportingState, opt => opt.MapFrom(source => source.Metadata.ReportingState))
                .ForMember(dest => dest.Type, opt => opt.MapFrom(source => source.Metadata.ContentType))
                .ForMember(dest => dest.TimesDisliked, opt => opt.MapFrom(source => source.Metadata.TimesDisliked))
                .ForMember(dest => dest.TimesLiked, opt => opt.MapFrom(source => source.Metadata.TimesLiked))
                .ForMember(dest => dest.TimesDownloaded, opt => opt.MapFrom(source => source.Metadata.TimesDownloaded))
                .ForMember(dest => dest.TimesUsed, opt => opt.MapFrom(source => source.Metadata.TimesUsed))
                .ReverseMap();

            this.CreateMap<ForzaPhotoData, UgcItem>()
                .ForMember(dest => dest.IsPublic, opt => opt.MapFrom(source => source.Metadata.Searchable))
                .ForMember(dest => dest.ThumbnailImageOneBase64, opt => opt.MapFrom(source => source.PhotoData.Length > 0 ? "data:image/jpeg;base64," + Convert.ToBase64String(source.PhotoData) : null))
                .ForMember(dest => dest.Type, opt => opt.MapFrom(source => UGCType.Photo))
                .ForMember(dest => dest.Id, opt => opt.MapFrom(source => source.Metadata.Id))
                .ForMember(dest => dest.GuidId, opt => opt.MapFrom(source => source.Metadata.GuidId))
                .ForMember(dest => dest.ShareCode, opt => opt.MapFrom(source => source.Metadata.ShareCode))
                .ForMember(dest => dest.CarId, opt => opt.MapFrom(source => source.Metadata.CarId))
                .ForMember(dest => dest.MakeId, opt => opt.MapFrom(source => source.Metadata.MakeId))
                .ForMember(dest => dest.CreatedDateUtc, opt => opt.MapFrom(source => source.Metadata.CreatedDate))
                .ForMember(dest => dest.Title, opt => opt.MapFrom(source => source.Metadata.Title))
                .ForMember(dest => dest.Description, opt => opt.MapFrom(source => source.Metadata.Description))
                .ForMember(dest => dest.FeaturedByT10, opt => opt.MapFrom(source => source.Metadata.FeaturedByT10))
                .ForMember(dest => dest.ForceFeaturedEndDateUtc, opt => opt.MapFrom(source => source.Metadata.ForceFeaturedEndDate))
                .ForMember(dest => dest.FeaturedEndDateUtc, opt => opt.MapFrom(source => source.Metadata.FeaturedEndDate))
                .ForMember(dest => dest.GameTitle, opt => opt.MapFrom(source => source.Metadata.GameTitle))
                .ForMember(dest => dest.Owner, opt => opt.MapFrom(source => source.Metadata.Owner))
                .ForMember(dest => dest.KeywordIdOne, opt => opt.MapFrom(source => source.Metadata.KeywordIdOne))
                .ForMember(dest => dest.KeywordIdTwo, opt => opt.MapFrom(source => source.Metadata.KeywordIdTwo))
                .ForMember(dest => dest.PopularityBucket, opt => opt.MapFrom(source => source.Metadata.PopularityBucket))
                .ForMember(dest => dest.ReportingState, opt => opt.MapFrom(source => source.Metadata.ReportingState))
                .ForMember(dest => dest.Type, opt => opt.MapFrom(source => source.Metadata.ContentType))
                .ForMember(dest => dest.TimesDisliked, opt => opt.MapFrom(source => source.Metadata.TimesDisliked))
                .ForMember(dest => dest.TimesLiked, opt => opt.MapFrom(source => source.Metadata.TimesLiked))
                .ForMember(dest => dest.TimesDownloaded, opt => opt.MapFrom(source => source.Metadata.TimesDownloaded))
                .ForMember(dest => dest.TimesUsed, opt => opt.MapFrom(source => source.Metadata.TimesUsed))
                .ReverseMap();

            this.CreateMap<ForzaTuneData, UgcItem>()
                .ForMember(dest => dest.IsPublic, opt => opt.MapFrom(source => source.Metadata.Searchable))
                .ForMember(dest => dest.Type, opt => opt.MapFrom(source => UGCType.Photo))
                .ForMember(dest => dest.Id, opt => opt.MapFrom(source => source.Metadata.Id))
                .ForMember(dest => dest.GuidId, opt => opt.MapFrom(source => source.Metadata.GuidId))
                .ForMember(dest => dest.ShareCode, opt => opt.MapFrom(source => source.Metadata.ShareCode))
                .ForMember(dest => dest.CarId, opt => opt.MapFrom(source => source.Metadata.CarId))
                .ForMember(dest => dest.MakeId, opt => opt.MapFrom(source => source.Metadata.MakeId))
                .ForMember(dest => dest.CreatedDateUtc, opt => opt.MapFrom(source => source.Metadata.CreatedDate))
                .ForMember(dest => dest.Title, opt => opt.MapFrom(source => source.Metadata.Title))
                .ForMember(dest => dest.Description, opt => opt.MapFrom(source => source.Metadata.Description))
                .ForMember(dest => dest.FeaturedByT10, opt => opt.MapFrom(source => source.Metadata.FeaturedByT10))
                .ForMember(dest => dest.ForceFeaturedEndDateUtc, opt => opt.MapFrom(source => source.Metadata.ForceFeaturedEndDate))
                .ForMember(dest => dest.FeaturedEndDateUtc, opt => opt.MapFrom(source => source.Metadata.FeaturedEndDate))
                .ForMember(dest => dest.GameTitle, opt => opt.MapFrom(source => source.Metadata.GameTitle))
                .ForMember(dest => dest.Owner, opt => opt.MapFrom(source => source.Metadata.Owner))
                .ForMember(dest => dest.KeywordIdOne, opt => opt.MapFrom(source => source.Metadata.KeywordIdOne))
                .ForMember(dest => dest.KeywordIdTwo, opt => opt.MapFrom(source => source.Metadata.KeywordIdTwo))
                .ForMember(dest => dest.PopularityBucket, opt => opt.MapFrom(source => source.Metadata.PopularityBucket))
                .ForMember(dest => dest.ReportingState, opt => opt.MapFrom(source => source.Metadata.ReportingState))
                .ForMember(dest => dest.Type, opt => opt.MapFrom(source => source.Metadata.ContentType))
                .ForMember(dest => dest.TimesDisliked, opt => opt.MapFrom(source => source.Metadata.TimesDisliked))
                .ForMember(dest => dest.TimesLiked, opt => opt.MapFrom(source => source.Metadata.TimesLiked))
                .ForMember(dest => dest.TimesDownloaded, opt => opt.MapFrom(source => source.Metadata.TimesDownloaded))
                .ForMember(dest => dest.TimesUsed, opt => opt.MapFrom(source => source.Metadata.TimesUsed))
                .ReverseMap();

            this.CreateMap<DeviceType, ForzaLiveDeviceType>().ReverseMap();

            this.CreateMap<ForzaAuction, AuctionData>()
                .ForMember(dest => dest.AuctionId, opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.TimeFlaggedUtc, opt => opt.MapFrom(src => src.TimeFlagged.DefaultAsNull()))
                .ForMember(dest => dest.CreatedDateUtc, opt => opt.MapFrom(src => src.CreatedDate))
                .ForMember(dest => dest.ClosingDateUtc, opt => opt.MapFrom(src => src.ClosingDate))
                .ForMember(dest => dest.SellerXuid, opt => opt.MapFrom(src => src.Seller))
                .ForMember(dest => dest.TopBidderXuid, opt => opt.MapFrom(src => src.TopBidder))
                .ForMember(dest => dest.Duration, opt => opt.MapFrom(src => TimeSpan.FromMilliseconds(src.DurationInMS)));

            this.CreateMap<ForzaBid, AuctionDataBid>()
                .ForMember(dest => dest.DateUtc, opt => opt.MapFrom(src => src.Date))
                .ReverseMap();

            this.CreateMap<ForzaLiveOpsCar, AuctionDataCar>()
                .ReverseMap();

            this.CreateMap<Forza.FH5_main.Generated.CarHistory, AuctionDataCarHistory>()
                .ReverseMap();

            this.CreateMap<ForzaAuctionStatus, AuctionReviewState>().ReverseMap();
            this.CreateMap<ForzaAuctionAction, AuctionDataAuctionAction>().ReverseMap();
            this.CreateMap<ForzaBidStatus, AuctionDataBidStatus>().ReverseMap();

            this.CreateMap<WebServicesContracts.ForzaStorefrontFile, HideableUgc>()
                .ForMember(dest => dest.HiddenUtc, opt => opt.MapFrom(src => src.HiddenTime.DefaultAsNull()))
                .ForMember(dest => dest.SubmissionUtc, opt => opt.MapFrom(src => src.SubmissionTime.DefaultAsNull()))
                .ForMember(dest => dest.UgcId, opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.PreviewUrl, opt => opt.MapFrom(src => src.PreviewPayload.ToImageDataUrl()))
                .ForMember(dest => dest.FileType, opt => opt.MapFrom(src => Enum.GetName(typeof(FileType), src.Type)))
                .ReverseMap();

            this.CreateMap<PegasusLeaderboard, Leaderboard>()
                .ForMember(dest => dest.ScoreType, opt => opt.MapFrom(src => Enum.GetName(typeof(ScoreType), src.ScoreType)))
                .ForMember(dest => dest.ScoreTypeId, opt => opt.MapFrom(src => src.ScoreType))
                .ForMember(dest => dest.ScoreboardType, opt => opt.MapFrom(src => Enum.GetName(typeof(ScoreboardType), src.ScoreboardType)))
                .ForMember(dest => dest.ScoreboardTypeId, opt => opt.MapFrom(src => src.ScoreboardType))
                .ForMember(dest => dest.CarClassId, opt => opt.MapFrom(src => src.ExpectedCarClass.ValueOrDefault(-1)));

            this.CreateMap<ForzaRankedLeaderboardRow, LeaderboardScore>()
                .ForMember(dest => dest.SubmissionTimeUtc, opt => opt.MapFrom(src => src.SubmissionTime))
                .ForMember(dest => dest.CarPerformanceIndex, opt => opt.MapFrom(src => src.CarPI))
                .ForMember(dest => dest.StabilityManagement, opt => opt.MapFrom(src => src.STM))
                .ForMember(dest => dest.AntiLockBrakingSystem, opt => opt.MapFrom(src => src.ABS))
                .ForMember(dest => dest.TractionControlSystem, opt => opt.MapFrom(src => src.TCS))
                .ForMember(dest => dest.AutomaticTransmission, opt => opt.MapFrom(src => src.Auto));
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
