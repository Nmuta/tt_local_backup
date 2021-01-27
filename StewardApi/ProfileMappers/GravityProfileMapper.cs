using System.Collections.Generic;
using AutoMapper;
using Forza.WebServices.FMG.Generated;
using Turn10.LiveOps.StewardApi.Contracts;
using Turn10.LiveOps.StewardApi.Contracts.Gravity;
using Turn10.LiveOps.StewardApi.Contracts.Legacy;

namespace Turn10.LiveOps.StewardApi.ProfileMappers
{
    /// <summary>
    ///      Mapper for Gravity DTOs.
    /// </summary>
    public sealed class GravityProfileMapper : Profile
    {
        /// <summary>
        ///      Initializes a new instance of the <see cref="GravityProfileMapper"/> class.
        /// </summary>
        public GravityProfileMapper()
        {
            this.CreateMap<LiveOpsProfileDetails, GravitySaveState>()
                .ForMember(des => des.UserInventoryId, opt => opt.MapFrom(src => src.ExternalProfileId))
                .ForMember(des => des.LastLoginUtc, opt => opt.MapFrom(src => src.LastLoginWithProfile))
                .ReverseMap();

            this.CreateMap<LiveOpsUserDetails, GravityPlayerDetails>()
                .ForMember(des => des.SaveStates, opt => opt.MapFrom(src => src.ProfileDetails))
                .ForMember(des => des.SubscriptionTier, opt => opt.MapFrom(src => src.SubscriptionTier.ToString()))
                .ForMember(des => des.UserInventoryId, opt => opt.MapFrom(src => src.CurrentExternalProfileId))
                .ForMember(des => des.LastLoginUtc, opt => opt.MapFrom(src => src.LastLogin))
                .ForMember(des => des.FirstLoginUtc, opt => opt.MapFrom(src => src.FirstLogin))
                .ForMember(des => des.T10Id, opt => opt.MapFrom(src => src.Turn10Id))
                .ReverseMap();
            this.CreateMap<LiveOpsCar, Contracts.Gravity.GravityCar>()
                .ForMember(des => des.PurchaseUtc, opt => opt.MapFrom(src => src.PurchaseTimestamp))
                .ForMember(des => des.AcquisitionUtc, opt => opt.MapFrom(src => src.AcquisitionTime))
                .ForMember(des => des.ModifiedUtc, opt => opt.MapFrom(src => src.ModifiedTime))
                .ForMember(des => des.LastUsedUtc, opt => opt.MapFrom(src => src.LastUsedTime))
                .ReverseMap();
            this.CreateMap<LiveOpsMasteryKit, GravityInventoryItem>()
                .ForMember(des => des.AcquisitionUtc, opt => opt.MapFrom(src => src.AcquisitionTime))
                .ForMember(des => des.ModifiedUtc, opt => opt.MapFrom(src => src.ModifiedTime))
                .ForMember(des => des.LastUsedUtc, opt => opt.MapFrom(src => src.LastUsedTime))
                .ReverseMap();
            this.CreateMap<LiveOpsUpgradeKit, GravityUpgradeKit>()
                .ForMember(des => des.AcquisitionUtc, opt => opt.MapFrom(src => src.AcquisitionTime))
                .ForMember(des => des.ModifiedUtc, opt => opt.MapFrom(src => src.ModifiedTime))
                .ForMember(des => des.LastUsedUtc, opt => opt.MapFrom(src => src.LastUsedTime))
                .ReverseMap();
            this.CreateMap<LiveOpsRepairKit, GravityRepairKit>()
                .ForMember(des => des.AcquisitionUtc, opt => opt.MapFrom(src => src.AcquisitionTime))
                .ForMember(des => des.ModifiedUtc, opt => opt.MapFrom(src => src.ModifiedTime))
                .ForMember(des => des.LastUsedUtc, opt => opt.MapFrom(src => src.LastUsedTime))
                .ReverseMap();
            this.CreateMap<LiveOpsPack, GravityInventoryItem>()
                .ForMember(des => des.AcquisitionUtc, opt => opt.MapFrom(src => src.AcquisitionTime))
                .ForMember(des => des.ModifiedUtc, opt => opt.MapFrom(src => src.ModifiedTime))
                .ForMember(des => des.LastUsedUtc, opt => opt.MapFrom(src => src.LastUsedTime))
                .ReverseMap();
            this.CreateMap<LiveOpsCurrency, GravityInventoryItem>()
                .ForMember(des => des.AcquisitionUtc, opt => opt.MapFrom(src => src.AcquisitionTime))
                .ForMember(des => des.ModifiedUtc, opt => opt.MapFrom(src => src.ModifiedTime))
                .ForMember(des => des.LastUsedUtc, opt => opt.MapFrom(src => src.LastUsedTime))
                .ReverseMap();
            this.CreateMap<LiveOpsEnergyRefill, GravityInventoryItem>()
                .ForMember(des => des.AcquisitionUtc, opt => opt.MapFrom(src => src.AcquisitionTime))
                .ForMember(des => des.ModifiedUtc, opt => opt.MapFrom(src => src.ModifiedTime))
                .ForMember(des => des.LastUsedUtc, opt => opt.MapFrom(src => src.LastUsedTime))
                .ReverseMap();
            this.CreateMap<LiveOpsUserInventory, GravityPlayerInventory>()
                .ForMember(des => des.PreviousGameSettingsId, opt => opt.MapFrom(src => src.PreviousGameSettingsGuid))
                .ReverseMap();
            this.CreateMap<PlayerInventory, GravityPlayerInventory>();
            this.CreateMap<MasterInventoryItem, GiftingMasterInventoryItemResponse>();
            this.CreateMap<LiveOpsUserDetails, IdentityResultBeta>()
                .ForMember(des => des.T10Id, opt => opt.MapFrom(src => src.Turn10Id))
                .ReverseMap();
        }
    }
}