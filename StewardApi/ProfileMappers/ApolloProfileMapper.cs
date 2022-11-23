using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using AutoMapper;
using Forza.WebServices.FM7.Generated;
using Turn10.LiveOps.StewardApi.Contracts.Apollo;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Errors;
using Xls.Security.FM7.Generated;

namespace Turn10.LiveOps.StewardApi.ProfileMappers
{
    /// <summary>
    ///     Mapper for Apollo DTOs.
    /// </summary>
    [SuppressMessage("Microsoft.Maintainability", "CA1506:AvoidExcessiveClassCoupling", Justification = "High class coupling by design.")]
    public sealed class ApolloProfileMapper : Profile
    {
        /// <summary>
        ///     Initializes a new instance of the <see cref="ApolloProfileMapper"/> class.
        /// </summary>
        public ApolloProfileMapper()
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
            this.CreateMap<AdminForzaUserInventorySummary, ApolloPlayerInventory>()
                .ForMember(des => des.CreditRewards, opt => opt.MapFrom(src => new List<PlayerInventoryItem>
                {
                    new PlayerInventoryItem { Id = -1, Description = "Credits", Quantity = src.credits },
                }))
                .ReverseMap();
            this.CreateMap<CompositeUser, ApolloPlayerDetails>()
                .ForMember(des => des.FirstLoginUtc, opt => opt.MapFrom(src => src.FirstLogInTime))
                .ForMember(des => des.LastLoginUtc, opt => opt.MapFrom(src => src.LastLogInTime))
                .ForMember(des => des.Xuid, opt => opt.MapFrom(src => src.qwXuid))
                .ForMember(des => des.Gamertag, opt => opt.MapFrom(src => src.wzGamerTag))
                .ForMember(des => des.IsUnderReview, opt => opt.MapFrom(src => src.IsUserUnderReview))
                .ForMember(des => des.AgeGroup, opt => opt.MapFrom(src => src.UserAgeGroup));
            this.CreateMap<AdminForzaProfile, ApolloInventoryProfile>().ReverseMap();
            this.CreateMap<ForzaUserBanSummaryV2, BanSummary>()
                .ForMember(dest => dest.BannedAreas, opt => opt.MapFrom(src =>
                    src.BannedAreas.Select(banArea => Enum.GetName(typeof(FeatureAreas), banArea))));
            this.CreateMap<ApolloBanParametersInput, ApolloBanParameters>()
                .ForMember(dest => dest.StartTimeUtc, opt => opt.MapFrom(src => src.StartTimeUtc ?? DateTime.UtcNow))
                .ForMember(dest => dest.ExpireTimeUtc, opt => opt.MapFrom(src => (src.StartTimeUtc ?? DateTime.UtcNow) + src.Duration));
            this.CreateMap<ApolloBanParameters, ForzaUserBanParametersV2>()
                .ForMember(dest => dest.xuids, opt => opt.MapFrom(source => new ulong[] { source.Xuid }))
                .ForMember(dest => dest.FeatureArea, opt => opt.MapFrom(source => Enum.Parse(typeof(FeatureAreas), source.FeatureArea, true)))
                .ForMember(dest => dest.StartTime, opt => opt.MapFrom(src => src.StartTimeUtc))
                .ForMember(dest => dest.ExpireTime, opt => opt.MapFrom(src => src.ExpireTimeUtc));
            this.CreateMap<ForzaUserBanDescriptionV2, BanDescription>()
                .ForMember(dest => dest.FeatureArea, opt => opt.MapFrom(source => Enum.GetName(typeof(FeatureAreas), source.FeatureAreas)))
                .ForMember(dest => dest.StartTimeUtc, opt => opt.MapFrom(src => src.StartTime))
                .ForMember(dest => dest.ExpireTimeUtc, opt => opt.MapFrom(src => src.ExpireTime))
                .ForMember(dest => dest.LastExtendedTimeUtc, opt => opt.MapFrom(src => src.LastExtendTime))
                .ForMember(dest => dest.CountOfTimesExtended, opt => opt.MapFrom(src => src.ExtendTimes));
            this.CreateMap<ForzaUserBanResultV2, BanResult>()
                .ForMember(dest => dest.Error, opt => opt.MapFrom(
                    src => src.Success ? null : new ServicesFailureStewardError($"LSP failed to ban player with XUID: {src.Xuid}")));
            this.CreateMap<ForzaConsole, ConsoleDetails>().ReverseMap();
            this.CreateMap<ForzaSharedConsoleUser, SharedConsoleUser>().ReverseMap();
            this.CreateMap<ForzaUserGroup, LspGroup>();
            this.CreateMap<ApolloPlayerDetails, IdentityResultAlpha>().ReverseMap();

            this.CreateMap<ApolloGroupGift, ApolloGift>().ReverseMap();
            this.CreateMap<ApolloUserFlagsInput, ApolloUserFlags>().ReverseMap();

            this.CreateMap<UgcFilters, ForzaUGCSearchV2Request>()
                .ForMember(dest => dest.CarId, opt => opt.MapFrom(source => -1))
                .ForMember(dest => dest.KeywordIdOne, opt => opt.MapFrom(source => -1))
                .ForMember(dest => dest.KeywordIdTwo, opt => opt.MapFrom(source => -1))
                .ForMember(dest => dest.ShareStatus, opt => opt.MapFrom(source => ForzaShareFilter.Any));

            this.CreateMap<UgcType, ForzaUGCContentType>().ReverseMap();
            this.CreateMap<ForzaUGCData, ApolloUgcItem>()
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
                .ForMember(dest => dest.Type, opt => opt.MapFrom(source => UgcType.Livery))
                .ForMember(dest => dest.Id, opt => opt.MapFrom(source => source.Metadata.Id))
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

            this.CreateMap<ForzaLiveryData, ApolloUgcLiveryItem>()
                .ForMember(dest => dest.LiveryDownloadDataBase64, opt => opt.MapFrom(source => source.LiveryData))
                .ForMember(dest => dest.IsPublic, opt => opt.MapFrom(source => source.Metadata.Searchable))
                .ForMember(dest => dest.ThumbnailOneImageBase64, opt => opt.MapFrom(source => source.Thumbnail.Length > 0 ? "data:image/jpeg;base64," + Convert.ToBase64String(source.Thumbnail) : null))
                .ForMember(dest => dest.ThumbnailTwoImageBase64, opt => opt.MapFrom(source => source.AdminTexture.Length > 0 ? "data:image/jpeg;base64," + Convert.ToBase64String(source.AdminTexture) : null))
                .ForMember(dest => dest.Type, opt => opt.MapFrom(source => UgcType.Livery))
                .ForMember(dest => dest.Id, opt => opt.MapFrom(source => source.Metadata.Id))
                .ForMember(dest => dest.CarId, opt => opt.MapFrom(source => source.Metadata.CarId))
                .ForMember(dest => dest.MakeId, opt => opt.MapFrom(source => source.Metadata.MakeId))
                .ForMember(dest => dest.CreatedDateUtc, opt => opt.MapFrom(source => source.Metadata.CreatedDate))
                .ForMember(dest => dest.Title, opt => opt.MapFrom(source => source.Metadata.Title))
                .ForMember(dest => dest.Description, opt => opt.MapFrom(source => source.Metadata.Description))
                .ForMember(dest => dest.FeaturedByT10, opt => opt.MapFrom(source => source.Metadata.FeaturedByT10))
                .ForMember(dest => dest.ForceFeaturedEndDateUtc, opt => opt.MapFrom(source => source.Metadata.ForceFeaturedEndDate))
                .ForMember(dest => dest.FeaturedEndDateUtc, opt => opt.MapFrom(source => source.Metadata.FeaturedEndDate))
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

            this.CreateMap<ForzaLiveryGiftResult, GiftResponse<ulong>>()
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

            this.CreateMap<int, ForzaUserExpireBanParameters>()
                .ForMember(dest => dest.banEntryIds, opt => opt.MapFrom(src => new int[] { src }))
                .ForMember(dest => dest.Reason, opt => opt.MapFrom(src => "Ban expired by Steward"));

            this.CreateMap<ForzaUserUnBanResult, UnbanResult>();

            this.CreateMap<string, ForzaUserIds>()
              .ForMember(dest => dest.gamertag, opt => opt.MapFrom(src => src));
            this.CreateMap<ulong, ForzaUserIds>()
                .ForMember(dest => dest.xuid, opt => opt.MapFrom(src => src));

            this.CreateMap<ForzaUserIds, BasicPlayer>()
                // Map empty string to null
                .ForMember(dest => dest.Gamertag, opt => opt.MapFrom(src => string.IsNullOrEmpty(src.gamertag) ? null : src.gamertag))
                .ForMember(dest => dest.Xuid, opt => opt.MapFrom(src => src.xuid));
        }
    }
}
