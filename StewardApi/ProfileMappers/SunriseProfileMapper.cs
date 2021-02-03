﻿using System;
using System.Collections.Generic;
using System.Linq;
using Forza.WebServices.FH4.master.Generated;
using Turn10.LiveOps.StewardApi.Contracts;
using Turn10.LiveOps.StewardApi.Contracts.Legacy;
using Turn10.LiveOps.StewardApi.Contracts.Sunrise;
using Turn10.LiveOps.StewardApi.Providers;
using Xls.Security.FH4.master.Generated;
using Xls.WebServices.FH4.master.Generated;

namespace Turn10.LiveOps.StewardApi.ProfileMappers
{
    /// <summary>
    ///     Mapper for Sunrise DTO's.
    /// </summary>
    public sealed class SunriseProfileMapper : AutoMapper.Profile
    {
        /// <summary>
        ///       Initializes a new instance of the <see cref="SunriseProfileMapper"/> class.
        /// </summary>
        public SunriseProfileMapper()
        {
            this.CreateMap<AdminForzaCarUserInventoryItem, SunriseCar>()
                .ForMember(dest => dest.PurchaseUtc, opt => opt.MapFrom(src => src.purchaseTimestamp))
                .ForMember(dest => dest.AcquisitionUtc, opt => opt.MapFrom(src => src.acquisitionTime))
                .ForMember(dest => dest.LastUsedUtc, opt => opt.MapFrom(src => src.lastUsedTime))
                .ReverseMap();
            this.CreateMap<AdminForzaUserInventoryItem, SunriseInventoryItem>()
                .ForMember(dest => dest.AcquisitionUtc, opt => opt.MapFrom(src => src.acquisitionTime))
                .ForMember(dest => dest.LastUsedUtc, opt => opt.MapFrom(src => src.lastUsedTime))
                .ReverseMap();
            this.CreateMap<SunrisePlayerInventory, AdminForzaUserInventorySummary>().ReverseMap();
            this.CreateMap<UserData, SunrisePlayerDetails>()
                .ForMember(dest => dest.Xuid, opt => opt.MapFrom(src => src.qwXuid))
                .ForMember(dest => dest.Gamertag, opt => opt.MapFrom(src => src.wzGamerTag))
                .ReverseMap();
            this.CreateMap<ForzaConsole, SunriseConsoleDetails>().ReverseMap();
            this.CreateMap<ForzaSharedConsoleUser, SunriseSharedConsoleUser>().ReverseMap();
            this.CreateMap<ForzaUserBanResult, SunriseBanResult>();
            this.CreateMap<ForzaUserBanSummary, SunriseBanSummary>();
            this.CreateMap<IList<SunriseBanParametersInput>, SunriseBanParameters>()
                .ForMember(dest => dest.Reason, opt => opt.MapFrom(src => src.First().Reason))
                .ForMember(dest => dest.FeatureArea, opt => opt.MapFrom(src => src.First().FeatureArea))
                .ForMember(dest => dest.Xuids, opt => opt.MapFrom(src => src.Select(v => v.Xuid).Where(xuid => xuid != default)))
                .ForMember(dest => dest.Gamertags, opt => opt.MapFrom(src => src.Select(v => v.Gamertag).Where(gamertag => gamertag != default)))
                .ForMember(dest => dest.BanAllConsoles, opt => opt.MapFrom(src => src.First().BanAllConsoles))
                .ForMember(dest => dest.BanAllPcs, opt => opt.MapFrom(src => src.First().BanAllPcs))
                .ForMember(dest => dest.DeleteLeaderboardEntries, opt => opt.MapFrom(src => src.First().DeleteLeaderboardEntries))
                .ForMember(dest => dest.SendReasonNotification, opt => opt.MapFrom(src => src.First().SendReasonNotification))
                .ForMember(dest => dest.StartTimeUtc, opt => opt.MapFrom(src => src.First().StartTimeUtc ?? DateTime.UtcNow))
                .ForMember(dest => dest.ExpireTimeUtc, opt => opt.MapFrom(src => (src.First().StartTimeUtc ?? DateTime.UtcNow) + src.First().Duration));
            this.CreateMap<SunriseBanParameters, ForzaUserBanParameters>()
                .ForMember(dest => dest.FeatureArea, opt => opt.MapFrom(source => Enum.Parse(typeof(FeatureAreas), source.FeatureArea, true)))
                .ForMember(dest => dest.StartTime, opt => opt.MapFrom(src => src.StartTimeUtc))
                .ForMember(dest => dest.ExpireTime, opt => opt.MapFrom(src => src.ExpireTimeUtc));
            this.CreateMap<ForzaUserBanDescription, SunriseBanDescription>()
                .ForMember(dest => dest.FeatureArea, opt => opt.MapFrom(source => Enum.GetName(typeof(FeatureAreas), source.FeatureAreas)))
                .ForMember(dest => dest.StartTimeUtc, opt => opt.MapFrom(src => src.StartTime))
                .ForMember(dest => dest.ExpireTimeUtc, opt => opt.MapFrom(src => src.ExpireTime))
                .ForMember(dest => dest.LastExtendedTimeUtc, opt => opt.MapFrom(src => src.LastExtendTime))
                .ForMember(dest => dest.CountOfTimesExtended, opt => opt.MapFrom(src => src.ExtendTimes));
            this.CreateMap<ForzaProfileSummary, SunriseProfileSummary>()
                .ForMember(dest => dest.HackFlags, opt => opt.MapFrom(src => src.HackFlags.Select(t => t.Name)));
            this.CreateMap<ForzaCredityUpdateEntry, SunriseCreditUpdate>().ReverseMap();
            this.CreateMap<AdminForzaProfile, SunriseInventoryProfile>().ReverseMap();
            this.CreateMap<ForzaUserGroup, SunriseLspGroup>();
            this.CreateMap<InventoryItem, SunriseInventoryItem>();
            this.CreateMap<Car, SunriseCar>();
            this.CreateMap<PlayerInventory, SunrisePlayerInventory>();
            this.CreateMap<SunrisePlayerDetails, IdentityResultAlpha>().ReverseMap();
            this.CreateMap<LiveOpsNotification, SunriseNotification>()
                .ForMember(dest => dest.NotificationId, opt => opt.MapFrom(source => source.id))
                .ForMember(dest => dest.SendDateUtc, opt => opt.MapFrom(source => source.sentDate))
                .ForMember(dest => dest.ExpirationDateUtc, opt => opt.MapFrom(source => source.expirationDate))
                .ReverseMap();
        }
    }
}
