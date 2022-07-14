using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Globalization;
using AutoMapper;
using Forza.UserInventory.FM8.Generated;
using Forza.WebServices.FM8.Generated;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Errors;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead.Pegasus;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead.RacersCup;
using Turn10.Services.LiveOps.FM8.Generated;
using Xls.Security.FM8.Generated;
using Xls.WebServices.FM8.Generated;

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
            this.CreateMap<AdminForzaCarUserInventoryItem, PlayerInventoryItem>()
                .ForMember(des => des.Id, opt => opt.MapFrom(src => src.itemId))
                .ForMember(des => des.Quantity, opt => opt.MapFrom(src => src.quantity))
                .ForMember(des => des.AcquiredUtc, opt => opt.MapFrom(src => src.acquisitionTime))
                .ReverseMap();
            this.CreateMap<AdminForzaUserInventoryItem, PlayerInventoryItem>()
                .ForMember(des => des.Id, opt => opt.MapFrom(src => src.itemId))
                .ForMember(des => des.Quantity, opt => opt.MapFrom(src => src.quantity))
                .ForMember(des => des.AcquiredUtc, opt => opt.MapFrom(src => src.acquisitionTime))
                .ReverseMap();
            this.CreateMap<AdminForzaUserInventorySummary, SteelheadPlayerInventory>()
                .ForMember(des => des.CreditRewards, opt => opt.MapFrom(src => new List<PlayerInventoryItem>
                {
                    new PlayerInventoryItem { Id = -1, Description = "Credits", Quantity = src.credits },
                }))
                .ReverseMap();
            this.CreateMap<AdminForzaProfile, SteelheadInventoryProfile>().ReverseMap();
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
                .ForMember(dest => dest.ExpirationDateUtc, opt => opt.MapFrom(src => src.ExpirationDate))
                .ReverseMap();
            this.CreateMap<DeviceType, ForzaLiveDeviceType>().ReverseMap();
            this.CreateMap<ForzaRacersCupScheduleData, RacersCupSchedule>()
                .ReverseMap();
            this.CreateMap<ForzaChampionshipDataV3, RacersCupChampionship>()
                .ForMember(dest => dest.Series, opt => opt.MapFrom(src => src.ChampionshipSeriesData))
                .ReverseMap();
            this.CreateMap<ForzaChampionshipSeriesDataV3, RacersCupSeries>()
                .ForMember(dest => dest.OpenTimeUtc, opt => opt.MapFrom(src => src.OpenTime))
                .ForMember(dest => dest.CloseTimeUtc, opt => opt.MapFrom(src => src.CloseTime))
                .ForMember(
                    dest => dest.EventPlaylistTransitionTimeUtc,
                    opt => opt.MapFrom(src => src.EventPlaylistTransitionTime))
                .ForMember(dest => dest.Events, opt => opt.MapFrom(src => src.ChampionshipEventData))
                .ReverseMap();
            this.CreateMap<ForzaBaseChampionshipEventData, RacersCupEvent>()
                .ForMember(dest => dest.EventWindows, opt => opt.MapFrom(src => src.ChampionshipEventWindows))
                .ReverseMap();
            this.CreateMap<ForzaBaseChampionshipEventWindowData, RacersCupEventWindow>()
                .ForMember(dest => dest.StartTimeUtc, opt => opt.MapFrom(src => src.StartTime))
                .ForMember(dest => dest.EndTimeUtc, opt => opt.MapFrom(src => src.EndTime))
                .ForMember(dest => dest.FeaturedRaceStartTimeUtc, opt => opt.MapFrom(src => src.FeaturedRaceStartTime));
            this.CreateMap<ForzaGameOptions, RacersCupGameOptions>()
                .ReverseMap();
            this.CreateMap<ForzaQualificationOptions, RacersCupQualificationOptions>()
                .ForMember(dest => dest.NumberOfLimitedLaps, opt => opt.MapFrom(src => src.NumLimitedLaps))
                .ReverseMap();
            this.CreateMap<ForzaWeatherCondition, RacersCupWeatherCondition>()
                .ReverseMap();
            this.CreateMap<LocalizedStringData, ForzaLocalizedStringData>().ReverseMap();
            this.CreateMap<SupportedLocale, SteelheadContent.SupportedLocale>().ReverseMap();
            this.CreateMap<LocalizationStringResult, SteelheadContent.LocalizedString>()
                .ForMember(dest => dest.LocString, opt => opt.MapFrom(src => src.LocalizedString))
                .ReverseMap();
        }
    }
}
