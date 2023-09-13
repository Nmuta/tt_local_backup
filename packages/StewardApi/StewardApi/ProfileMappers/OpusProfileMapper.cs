using System.Collections.Generic;
using System.Linq;
using AutoMapper;
using Forza.WebServices.FH3.Generated;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Opus;

namespace Turn10.LiveOps.StewardApi.ProfileMappers
{
    /// <summary>
    ///     Mapper for Opus DTO's.
    /// </summary>
    public sealed class OpusProfileMapper : Profile
    {
        /// <summary>
        ///     Initializes a new instance of the <see cref="OpusProfileMapper"/> class.
        /// </summary>
        public OpusProfileMapper()
        {
            this.CreateMap<AdminForzaGarageCar, PlayerInventoryItem>()
                .ForMember(des => des.Id, opt => opt.MapFrom(src => src.carId))
                .ForMember(des => des.Description, opt => opt.MapFrom(src => src.displayName))
                .ForMember(des => des.Quantity, opt => opt.MapFrom(src => 1))
                .ForMember(des => des.AcquiredUtc, opt => opt.MapFrom(src => src.dateCreated))
                .ForMember(des => des.Error, opt => opt.Ignore())
                .ReverseMap();
            this.CreateMap<AdminForzaUserInventorySummary, OpusPlayerInventory>()
                .ForMember(des => des.CreditRewards, opt => opt.MapFrom(src => new List<PlayerInventoryItem>
                {
                    new PlayerInventoryItem { Id = -1, Description = "Credits", Quantity = src.creditUpdateEntries.OrderByDescending(e => e.eventTime).FirstOrDefault().currentCredits },
                }))
                .ReverseMap();

            this.CreateMap<UserMaster, OpusPlayerDetails>()
                .ForMember(des => des.FirstLoginUtc, opt => opt.MapFrom(src => src.FirstLogInTime))
                .ForMember(des => des.LastLoginUtc, opt => opt.MapFrom(src => src.LastLogInTime))
                .ForMember(des => des.AgeGroup, opt => opt.MapFrom(src => src.UserAgeGroup))
                .ForMember(des => des.IsFlaggedForSuspiciousActivity, opt => opt.MapFrom(src => src.IsFlaggedForSuspciosActivity))
                .ForMember(des => des.IsUnderReview, opt => opt.MapFrom(src => src.IsUserUnderReview));
            this.CreateMap<AdminForzaProfile, OpusInventoryProfile>().ReverseMap();
            this.CreateMap<OpusPlayerDetails, IdentityResultAlpha>()
                .ForMember(des => des.Query, opt => opt.Ignore())
                .ForMember(des => des.Error, opt => opt.Ignore())
                .ReverseMap();
        }
    }
}
