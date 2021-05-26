using System;
using System.Collections.Generic;
using AutoMapper;
using Forza.LiveOps.FH5_master.Generated;
using Forza.UserInventory.FH5_master.Generated;
using Turn10.LiveOps.StewardApi.Contracts;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Woodstock;
using Xls.Security.FH5_master.Generated;
using Xls.WebServices.FH5_master.Generated;

namespace Turn10.LiveOps.StewardApi.ProfileMappers
{
    /// <summary>
    ///    Mapper for Steelhead DTOs.
    /// </summary>
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
    .ReverseMap();
            this.CreateMap<AdminForzaUserInventoryItem, PlayerInventoryItem>()
                .ForMember(des => des.Id, opt => opt.MapFrom(src => src.itemId))
                .ForMember(des => des.Quantity, opt => opt.MapFrom(src => src.quantity))
                .ReverseMap();
            this.CreateMap<AdminForzaUserInventorySummary, WoodstockPlayerInventory>()
                .ForMember(des => des.CreditRewards, opt => opt.MapFrom(src => new List<PlayerInventoryItem>
                {
                    new PlayerInventoryItem { Id = -1, Description = "Credits", Quantity = src.credits },
                }))
                .ReverseMap();

            this.CreateMap<AdminForzaProfile, WoodstockInventoryProfile>().ReverseMap();
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
            this.CreateMap<ForzaUserBanResult, BanResult>();
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
        }
    }
}
