using System;
using System.Collections.Generic;
using AutoMapper;
using Forza.LiveOps.FH5_main.Generated;
using Forza.UserInventory.FH5_main.Generated;
using Forza.WebServices.RareCarShopTransactionObjects.FH5_main.Generated;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Errors;
using Turn10.LiveOps.StewardApi.Contracts.Woodstock;
using Xls.Security.FH5_main.Generated;
using Xls.WebServices.FH5_main.Generated;
using LiveOpsContracts = Forza.LiveOps.FH5_main.Generated;
using WebServicesContracts = Forza.WebServices.FH5_main.Generated;

namespace Turn10.LiveOps.StewardApi.ProfileMappers
{
    /// <summary>
    ///    Mapper for Steelhead DTOs.
    /// </summary>
    [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Maintainability", "CA1506:AvoidExcessiveClassCoupling", Justification = "High class coupling by design.")]
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
            this.CreateMap<ForzaUserBanResult, BanResult>()
                .ForMember(dest => dest.Error, opt => opt.MapFrom(
                    src => src.Success ? null : new ServicesFailureStewardError($"LSP failed to ban player with XUID: {src.Xuid}")));
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
                .ForMember(dest => dest.SendDateUtc, opt => opt.MapFrom(src => src.SentDate))
                .ForMember(dest => dest.ExpirationDateUtc, opt => opt.MapFrom(src => src.ExpirationDate))
                .ReverseMap();
            this.CreateMap<ForzaUserMessageSendResult, MessageSendResult<ulong>>()
                .ForMember(dest => dest.PlayerOrLspGroup, opt => opt.MapFrom(src => src.Xuid))
                .ForMember(dest => dest.IdentityAntecedent, opt => opt.MapFrom(src => GiftIdentityAntecedent.Xuid));
        }
    }
}
