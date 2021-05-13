using System.Collections.Generic;
using AutoMapper;
using Forza.WebServices.FMG.Generated;
using Turn10.LiveOps.StewardApi.Contracts;
using Turn10.LiveOps.StewardApi.Contracts.Gravity;
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
    [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Maintainability", "CA1506:AvoidExcessiveClassCoupling", Justification = "High class coupling by design.")]
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

            this.CreateMap<LiveOpsCar, PlayerInventoryItem>()
                .ForMember(des => des.Id, opt => opt.MapFrom(src => src.ItemId))
                .ForMember(des => des.Quantity, opt => opt.MapFrom(src => 1))
                .ForMember(des => des.DateAquiredUtc, opt => opt.MapFrom(src => src.AcquisitionTime))
                .ReverseMap();
            this.CreateMap<LiveOpsMasteryKit, PlayerInventoryItem>()
                .ForMember(des => des.Id, opt => opt.MapFrom(src => src.ItemId))
                .ForMember(des => des.DateAquiredUtc, opt => opt.MapFrom(src => src.AcquisitionTime))
                .ReverseMap();
            this.CreateMap<LiveOpsUpgradeKit, PlayerInventoryItem>()
                .ForMember(des => des.Id, opt => opt.MapFrom(src => src.ItemId))
                .ForMember(des => des.DateAquiredUtc, opt => opt.MapFrom(src => src.AcquisitionTime))
                .ReverseMap();
            this.CreateMap<LiveOpsRepairKit, PlayerInventoryItem>()
                .ForMember(des => des.Id, opt => opt.MapFrom(src => src.ItemId))
                .ForMember(des => des.DateAquiredUtc, opt => opt.MapFrom(src => src.AcquisitionTime))
                .ReverseMap();
            this.CreateMap<LiveOpsCurrency, PlayerInventoryItem>()
                .ForMember(des => des.Id, opt => opt.MapFrom(src => src.ItemId))
                .ReverseMap();
            this.CreateMap<LiveOpsEnergyRefill, PlayerInventoryItem>()
                .ForMember(des => des.Id, opt => opt.MapFrom(src => src.ItemId))
                .ForMember(des => des.DateAquiredUtc, opt => opt.MapFrom(src => src.AcquisitionTime))
                .ReverseMap();
            this.CreateMap<LiveOpsUserInventory, GravityPlayerInventory>()
                .ForMember(des => des.CreditRewards, opt => opt.MapFrom((source, destObj, destMem, context) => context.Mapper.Map<IList<PlayerInventoryItem>>(source.Currencies)))
                .ForMember(des => des.GameSettingsId, opt => opt.MapFrom(src => src.PreviousGameSettingsGuid))
                .ForMember(des => des.ExternalProfileId, opt => opt.MapFrom(src => src.CurrentExternalProfileId))
                .ReverseMap();

            this.CreateMap<LiveOpsUserDetails, IdentityResultBeta>()
                .ForMember(des => des.T10Id, opt => opt.MapFrom(src => src.Turn10Id))
                .ReverseMap();
            this.CreateMap<Currency, MasterInventoryItem>()
                 .ForMember(dest => dest.Description, opt => opt.MapFrom((source) => source.Name));
            this.CreateMap<GravityCar, MasterInventoryItem>()
                .ForMember(dest => dest.Description, opt => opt.MapFrom((source) => $"{source.CarClass} {source.CarName} ({source.StarRating}-Star)"))
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