using System.Collections.Generic;
using System.Linq;
using AutoMapper;
using Forza.WebServices.FH3.Generated;
using Turn10.LiveOps.StewardApi.Contracts.Opus;

namespace Turn10.LiveOps.StewardApi.ProfileMappers
{
    /// <summary>
    ///      Mapper for Opus DTO's.
    /// </summary>
    public sealed class OpusProfileMapper : Profile
    {
        /// <summary>
        ///      Initializes a new instance of the <see cref="OpusProfileMapper"/> class.
        /// </summary>
        public OpusProfileMapper()
        {
            this.CreateMap<AdminForzaGarageCar, OpusCar>()
                .ForMember(des => des.DateCreatedUtc, opt => opt.MapFrom(src => src.dateCreated))
                .ReverseMap();
            this.CreateMap<AdminForzaGarageCar, List<OpusCar>>().ReverseMap();
            this.CreateMap<AdminForzaUserInventorySummary, OpusPlayerInventory>()
                .ForMember(des => des.Credits, opt => opt.MapFrom(src => src.creditUpdateEntries.OrderByDescending(e => e.eventTime).FirstOrDefault().currentCredits))
                .ReverseMap();
            this.CreateMap<UserMaster, OpusPlayerDetails>()
                .ForMember(des => des.FirstLoginUtc, opt => opt.MapFrom(src => src.FirstLogInTime))
                .ForMember(des => des.LastLoginUtc, opt => opt.MapFrom(src => src.LastLogInTime))
                .ForMember(des => des.AgeGroup, opt => opt.MapFrom(src => src.UserAgeGroup))
                .ForMember(des => des.IsFlaggedForSuspiciousActivity, opt => opt.MapFrom(src => src.IsFlaggedForSuspciosActivity));
            this.CreateMap<AdminForzaProfile, OpusInventoryProfile>().ReverseMap();
        }
    }
}
