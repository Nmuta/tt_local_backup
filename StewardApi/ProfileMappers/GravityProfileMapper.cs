using System.Collections.Generic;
using AutoMapper;
using Forza.WebServices.FMG.Generated;
using Turn10.LiveOps.StewardApi.Contracts;
using Turn10.LiveOps.StewardApi.Contracts.Gravity;
using Turn10.LiveOps.StewardApi.Contracts.Legacy;
using static Forza.WebServices.FMG.Generated.GameSettingsService;
using Currency = Forza.WebServices.FMG.Generated.Currency;
using EnergyRefill = Forza.WebServices.FMG.Generated.EnergyRefill;
using GravityCar = Forza.WebServices.FMG.Generated.GravityCar;
using MasteryKit = Forza.WebServices.FMG.Generated.MasteryKit;
using RepairKit = Forza.WebServices.FMG.Generated.RepairKit;
using UpgradeKit = Forza.WebServices.FMG.Generated.UpgradeKit;

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
            this.CreateMap<LiveOpsUserDetails, IdentityResultBeta>()
                .ForMember(des => des.T10Id, opt => opt.MapFrom(src => src.Turn10Id))
                .ReverseMap();

            this.CreateMap<Currency, MasterInventoryItem>()
                 .ForMember(dest => dest.Description, opt => opt.MapFrom((source) => source.Name));
            this.CreateMap<GravityCar, MasterInventoryItem>()
                .ForMember(dest => dest.Description, opt => opt.MapFrom((source) => $"{source.CarClass} {source.CarName}"))
                .ForMember(dest => dest.Id, opt => opt.MapFrom((source) => source.CarId));
            this.CreateMap<EnergyRefill, MasterInventoryItem>()
                .ForMember(dest => dest.Description, opt => opt.MapFrom((source) => $"{(source.IsFull ? "Full" : source.PartialValue + " Point")} Energy Refill"))
                .ForMember(dest => dest.Id, opt => opt.MapFrom((source) => source.RefillId));
            this.CreateMap<MasteryKit, MasterInventoryItem>()
                .ForMember(dest => dest.Description, opt => opt.MapFrom((source) => $"{source.CarClass} {source.Value} Mastery Kit"))
                .ForMember(dest => dest.Id, opt => opt.MapFrom((source) => source.KitId));
            this.CreateMap<RepairKit, MasterInventoryItem>()
                .ForMember(dest => dest.Description, opt => opt.MapFrom((source) => $"{source.StarRatingRequirement} Star Repair Kit"))
                .ForMember(dest => dest.Id, opt => opt.MapFrom((source) => source.KitId));
            this.CreateMap<UpgradeKit, MasterInventoryItem>()
                .ForMember(dest => dest.Description, opt => opt.MapFrom((source) => $"{source.UpgradeTier} {source.CarClass} Upgrade Kit"))
                .ForMember(dest => dest.Id, opt => opt.MapFrom((source) => source.KitId));

            this.CreateMap<LiveOpsGetGameSettingsOutput, GravityMasterInventory>()
                .ForMember(dest => dest.CreditRewards, opt => opt.MapFrom((source, destObj, destMem, context) => context.Mapper.Map<IList<MasterInventoryItem>>(source.gameSettings.ForzaEconomyGameSettings.EconomyFeatureSettings.Currencies)))
                .ForMember(dest => dest.Cars, opt => opt.MapFrom((source, destObj, destMem, context) => context.Mapper.Map<IList<MasterInventoryItem>>(source.gameSettings.ForzaEconomyGameSettings.EconomyFeatureSettings.Cars)))
                .ForMember(dest => dest.EnergyRefills, opt => opt.MapFrom((source, destObj, destMem, context) => context.Mapper.Map<IList<MasterInventoryItem>>(source.gameSettings.MiscGiftItemGameSettings.EnergyRefills)))
                .ForMember(dest => dest.MasteryKits, opt => opt.MapFrom((source, destObj, destMem, context) => context.Mapper.Map<IList<MasterInventoryItem>>(source.gameSettings.MiscGiftItemGameSettings.MasteryKits)))
                .ForMember(dest => dest.RepairKits, opt => opt.MapFrom((source, destObj, destMem, context) => context.Mapper.Map<IList<MasterInventoryItem>>(source.gameSettings.MiscGiftItemGameSettings.RepairKits)))
                .ForMember(dest => dest.UpgradeKits, opt => opt.MapFrom((source, destObj, destMem, context) => context.Mapper.Map<IList<MasterInventoryItem>>(source.gameSettings.MiscGiftItemGameSettings.UpgradeKits)))
                .ReverseMap();
        }
    }
}