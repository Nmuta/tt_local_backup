using System;
using System.Collections.Generic;
using System.Linq;
using AutoMapper;
using Forza.WebServices.FM7.Generated;
using Turn10.LiveOps.StewardApi.Contracts;
using Turn10.LiveOps.StewardApi.Contracts.Apollo;
using Turn10.LiveOps.StewardApi.Contracts.Data;
using Turn10.LiveOps.StewardApi.Providers;
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

            this.CreateMap<AdminForzaCarUserInventoryItem, MasterInventoryItem>()
               .ForMember(des => des.Id, opt => opt.MapFrom(src => src.itemId))
                .ForMember(des => des.Quantity, opt => opt.MapFrom(src => src.quantity))
               .ReverseMap();
            this.CreateMap<AdminForzaUserInventoryItem, MasterInventoryItem>()
                .ForMember(des => des.Id, opt => opt.MapFrom(src => src.itemId))
                .ForMember(des => des.Quantity, opt => opt.MapFrom(src => src.quantity))
                .ReverseMap();
            this.CreateMap<AdminForzaUserInventorySummary, ApolloMasterInventory>()
                .ForMember(des => des.CreditRewards, opt => opt.MapFrom(src => new List<MasterInventoryItem>()
                {
                    new MasterInventoryItem { Id = -1, Description = "Credits", Quantity = src.credits }
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
            this.CreateMap<ForzaUserBanSummary, ApolloBanSummary>();
            this.CreateMap<ApolloBanParametersInput, ApolloBanParameters>()
                .ForMember(dest => dest.StartTimeUtc, opt => opt.MapFrom(src => src.StartTimeUtc ?? DateTime.UtcNow))
                .ForMember(dest => dest.ExpireTimeUtc, opt => opt.MapFrom(src => (src.StartTimeUtc ?? DateTime.UtcNow) + src.Duration));
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
            this.CreateMap<ApolloPlayerDetails, IdentityResultAlpha>().ReverseMap();

            this.CreateMap<ApolloGroupGift, ApolloGift>().ReverseMap();
            this.CreateMap<ApolloCar, MasterInventoryItem>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(source => source.ItemId));
            this.CreateMap<ApolloInventoryItem, MasterInventoryItem>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(source => source.ItemId));
            this.CreateMap<ApolloPlayerInventory, ApolloGift>()
                .ForMember(dest => dest.GiftReason, opt => opt.MapFrom(source => source.GiftReason))
                .ForMember(dest => dest.Inventory, opt => opt.MapFrom((source, destObj, destMem, context) => new ApolloMasterInventory()
                {
                    CreditRewards = new List<MasterInventoryItem>()
                    {
                        new MasterInventoryItem() { Description = "Credits", Quantity = source.Credits, Id = -1 },
                    },
                    Cars = context.Mapper.Map<IList<MasterInventoryItem>>(source.Cars),
                    VanityItems = context.Mapper.Map<IList<MasterInventoryItem>>(source.VanityItems),
                }))
                .ReverseMap();
            this.CreateMap<ApolloUserFlagsInput, ApolloUserFlags>().ReverseMap();
        }
    }
}
