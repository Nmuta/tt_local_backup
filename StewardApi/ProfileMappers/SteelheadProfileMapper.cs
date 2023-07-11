﻿using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Globalization;
using System.Linq;
using AutoMapper;
using Forza.Scoreboard.FM8.Generated;
using Forza.UserInventory.FM8.Generated;
using Forza.WebServices.FM8.Generated;
using Forza.WebServices.LiveOpsObjects.FM8.Generated;
using Microsoft.TeamFoundation.SourceControl.WebApi;
using SteelheadLiveOpsContent;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Errors;
using Turn10.LiveOps.StewardApi.Contracts.Git;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead.BuildersCup;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead.RacersCup;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead.WelcomeCenter;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead.WelcomeCenter.MessageOfTheDay;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead.WelcomeCenter.Output;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead.WelcomeCenter.Tiles;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead.WelcomeCenter.WorldOfForza;
using Turn10.LiveOps.StewardApi.Contracts.Woodstock;
using Turn10.LiveOps.StewardApi.Controllers.V2.Steelhead.Player;
using Turn10.LiveOps.StewardApi.Helpers;
using Turn10.LiveOps.StewardApi.ProfileMappers.MapConverters;
using Turn10.Services.LiveOps.FM8.Generated;
using Xls.Security.FM8.Generated;
using Xls.WebServices.FM8.Generated;
using static Turn10.Services.LiveOps.FM8.Generated.UserManagementService;
using CarClass = Turn10.LiveOps.StewardApi.Contracts.Common.CarClass;
using ServicesLiveOps = Turn10.Services.LiveOps.FM8.Generated;

namespace Turn10.LiveOps.StewardApi.ProfileMappers
{
    /// <summary>
    ///     Mapper for Steelhead DTOs.
    /// </summary>
    ///
    [SuppressMessage("Microsoft.Maintainability", "CA1506:AvoidExcessiveClassCoupling", Justification = "High class coupling by design.")]
    public sealed class SteelheadProfileMapper : Profile
    {
        /// <summary>
        ///     Initializes a new instance of the <see cref="SteelheadProfileMapper"/> class.
        /// </summary>
        public SteelheadProfileMapper()
        {
            this.CreateMap<AdminForzaUserInventoryItem, PlayerInventoryItem>()
                .ForMember(des => des.Id, opt => opt.MapFrom(src => src.itemId))
                .ForMember(des => des.Quantity, opt => opt.MapFrom(src => src.quantity))
                .ForMember(des => des.AcquiredUtc, opt => opt.MapFrom(src => src.acquisitionTime))
                .ReverseMap();
            this.CreateMap<AdminForzaUserInventorySummary, SteelheadPlayerInventory>()
                .ForMember(des => des.CreditRewards, opt => opt.MapFrom(src => new List<PlayerInventoryItem>
                {
                    new PlayerInventoryItem { Id = 0, Description = "Credits", Quantity = src.credits },
                }))
                .ReverseMap();
            this.CreateMap<ForzaUserBanSummary, BanSummary>();
            this.CreateMap<SteelheadBanParametersInput, SteelheadBanParameters>()
                .ForMember(dest => dest.StartTimeUtc, opt => opt.MapFrom(src => src.StartTimeUtc ?? DateTime.UtcNow))
                .ForMember(dest => dest.ExpireTimeUtc, opt => opt.MapFrom(src => (src.StartTimeUtc ?? DateTime.UtcNow) + src.Duration));
            this.CreateMap<SteelheadBanParameters, ForzaUserBanParameters>()
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
            this.CreateMap<ForzaConsole, ConsoleDetails>().ReverseMap();
            this.CreateMap<ForzaSharedConsoleUser, SharedConsoleUser>().ReverseMap();
            this.CreateMap<ForzaUserGroup, LspGroup>();
            this.CreateMap<SteelheadPlayerDetails, IdentityResultAlpha>().ReverseMap();
            this.CreateMap<SteelheadUserFlagsInput, SteelheadUserFlags>().ReverseMap();
            this.CreateMap<SteelheadGroupGift, SteelheadGift>().ReverseMap();
            this.CreateMap<UserData, SteelheadPlayerDetails>()
                .ForMember(dest => dest.Xuid, opt => opt.MapFrom(src => src.qwXuid))
                .ForMember(dest => dest.Gamertag, opt => opt.MapFrom(src => src.wzGamerTag))
                .ReverseMap();
            this.CreateMap<ForzaLiveOpsNotification, Notification>()
                .ForMember(dest => dest.NotificationId, opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.SentDateUtc, opt => opt.MapFrom(src => src.SentDate))
                .ForMember(dest => dest.ExpirationDateUtc, opt => opt.MapFrom(src => src.ExpirationDate))
                .ReverseMap();
            this.CreateMap<ForzaUserMessageSendResult, MessageSendResult<ulong>>()
                .ForMember(dest => dest.PlayerOrLspGroup, opt => opt.MapFrom(src => src.Xuid))
                .ForMember(dest => dest.IdentityAntecedent, opt => opt.MapFrom(src => GiftIdentityAntecedent.Xuid));

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
                .ForMember(dest => dest.TimeFlagged, opt => opt.MapFrom(source => source.Auction.TimeFlagged != default(DateTime) ? source.Auction.TimeFlagged : (DateTime?)null));
            this.CreateMap<IdentityQueryAlpha, ForzaPlayerLookupParameters>()
                .ForMember(dest => dest.UserIDType, opt => opt.MapFrom(src => src.Xuid.HasValue ? ForzaUserIdType.Xuid : ForzaUserIdType.Gamertag))
                .ForMember(dest => dest.UserID, opt => opt.MapFrom(src => src.Xuid.HasValue ? src.Xuid.ToString() : src.Gamertag));
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
            this.CreateMap<ForzaUserGroupMessage, UserGroupNotification>()
                .ForMember(dest => dest.DeviceType, opt => opt.MapFrom(src => src.DeviceType))
                .ForMember(dest => dest.SentDateUtc, opt => opt.MapFrom(src => src.SentDate))
                .ForMember(dest => dest.ExpirationDateUtc, opt => opt.MapFrom(src => src.ExpirationDate))
                .ReverseMap();
            this.CreateMap<DeviceType, ForzaLiveDeviceType>().ReverseMap();
            this.CreateMap<LocalizedStringData, ForzaLocalizedStringData>()
                .ForMember(dest => dest.MaxLength, opt => opt.MapFrom(src => 512)).ReverseMap();
            this.CreateMap<LocalizationStringResult, SteelheadLiveOpsContent.LocalizedString>()
                .ForMember(dest => dest.LocString, opt => opt.MapFrom(src => src.LocalizedString))
                .ForMember(dest => dest.SubCategory, opt => opt.MapFrom(src => src.SubCategory))
                .ForMember(dest => dest.Category, opt => opt.MapFrom(src => src.Category))
                .ForMember(dest => dest.SubCategory, opt => opt.MapFrom(src => src.SubCategory))
                .ForMember(dest => dest.MaxLength, opt => opt.MapFrom(src => src.MaxLength))
                .ConstructUsing(x => new SteelheadLiveOpsContent.LocalizedString(x.Category, x.LocalizedString, x.MaxLength, x.SubCategory));
            this.CreateMap<ForzaUserAdminComment, ProfileNote>()
                .ForMember(dest => dest.DateUtc, opt => opt.MapFrom(source => source.date))
                .ForMember(dest => dest.Author, opt => opt.MapFrom(source => source.author))
                .ForMember(dest => dest.Text, opt => opt.MapFrom(source => source.text));
            this.CreateMap<int, ForzaUserExpireBanParameters>()
                .ForMember(dest => dest.banEntryIds, opt => opt.MapFrom(src => new int[] { src }))
                .ForMember(dest => dest.Reason, opt => opt.MapFrom(src => "Ban expired by Steward"));
            this.CreateMap<ForzaUserUnBanResult, UnbanResult>();
            this.CreateMap<ForzaLiveOpsHasPlayedRecord, HasPlayedRecord>() // Use UGC contracts GameTitle, confirmed with Caleb 6/23/22
                .ForMember(dest => dest.GameTitle, opt => opt.MapFrom(src => Enum.GetName(typeof(Turn10.UGC.Contracts.GameTitle), src.gameTitle)))
                .ReverseMap();
            this.CreateMap<ServicesLiveOps.ForzaUGCData, UgcItem>()
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
                .ReverseMap();
            this.CreateMap<ForzaLiveryData, UgcLiveryItem>()
                .ForMember(dest => dest.LiveryDownloadDataBase64, opt => opt.MapFrom(source => source.LiveryData))
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
                .ReverseMap();
            this.CreateMap<ForzaPhotoData, UgcItem>()
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
                .ReverseMap();
            this.CreateMap<ForzaTuneBlob, UgcTuneBlobItem>()
                .ForMember(dest => dest.TuneBlobDownloadDataBase64, opt => opt.MapFrom(source => source.TuneData))
                .ForMember(dest => dest.IsPublic, opt => opt.MapFrom(source => source.Metadata.Searchable))
                .ForMember(dest => dest.Type, opt => opt.MapFrom(source => UgcType.TuneBlob))
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
                .ReverseMap();
            this.CreateMap<UgcFilters, ServicesLiveOps.ForzaUGCSearchRequest>()
                .ForMember(dest => dest.CarId, opt => opt.MapFrom(source => UgcSearchConstants.NoCarId))
                .ForMember(dest => dest.KeywordIdOne, opt => opt.MapFrom(source => UgcSearchConstants.NoKeywordId))
                .ForMember(dest => dest.KeywordIdTwo, opt => opt.MapFrom(source => UgcSearchConstants.NoKeywordId))
                .ForMember(dest => dest.ShowBothUnfeaturedAndFeatured, opt => opt.MapFrom(source => true))
                .ReverseMap();
            this.CreateMap<UgcSearchFilters, ServicesLiveOps.ForzaUGCSearchRequest>()
                .ForMember(dest => dest.ManualKeywords, opt => opt.MapFrom(source => source.Keywords))
                .ForMember(dest => dest.Featured, opt => opt.MapFrom(source => source.IsFeatured))
                .ForMember(dest => dest.ShowBothUnfeaturedAndFeatured, opt => opt.MapFrom(source => !source.IsFeatured))
                .ForMember(dest => dest.KeywordIdOne, opt => opt.MapFrom(source => UgcSearchConstants.NoKeywordId))
                .ForMember(dest => dest.KeywordIdTwo, opt => opt.MapFrom(source => UgcSearchConstants.NoKeywordId))
                .ReverseMap();
            this.CreateMap<SteelheadLiveOpsContent.DataCar, MasterInventoryItem>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.CarId))
                .ForMember(dest => dest.Description, opt => opt.MapFrom(src => $"{src.MakeDisplayName} {src.DisplayName} ({src.Year})"));
            this.CreateMap<SteelheadLiveOpsContent.DataCar, SimpleCar>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.CarId))
                .ForMember(dest => dest.Model, opt => opt.MapFrom(src => src.DisplayName))
                .ForMember(dest => dest.MakeId, opt => opt.MapFrom(src => src.MakeID))
                .ForMember(dest => dest.Make, opt => opt.MapFrom(src => src.MakeDisplayName));
            this.CreateMap<SteelheadLiveOpsContent.VanityItem, MasterInventoryItem>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.VanityItemId))
                .ForMember(dest => dest.Description, opt => opt.MapFrom(src => src.Name));
            this.CreateMap<ForzaUserReportWeightType, UserReportWeightType>();
            this.CreateMap<GetUserReportWeightOutput, UserReportWeight>()
                .ForMember(dest => dest.Weight, opt => opt.MapFrom(src => src.reportWeight))
                .ForMember(dest => dest.Type, opt => opt.MapFrom(src => src.reportWeightType));
            this.CreateMap<ForzaUser, PlayerGameDetails>()
                .ForMember(dest => dest.LastLoginDateUtc, opt => opt.MapFrom(src => src.LastLogin))
                .ForMember(dest => dest.FirstLoginDateUtc, opt => opt.MapFrom(src => src.FirstLogin));
            this.CreateMap<string, ForzaUserIds>()
               .ForMember(dest => dest.gamertag, opt => opt.MapFrom(src => src));
            this.CreateMap<ulong, ForzaUserIds>()
                .ForMember(dest => dest.xuid, opt => opt.MapFrom(src => src));
            this.CreateMap<ForzaBulkOperationType, UserGroupBulkOperationType>().ReverseMap();
            this.CreateMap<ForzaBulkOperationStatus, UserGroupBulkOperationStatus>().ReverseMap();
            this.CreateMap<SteelheadLiveOpsContent.DateTimeRange, WelcomeCenterDateTimeRange>()
                .ForMember(dest => dest.FromUtc, opt => opt.MapFrom(src => src.From))
                .ForMember(dest => dest.ToUtc, opt => opt.MapFrom(src => src.To));
            this.CreateMap<(WoFTileConfigBase tile, WoFTileCMSBase tileInfo), WelcomeCenterTileOutput>()
                .ForMember(dest => dest.Size, opt => opt.MapFrom(src => src.tile.Size))
                .ForMember(dest => dest.TileFriendlyName, opt => opt.MapFrom(src => src.tileInfo.FriendlyName))
                .ForMember(dest => dest.TileTitle, opt => opt.MapFrom(src => src.tileInfo.TileTitle))
                .ForMember(dest => dest.TileType, opt => opt.MapFrom(src => src.tileInfo.TileType))
                .ForMember(dest => dest.TileDescription, opt => opt.MapFrom(src => src.tileInfo.TileDescription))
                .ForMember(dest => dest.TileImagePath, opt => opt.MapFrom(src => src.tileInfo.TileImagePath))
                .ForMember(dest => dest.TileTelemetryTag, opt => opt.MapFrom(src => src.tileInfo.TelemetryTag))
                .ForMember(dest => dest.StartEndDateUtc, opt => opt.MapFrom(src => src.tileInfo.StartEndDate));
            this.CreateMap<MotdEntry, MotdBridge>()
                .ReverseMap();
            this.CreateMap<LocalizedStringBridge, LocEntry>()
                .ForMember(dest => dest.MaxLength, opt => opt.MapFrom(src => 512))
                .ForMember(dest => dest.id, opt => opt.MapFrom(src => Guid.NewGuid()))
                .ForMember(dest => dest.Category, opt => opt.MapFrom(src => src.Category))
                .ForMember(dest => dest.SubCategory, opt => opt.MapFrom(src => src.SubCategory))
                .ForPath(dest => dest.LocString.locdef, opt => opt.MapFrom(src => Guid.NewGuid()))
                .ForPath(dest => dest.LocString.skiploc, opt => opt.MapFrom(src => false))
                .ForPath(dest => dest.LocString.@base, opt => opt.MapFrom(src => src.TextToLocalize))
                .ForPath(dest => dest.LocString.description, opt => opt.MapFrom(src => src.Description));

            this.CreateMap<LocTextMotdNoDesc, LocTextBridge>()
                .ForMember(dest => dest.Description, act => act.Ignore())
                .ReverseMap();
            this.CreateMap<LocTextMotd, LocTextBridge>()
                .ReverseMap();
            this.CreateMap<WofGenericPopupEntry, WofGenericPopupBridge>()
                .ReverseMap();
            this.CreateMap<WofDeeplinkEntry, WofDeeplinkBridge>()
                .ForMember(dest => dest.Destination, opt => opt.MapFrom(src => this.PrepareBridgeDestination(src.Destination)));
            this.CreateMap<WofDeeplinkBridge, WofDeeplinkEntry>()
                .ForMember(dest => dest.Destination, opt => opt.MapFrom(src => this.PrepareRootDestination(src)));

            this.CreateMap<LocTextBaseWof, LocTextBridge>()
                .ReverseMap();
            this.CreateMap<WofImageTextEntry, WofImageTextBridge>()
                .ReverseMap();
            this.CreateMap<WofTimerBridge, WofBaseTimer>()
                .ReverseMap();
            this.CreateMap<TextOverrideBridge, TextOverride>()
                .ReverseMap();
            this.CreateMap<WofDisplayConditionsBridge, WofBaseDisplayConditions>()
                .ReverseMap();
            this.CreateMap<ItemBridge, BaseItem>()
                .ReverseMap();
            this.CreateMap<WofBaseTimerReference, TimerReferenceBridge>().ConvertUsing<XmlToBridgeConverterTimerReference>();
            this.CreateMap<TimerReferenceBridge, WofBaseTimerReference>().ConvertUsing<BridgeToXmlConverterTimerReference>();
            this.CreateMap<WofBaseTimerCustomRange, TimerCustomRangeBridge>()
                .ReverseMap();
            this.CreateMap<WofBaseRangePoint, RangePointBridge>()
                .ForMember(dest => dest.DateUtc, opt => opt.MapFrom(src => src.Text))
                .ReverseMap();

            this.CreateMap<ForzaUserIds, BasicPlayer>()
                // Map empty string to null
                .ForMember(dest => dest.Gamertag, opt => opt.MapFrom(src => string.IsNullOrEmpty(src.gamertag) ? null : src.gamertag))
                .ForMember(dest => dest.Xuid, opt => opt.MapFrom(src => src.xuid));
            this.CreateMap<ForzaUserGroupBulkOperationStatus, UserGroupBulkOperationStatusOutput>()
                .ForMember(dest => dest.FailedUsers, opt => opt.MapFrom(src => src.failedUsers.SelectMany(x => x.userIds).ToList()));

            this.CreateMap<SteelheadLiveOpsContent.RivalEvent, Leaderboard>()
                .ForMember(dest => dest.GameScoreboardId, opt => opt.MapFrom(src => src.RivalEventId))
                .ForMember(dest => dest.TrackId, opt => opt.MapFrom(src => src.Track))
                .ForMember(dest => dest.ScoreboardType, opt => opt.MapFrom(src => ScoreboardType.Rivals.ToString()))
                .ForMember(dest => dest.ScoreboardTypeId, opt => opt.MapFrom(src => (int)ScoreboardType.Rivals))
                .ForMember(dest => dest.ScoreType, opt => opt.MapFrom(src => src.ScoreType))
                .ForMember(dest => dest.ScoreTypeId, opt => opt.MapFrom(src => src.ScoreType))
                .ForMember(dest => dest.CarClassId, opt => opt.MapFrom(src => (int)src.Buckets.Select(x => x.CarRestrictions.CarClassId).First()));

            this.CreateMap<SteelheadLiveOpsContent.RivalEvent, RivalsEvent>()
                .ForMember(dest => dest.TrackId, opt => opt.MapFrom(src => src.Track))
                .ForMember(dest => dest.Category, opt => opt.MapFrom(src => src.EventCategory))
                .ForMember(dest => dest.StartTime, opt => opt.MapFrom(src => src.StartEndDate.From))
                .ForMember(dest => dest.EndTime, opt => opt.MapFrom(src => src.StartEndDate.To))
                .ForMember(dest => dest.CarRestrictions, opt => opt.MapFrom(src => src.Buckets.Select(x => x.CarRestrictions.Name).ToList()));

            this.CreateMap<SteelheadLiveOpsContent.CarClass, CarClass>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.CarClassId));

            this.CreateMap<ServicesLiveOps.ForzaRankedLeaderboardRow, LeaderboardScore>()
                .ForMember(dest => dest.SubmissionTimeUtc, opt => opt.MapFrom(src => src.SubmissionTime))
                .ForMember(dest => dest.CarPerformanceIndex, opt => opt.MapFrom(src => src.CarPI))
                .ForMember(dest => dest.StabilityManagement, opt => opt.MapFrom(src => src.STM))
                .ForMember(dest => dest.AntiLockBrakingSystem, opt => opt.MapFrom(src => src.ABS))
                .ForMember(dest => dest.TractionControlSystem, opt => opt.MapFrom(src => src.TCS))
                .ForMember(dest => dest.AutomaticTransmission, opt => opt.MapFrom(src => src.Auto));

            this.CreateMap<WindowData, RacersCupEventWindow>()
                .ForMember(dest => dest.StartTimeUtc, opt => opt.MapFrom(src => src.StartTime))
                .ForMember(dest => dest.EndTimeUtc, opt => opt.MapFrom(src => src.EndTime))
                .ForMember(dest => dest.FeaturedRaceStartTimeUtc, opt => opt.MapFrom(src => src.FeaturedRaceStartTime));
            this.CreateMap<SteelheadLiveOpsContent.QualificationOptions, RacersCupQualificationOptions>()
                .ForMember(dest => dest.QualificationLimitType, opt => opt.MapFrom(src => src.QualificationLimitType))
                .ForMember(dest => dest.NumberOfLimitedLaps, opt => opt.MapFrom(src => src.NumLimitedLaps))
                .ForMember(dest => dest.IsOneShot, opt => opt.MapFrom(src => src.IsOneShot));
            this.CreateMap<SteelheadLiveOpsContent.GameOptions, RacersCupGameOptions>()
                .ForMember(dest => dest.StartRaceWeatherCondition, opt => opt.MapFrom(src => src.StartRaceWeatherConditionId))
                .ForMember(dest => dest.MidRaceWeatherCondition, opt => opt.MapFrom(src => src.MidRaceWeatherConditionId))
                .ForMember(dest => dest.EndRaceWeatherCondition, opt => opt.MapFrom(src => src.EndRaceWeatherConditionId))
                .ReverseMap();
            this.CreateMap<SteelheadLiveOpsContent.WeatherCondition, RacersCupWeatherCondition>()
                .ReverseMap();
            this.CreateMap<SteelheadLiveOpsContent.EWeatherConditionType, RacersCupWeatherConditionType>();

            this.CreateMap<SteelheadLiveOpsContent.CarRestrictions, Contracts.Steelhead.BuildersCup.CarRestrictions>()
                .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Name))
                .ForMember(dest => dest.CarClassId, opt => opt.MapFrom(src => (int)src.CarClassId))
                .ForMember(dest => dest.CarClassName, opt => opt.MapFrom(src => src.CarClassId));
            this.CreateMap<SteelheadLiveOpsContent.BuildersCupSeriesDataV3, BuildersCupChampionshipSeries>()
                .ForMember(dest => dest.OpenTimeUtc, opt => opt.MapFrom(src => src.OpenTime))
                .ForMember(dest => dest.CloseTimeUtc, opt => opt.MapFrom(src => src.CloseTime))
                .ForMember(dest => dest.AllowedCars, opt => opt.MapFrom(src =>
                    src.SelectableCars.GetType() == typeof(AcceptlistCarRestrictionsProvider) ?
                        (src.SelectableCars as AcceptlistCarRestrictionsProvider).Acceptlist :
                        new List<DataCar>()))
                .ForMember(dest => dest.AllowedCarClass, opt => opt.MapFrom(src =>
                    src.SelectableCars.GetType() == typeof(RefCarRestrictionsProvider) ?
                        (src.SelectableCars as RefCarRestrictionsProvider).CarRestrictions :
                        null));
            this.CreateMap<SteelheadLiveOpsContent.BuildersCupLadderDataV3, BuildersCupFeaturedTour>()
                .ForMember(dest => dest.IsDisabled, opt => opt.MapFrom(src => src.LadderDisabled))
                .ForMember(dest => dest.OpenTimeUtc, opt => opt.MapFrom(src => src.OpenTime))
                .ForMember(dest => dest.CloseTimeUtc, opt => opt.MapFrom(src => src.CloseTime))
                .ForMember(dest => dest.ChampionshipSeries, opt => opt.MapFrom(src => src.ChampionshipSeriesData));

            this.CreateMap<GitPullRequest, PullRequest>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(source => source.PullRequestId))
                .ForMember(dest => dest.WebUrl, opt => opt.MapFrom(source => $"{source.Repository.WebUrl}/pullrequest/{source.PullRequestId}"))
                .ForMember(dest => dest.CreationDateUtc, opt => opt.MapFrom(source => source.CreationDate));

            this.CreateMap<LiveOpsService.GetDriverLevelOutput, SteelheadDriverLevel>()
                .ForMember(dest => dest.ExperiencePoints, opt => opt.MapFrom(source => source.driverExperiencePoints));

            this.CreateMap<SteelheadLoyaltyRewardsTitle, ForzaLoyaltyRewardsSupportedTitles>().ReverseMap();

            this.CreateMap<(PlayerInventoryItem item, InventoryItemType itemType), ForzaUserInventoryItemWrapper>()
                .ForMember(dest => dest.ItemType, opt => opt.MapFrom(source => source.itemType))
                .ForPath(dest => dest.Item.quantity, opt => opt.MapFrom(source => source.item.Quantity))
                .ForPath(dest => dest.Item.itemId, opt => opt.MapFrom(source => source.item.Id))
                .ForPath(dest => dest.Item.itemSource, opt => opt.MapFrom(source => ForzaInventoryItemSource.Steward))
                .ForPath(dest => dest.Item.acquisitionTime, opt => opt.MapFrom(source => DateTime.UtcNow))
                .ForPath(dest => dest.Item.lastUsedTime, opt => opt.MapFrom(source => DateTime.UtcNow));

            this.CreateMap<ForzaUserInventoryItemWrapper, PlayerInventoryItem>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(source => source.Item.itemId))
                .ForMember(dest => dest.Quantity, opt => opt.MapFrom(source => source.Item.quantity))
                .ForMember(dest => dest.AcquiredUtc, opt => opt.MapFrom(source => source.Item.acquisitionTime));

            this.CreateMap<PlayerInventoryCarItem, AdminForzaCarUserInventoryItem>()
                .ForMember(dest => dest.inventoryItemSource, opt => opt.MapFrom(source => ForzaInventoryItemSource.Steward))
                .ForMember(dest => dest.acquisitionType, opt => opt.MapFrom(source => ForzaItemAcquisitionType.NA))
                .ForMember(dest => dest.itemId, opt => opt.MapFrom(source => source.Id))
                .ForMember(dest => dest.carId, opt => opt.MapFrom(source => source.Id))
                .ForMember(dest => dest.clientCarInfo, opt => opt.MapFrom(source => Array.Empty<byte>()))
                .ForMember(dest => dest.versionedLiveryId, opt => opt.MapFrom(source => source.VersionedLiveryId.HasValue ? source.VersionedLiveryId.Value : Guid.Empty))
                .ForMember(dest => dest.versionedTuneId, opt => opt.MapFrom(source => source.VersionedTuneId.HasValue ? source.VersionedTuneId.Value : Guid.Empty));

            this.CreateMap<AdminForzaCarUserInventoryItem, PlayerInventoryCarItem>()
                .ForMember(des => des.Id, opt => opt.MapFrom(src => src.itemId))
                .ForMember(des => des.AcquiredUtc, opt => opt.MapFrom(src => src.acquisitionTime));

            this.CreateMap<ForzaProfile, SteelheadInventoryProfile>()
                .ForMember(dest => dest.IsCurrent, opt => opt.MapFrom(source => source.isLastLoggedInProfile))
                .ForMember(dest => dest.TitleName, opt => opt.MapFrom(source => Enum.GetName(typeof(ForzaMotorsportTitleId), source.titleId)));

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
                                $"LSP failed to gift livery to player with XUID: {source.xuid}")
                        }));

            this.CreateMap<ForzaSafetyRatingLetterGrade, SafetyRatingGrade>();
            this.CreateMap<ForzaSafetyRating, SafetyRating>()
                .ForMember(dest => dest.Score, opt => opt.MapFrom(source => source.scoreValue));

            this.CreateMap<ForzaPlayerSkillRatingSummary, SkillRatingSummary>();

            this.CreateMap<ForzaUGCDataLight, UgcItem>()
                .ForMember(dest => dest.ThumbnailOneImageBase64, opt => opt.MapFrom(source => source.Thumbnail.ToImageDataUrl()))
                .ForMember(dest => dest.ThumbnailTwoImageBase64, opt => opt.MapFrom(source => source.AdminTexture.ToImageDataUrl()))
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
                .ReverseMap();
        }

        private DeeplinkDestination PrepareBridgeDestination(WofBaseDestination destination)
        {
            if (destination.type == "WorldOfForza.WoFToBuildersCupConfig")
            {
                return new BuildersCupDestination()
                {
                    SettingType = this.PrepareBuildersCupSettingType(destination.Setting),
                    Championship = destination.Setting.Championship?.@ref,
                    Ladder = destination.Setting.Ladder?.@ref,
                    Series = destination.Setting.Series?.@ref,
                    DestinationType = DestinationType.BuildersCup
                };
            }

            if (destination.type == "WorldOfForza.WoFToRacersCupConfig")
            {
                return new RacersCupDestination()
                {
                    Series = destination.Series.@ref,
                    DestinationType = DestinationType.RacersCup
                };
            }

            if (destination.type == "WorldOfForza.WoFToShowroomConfig")
            {
                return new ShowroomDestination()
                {
                    SettingType = this.PrepareShowroomSettingType(destination.Setting),
                    Car = destination.Setting.Car?.@ref,
                    Manufacturer = destination.Setting.Manufacturer?.@ref,
                    DestinationType = DestinationType.Showroom
                };
            }

            if (destination.type == "WorldOfForza.WoFToRivalsConfig")
            {
                return new RivalsDestination()
                {
                    SettingType = this.PrepareRivalsSettingType(destination.Setting),
                    Category = destination.Setting.Category?.@ref,
                    Event = destination.Setting.Event?.@ref,
                    DestinationType = DestinationType.Rivals
                };
            }

            if (destination.type == "WorldOfForza.WoFToPatchNotesConfig")
            {
                return new PatchNotesDestination()
                {
                    DestinationType = DestinationType.PatchNotes
                };
            }

            if (destination.type == "WorldOfForza.WoFToStoreConfig")
            {
                return new StoreDestination()
                {
                    SettingType = this.PrepareStoreSettingType(destination.Setting),
                    Product = destination.Setting.Product?.@ref,
                    DestinationType = DestinationType.Store
                };
            }

            throw new NotImplementedException();
        }

        private BuildersCupSettingType PrepareBuildersCupSettingType(DeeplinkDestinationSetting setting)
        {
            if (setting.type == "WorldOfForza.BuildersCupDeeplinkHomepageConfigSetting")
            {
                return BuildersCupSettingType.Homepage;
            }

            if (setting.type == "WorldOfForza.BuildersCupDeeplinkLadderConfigSetting")
            {
                return BuildersCupSettingType.Ladder;
            }

            if (setting.type == "WorldOfForza.BuildersCupDeeplinkSeriesConfigSetting")
            {
                return BuildersCupSettingType.Series;
            }

            throw new NotImplementedException();
        }

        private RivalsSettingType PrepareRivalsSettingType(DeeplinkDestinationSetting setting)
        {
            if (setting.type == "WorldOfForza.RivalsDeeplinkHomepageConfigSetting")
            {
                return RivalsSettingType.Homepage;
            }

            if (setting.type == "WorldOfForza.RivalsDeeplinkCategoryConfigSetting")
            {
                return RivalsSettingType.Category;
            }

            if (setting.type == "WorldOfForza.RivalsDeeplinkEventConfigSetting")
            {
                return RivalsSettingType.Event;
            }

            throw new NotImplementedException();
        }

        private ShowroomSettingType PrepareShowroomSettingType(DeeplinkDestinationSetting setting)
        {
            if (setting.type == "WorldOfForza.ShowroomDeeplinkHomepageConfigSetting")
            {
                return ShowroomSettingType.Homepage;
            }

            if (setting.type == "WorldOfForza.ShowroomDeeplinkCarConfigSetting")
            {
                return ShowroomSettingType.Car;
            }

            if (setting.type == "WorldOfForza.ShowroomDeeplinkManufacturerConfigSetting")
            {
                return ShowroomSettingType.Manufacturer;
            }

            throw new NotImplementedException();
        }

        private StoreSettingType PrepareStoreSettingType(DeeplinkDestinationSetting setting)
        {
            if (setting.type == "WorldOfForza.StoreDeeplinkHomepageConfigSetting")
            {
                return StoreSettingType.Homepage;
            }

            if (setting.type == "WorldOfForza.StoreDeeplinkProductConfigSetting")
            {
                return StoreSettingType.Product;
            }

            throw new NotImplementedException();
        }

        private WofBaseDestination PrepareRootDestination(WofDeeplinkBridge deeplinkBridge)
        {
            if (deeplinkBridge.Destination is RacersCupDestination racersCupDestination)
            {
                return new WofBaseDestination()
                {
                    type = "WorldOfForza.WoFToRacersCupConfig",
                    Series = new DeeplinkDestinationRacersCupSeries() { @ref = racersCupDestination.Series },
                    SeriesId = new DeeplinkDestinationSeriesId(),
                };
            }

            if (deeplinkBridge.Destination is ShowroomDestination showroomDestination)
            {
                DeeplinkDestinationSetting settings = null;
                if (showroomDestination.SettingType == ShowroomSettingType.Homepage)
                {
                    settings = new DeeplinkDestinationSetting()
                    {
                        type = "WorldOfForza.ShowroomDeeplinkHomepageConfigSetting"
                    };
                }

                if (showroomDestination.SettingType == ShowroomSettingType.Car)
                {
                    settings = new DeeplinkDestinationSetting()
                    {
                        Car = new DeeplinkDestinationShowroomCar() { @ref = showroomDestination.Car.Value },
                        type = "WorldOfForza.ShowroomDeeplinkCarConfigSetting",
                    };
                }

                if (showroomDestination.SettingType == ShowroomSettingType.Manufacturer)
                {
                    settings = new DeeplinkDestinationSetting()
                    {
                        Manufacturer = new DeeplinkDestinationShowroomManufacturer() { @ref = showroomDestination.Manufacturer.Value },
                        type = "WorldOfForza.ShowroomDeeplinkManufacturerConfigSetting",
                    };
                }

                return new WofBaseDestination()
                {
                    type = "WorldOfForza.WoFToShowroomConfig",
                    Setting = settings,
                    CarId = new DeeplinkDestinationCarId(),
                    CategoryId = new DeeplinkDestinationCategoryId()
                };
            }

            if (deeplinkBridge.Destination is BuildersCupDestination buildersCupDestination)
            {
                DeeplinkDestinationSetting settings = null;
                if (buildersCupDestination.SettingType == BuildersCupSettingType.Homepage)
                {
                    settings = new DeeplinkDestinationSetting()
                    {
                        type = "WorldOfForza.BuildersCupDeeplinkHomepageConfigSetting"
                    };
                }

                if (buildersCupDestination.SettingType == BuildersCupSettingType.Ladder)
                {
                    settings = new DeeplinkDestinationSetting()
                    {
                        Championship = new DeeplinkDestinationBuildersCupChampionship() { @ref = buildersCupDestination.Championship.Value },
                        Ladder = new DeeplinkDestinationBuildersCupLadder() { @ref = buildersCupDestination.Ladder.Value },
                        type = "WorldOfForza.BuildersCupDeeplinkLadderConfigSetting",
                    };
                }

                if (buildersCupDestination.SettingType == BuildersCupSettingType.Series)
                {
                    settings = new DeeplinkDestinationSetting()
                    {
                        Championship = new DeeplinkDestinationBuildersCupChampionship() { @ref = buildersCupDestination.Championship.Value },
                        Series = new DeeplinkDestinationBuildersCupSeries() { @ref = buildersCupDestination.Series.Value },
                        type = "WorldOfForza.BuildersCupDeeplinkSeriesConfigSetting"
                    };
                }

                return new WofBaseDestination()
                {
                    Setting = settings,
                    type = "WorldOfForza.WoFToBuildersCupConfig",
                    CupId = new DeeplinkDestinationCupId(),
                    SeriesId = new DeeplinkDestinationSeriesId(),
                    LadderId = new DeeplinkDestinationLadderId(),
                };
            }

            if (deeplinkBridge.Destination is PatchNotesDestination patchNotesDestination)
            {
                return new WofBaseDestination()
                {
                    type = "WorldOfForza.WoFToPatchNotesConfig",
                };
            }

            if (deeplinkBridge.Destination is RivalsDestination rivalsDestination)
            {
                DeeplinkDestinationSetting settings = null;
                if (rivalsDestination.SettingType == RivalsSettingType.Homepage)
                {
                    settings = new DeeplinkDestinationSetting()
                    {
                        type = "WorldOfForza.RivalsDeeplinkHomepageConfigSetting"
                    };
                }

                if (rivalsDestination.SettingType == RivalsSettingType.Event)
                {
                    settings = new DeeplinkDestinationSetting()
                    {
                        Category = new DeeplinkDestinationRivalsCategory() { @ref = rivalsDestination.Category.Value },
                        Event = new DeeplinkDestinationRivalsEvent() { @ref = rivalsDestination.Event.Value },
                        type = "WorldOfForza.RivalsDeeplinkEventConfigSetting",
                    };
                }

                if (rivalsDestination.SettingType == RivalsSettingType.Category)
                {
                    settings = new DeeplinkDestinationSetting()
                    {
                        Category = new DeeplinkDestinationRivalsCategory() { @ref = rivalsDestination.Category.Value },
                        type = "WorldOfForza.RivalsDeeplinkCategoryConfigSetting"
                    };
                }

                return new WofBaseDestination()
                {
                    Setting = settings,
                    type = "WorldOfForza.WoFToRivalsConfig",
                    EventId = new DeeplinkDestinationEventId(),
                    CategoryTitle = new LocTextBaseWof(),
                };
            }

            if (deeplinkBridge.Destination is StoreDestination storeDestination)
            {
                DeeplinkDestinationSetting settings = null;
                if (storeDestination.SettingType == StoreSettingType.Homepage)
                {
                    settings = new DeeplinkDestinationSetting()
                    {
                        type = "WorldOfForza.StoreDeeplinkHomepageConfigSetting"
                    };
                }

                if (storeDestination.SettingType == StoreSettingType.Product)
                {
                    settings = new DeeplinkDestinationSetting()
                    {
                        Product = new DeeplinkDestinationStoreProduct() { @ref = storeDestination.Product.Value },
                        type = "WorldOfForza.StoreDeeplinkProductConfigSetting",
                    };
                }

                return new WofBaseDestination()
                {
                    Setting = settings,
                    type = "WorldOfForza.WoFToStoreConfig",
                    Product = new DeeplinkDestinationProduct()
                };
            }

            return null;
        }
    }
}
