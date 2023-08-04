using AutoMapper;
using Forza.WebServices.FH3.Generated;
using System.Collections.Generic;
using System.Linq;
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
                .ForMember(des => des.IsFlaggedForSuspiciousActivity, opt => opt.MapFrom(src => src.IsFlaggedForSuspciosActivity));
            this.CreateMap<AdminForzaProfile, OpusInventoryProfile>().ReverseMap();
            this.CreateMap<OpusPlayerDetails, IdentityResultAlpha>().ReverseMap();
        }
    }
}
