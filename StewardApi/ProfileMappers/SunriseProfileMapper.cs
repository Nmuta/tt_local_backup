using System;
using System.Collections.Generic;
using System.Linq;
using Forza.LiveOps.FH4.master.Generated;
using Forza.UserInventory.FH4.master.Generated;
using Forza.WebServices.RareCarShopTransactionObjects.FH4.master.Generated;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Contracts.Sunrise;
using Xls.Security.FH4.master.Generated;
using Xls.WebServices.FH4.master.Generated;
using Xls.WebServices.NotificationsObjects.FH4.master.Generated;
using LiveOpsContracts = Forza.LiveOps.FH4.master.Generated;
using WebServicesContracts = Forza.WebServices.FH4.master.Generated;

namespace Turn10.LiveOps.StewardApi.ProfileMappers
{
    /// <summary>
    ///     Mapper for Sunrise DTO's.
    /// </summary>
    [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Maintainability", "CA1506:AvoidExcessiveClassCoupling", Justification = "High class coupling by design.")]
    public sealed class SunriseProfileMapper : AutoMapper.Profile
    {
        /// <summary>
        ///       Initializes a new instance of the <see cref="SunriseProfileMapper"/> class.
        /// </summary>
        public SunriseProfileMapper()
        {
            this.CreateMap<AdminForzaUserInventoryItem, PlayerInventoryItem>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.itemId))
                .ForMember(dest => dest.Quantity, opt => opt.MapFrom(src => src.quantity))
                .ForMember(dest => dest.DateAquiredUtc, opt => opt.MapFrom(src => src.acquisitionTime))
                .ReverseMap();
            this.CreateMap<AdminForzaCarUserInventoryItem, PlayerInventoryItem>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.itemId))
                .ForMember(dest => dest.Quantity, opt => opt.MapFrom(src => src.quantity))
                .ForMember(dest => dest.DateAquiredUtc, opt => opt.MapFrom(src => src.acquisitionTime))
                .ReverseMap();
            this.CreateMap<AdminForzaUserInventorySummary, SunrisePlayerInventory>()
                .ForMember(dest => dest.CreditRewards, opt => opt.MapFrom(src => new List<PlayerInventoryItem>
                {
                    new PlayerInventoryItem { Id = -1, Description = "Credits", Quantity = src.credits },
                    new PlayerInventoryItem { Id = -1, Description = "WheelSpins", Quantity = src.wheelSpins },
                    new PlayerInventoryItem { Id = -1, Description = "SuperWheelSpins", Quantity = src.superWheelSpins },
                    new PlayerInventoryItem { Id = -1, Description = "SkillPoints", Quantity = src.skillPoints },
                }))
                .ReverseMap();
            this.CreateMap<UserData, SunrisePlayerDetails>()
                .ForMember(dest => dest.Xuid, opt => opt.MapFrom(src => src.qwXuid))
                .ForMember(dest => dest.Gamertag, opt => opt.MapFrom(src => src.wzGamerTag))
                .ReverseMap();
            this.CreateMap<LiveOpsContracts.ForzaConsole, ConsoleDetails>().ReverseMap();
            this.CreateMap<LiveOpsContracts.ForzaSharedConsoleUser, SharedConsoleUser>().ReverseMap();
            this.CreateMap<ForzaUserBanResult, BanResult>()
                .ForMember(dest => dest.Error, opt => opt.MapFrom(
                    src => src.Success ? null : new StewardError(StewardErrorCode.ServicesFailure, $"LSP failed to ban player with XUID: {src.Xuid}")));
            this.CreateMap<ForzaUserBanSummary, BanSummary>();
            this.CreateMap<SunriseBanParametersInput, SunriseBanParameters>()
                .ForMember(dest => dest.StartTimeUtc, opt => opt.MapFrom(src => src.StartTimeUtc ?? DateTime.UtcNow))
                .ForMember(dest => dest.ExpireTimeUtc, opt => opt.MapFrom(src => (src.StartTimeUtc ?? DateTime.UtcNow) + src.Duration));
            this.CreateMap<SunriseBanParameters, ForzaUserBanParameters>()
                .ForMember(dest => dest.xuids, opt => opt.MapFrom(src => new ulong[] { src.Xuid }))
                .ForMember(dest => dest.FeatureArea, opt => opt.MapFrom(src => Enum.Parse(typeof(FeatureAreas), src.FeatureArea, true)))
                .ForMember(dest => dest.StartTime, opt => opt.MapFrom(src => src.StartTimeUtc))
                .ForMember(dest => dest.ExpireTime, opt => opt.MapFrom(src => src.ExpireTimeUtc));
            this.CreateMap<ForzaUserBanDescription, BanDescription>()
                .ForMember(dest => dest.FeatureArea, opt => opt.MapFrom(src => Enum.GetName(typeof(FeatureAreas), src.FeatureAreas)))
                .ForMember(dest => dest.StartTimeUtc, opt => opt.MapFrom(src => src.StartTime))
                .ForMember(dest => dest.ExpireTimeUtc, opt => opt.MapFrom(src => src.ExpireTime))
                .ForMember(dest => dest.LastExtendedTimeUtc, opt => opt.MapFrom(src => src.LastExtendTime))
                .ForMember(dest => dest.CountOfTimesExtended, opt => opt.MapFrom(src => src.ExtendTimes));
            this.CreateMap<WebServicesContracts.ForzaProfileSummary, ProfileSummary>()
                .ForMember(dest => dest.HackFlags, opt => opt.MapFrom(src => src.HackFlags.Select(t => t.Name)));
            this.CreateMap<WebServicesContracts.ForzaCredityUpdateEntry, CreditUpdate>().ReverseMap();
            this.CreateMap<AdminForzaProfile, SunriseInventoryProfile>()
                .ForMember(dest => dest.DeviceType, opt => opt.MapFrom(
                    src => src.deviceType == "Invalid" ? "Legacy" : src.deviceType == "Win32" ? "Steam" : src.deviceType))
                .ReverseMap();
            this.CreateMap<LiveOpsContracts.ForzaUserGroup, LspGroup>();
            this.CreateMap<SunrisePlayerDetails, IdentityResultAlpha>().ReverseMap();
            this.CreateMap<SunriseGroupGift, SunriseGift>().ReverseMap();
            this.CreateMap<LiveOpsNotification, SunriseNotification>()
                .ForMember(dest => dest.NotificationId, opt => opt.MapFrom(src => src.id))
                .ForMember(dest => dest.SendDateUtc, opt => opt.MapFrom(src => src.sentDate))
                .ForMember(dest => dest.ExpirationDateUtc, opt => opt.MapFrom(src => src.expirationDate))
                .ReverseMap();
            this.CreateMap<SunriseUserFlagsInput, SunriseUserFlags>().ReverseMap();
            this.CreateMap<ForzaUserMessageSendResult, MessageSendResult<ulong>>()
                .ForMember(dest => dest.PlayerOrLspGroup, opt => opt.MapFrom(src => src.Xuid))
                .ForMember(dest => dest.IdentityAntecedent, opt => opt.MapFrom(src => GiftIdentityAntecedent.Xuid))
                .ForMember(dest => dest.Error, opt => opt.MapFrom(
                    src => src.Success ? null : new StewardError(StewardErrorCode.ServicesFailure, $"LSP failed to message player with XUID: {src.Xuid}")));
            this.CreateMap<ForzaUserAdminComment, SunriseProfileNote>()
                .ForMember(dest => dest.DateUtc, opt => opt.MapFrom(src => src.date))
                .ForMember(dest => dest.Author, opt => opt.MapFrom(src => src.author))
                .ForMember(dest => dest.Text, opt => opt.MapFrom(src => src.text));
            this.CreateMap<WebServicesContracts.RareCarTicketBalance, SunriseAccountInventory>()
                .ForMember(dest => dest.BackstagePasses, opt => opt.MapFrom(src => src.OfflineBalance))
                .ReverseMap();
            this.CreateMap<WebServicesContracts.RareCarShopTransaction, BackstagePassUpdate>()
                .ForMember(dest => dest.CreatedAtUtc, opt => opt.MapFrom(src => src.CreatedAt))
                .ForMember(dest => dest.BackstagePassAmount, opt => opt.MapFrom(src => src.OfflineTicketAmount))

                .ForMember(dest => dest.TransactionType, opt => opt.MapFrom(src => Enum.GetName(typeof(Operation), src.TransactionType)))
                .ReverseMap();
        }
    }
}
