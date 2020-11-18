using System;
using System.Collections.Generic;
using System.Linq;
using AutoMapper;
using Forza.WebServices.FM7.Generated;
using Turn10.LiveOps.StewardApi.Contracts.Apollo;
using Xls.Security.FM7.Generated;
using Xls.WebServices.FM7.Generated;

namespace Turn10.LiveOps.StewardApi.ProfileMappers
{
    /// <summary>
    ///    Mapper for Apollo DTOs.
    /// </summary>
    public sealed class ApolloProfileMapper : Profile
    {
        /// <summary>
        ///     Initializes a new instance of the <see cref="ApolloProfileMapper"/> class.
        /// </summary>
        public ApolloProfileMapper()
        {
            this.CreateMap<AdminForzaCarUserInventoryItem, ApolloCar>()
                .ForMember(des => des.AcquisitionUtc, opt => opt.MapFrom(src => src.acquisitionTime))
                .ForMember(des => des.LastUsedUtc, opt => opt.MapFrom(src => src.lastUsedTime))
                .ForMember(des => des.PurchaseUtc, opt => opt.MapFrom(src => src.purchaseTimestamp))
                .ReverseMap();
            this.CreateMap<AdminForzaUserInventoryItem, ApolloInventoryItem>()
                .ForMember(des => des.AcquisitionUtc, opt => opt.MapFrom(src => src.acquisitionTime))
                .ForMember(des => des.LastUsedUtc, opt => opt.MapFrom(src => src.lastUsedTime))
                .ReverseMap();
            this.CreateMap<AdminForzaUserInventorySummary, ApolloPlayerInventory>().ReverseMap();
            this.CreateMap<CompositeUser, ApolloPlayerDetails>()
                .ForMember(des => des.FirstLoginUtc, opt => opt.MapFrom(src => src.FirstLogInTime))
                .ForMember(des => des.LastLoginUtc, opt => opt.MapFrom(src => src.LastLogInTime))
                .ForMember(des => des.Xuid, opt => opt.MapFrom(src => src.qwXuid))
                .ForMember(des => des.Gamertag, opt => opt.MapFrom(src => src.wzGamerTag))
                .ForMember(des => des.IsUnderReview, opt => opt.MapFrom(src => src.IsUserUnderReview))
                .ForMember(des => des.AgeGroup, opt => opt.MapFrom(src => src.UserAgeGroup));
            this.CreateMap<AdminForzaProfile, ApolloInventoryProfile>().ReverseMap();
            this.CreateMap<ForzaUserBanSummary, ApolloBanSummary>();
            this.CreateMap<ApolloBanParameters, ForzaUserBanParameters>()
                .ForMember(dest => dest.FeatureArea, opt => opt.MapFrom(source => Enum.Parse(typeof(FeatureAreas), source.FeatureArea, true)))
                .ForMember(dest => dest.StartTime, opt => opt.MapFrom(src => src.StartTimeUtc))
                .ForMember(dest => dest.ExpireTime, opt => opt.MapFrom(src => src.ExpireTimeUtc));
            this.CreateMap<ForzaUserBanDescription, ApolloBanDescription>()
                .ForMember(dest => dest.FeatureArea, opt => opt.MapFrom(source => Enum.GetName(typeof(FeatureAreas), source.FeatureAreas)))
                .ForMember(dest => dest.StartTimeUtc, opt => opt.MapFrom(src => src.StartTime))
                .ForMember(dest => dest.ExpireTimeUtc, opt => opt.MapFrom(src => src.ExpireTime))
                .ForMember(dest => dest.LastExtendedTimeUtc, opt => opt.MapFrom(src => src.LastExtendTime))
                .ForMember(dest => dest.CountOfTimesExtended, opt => opt.MapFrom(src => src.ExtendTimes));
            this.CreateMap<ForzaUserBanResult, ApolloBanResult>();
            this.CreateMap<ForzaConsole, ApolloConsoleDetails>().ReverseMap();
            this.CreateMap<ForzaSharedConsoleUser, ApolloSharedConsoleUser>().ReverseMap();
            this.CreateMap<ForzaUserGroup, ApolloLspGroup>();
        }
    }
}
