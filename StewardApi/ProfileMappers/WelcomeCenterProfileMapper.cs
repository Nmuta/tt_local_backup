using AutoMapper;

using Turn10.LiveOps.StewardApi.Contracts.Steelhead.WelcomeCenter;

namespace Turn10.LiveOps.StewardApi.ProfileMappers
{
    /// <summary>
    ///     Mapping configuration for Welcome Center.
    /// </summary>
    public class WelcomeCenterProfileMapper : Profile
    {
        /// <summary>
        ///     Initializes a new instance of the <see cref="WelcomeCenterProfileMapper"/> class.
        /// </summary>
        public WelcomeCenterProfileMapper()
        {
            this.CreateMap<UserMessagesMessageOfTheDay, MessageOfTheDayBridge>()
                .ForMember(dest => dest.FriendlyMessageName, act => act.MapFrom(src => src.FriendlyMessageName))
                .ForMember(dest => dest.ContentImagePath, act => act.MapFrom(src => src.ContentImagePath))
                .ForMember(dest => dest.Date, act => act.MapFrom(src => src.Date))
                .ForMember(dest => dest.ContentBody, act => act.MapFrom(src => src.ContentBody))
                .ReverseMap();

            this.CreateMap<UserMessagesMessageOfTheDayContentBody, LocTextBridge>()
                .ForMember(dest => dest.Base, act => act.MapFrom(src => src.@base))
                .ForMember(dest => dest.SkipLoc, act => act.MapFrom(src => src.skiploc))
                .ForMember(dest => dest.Description, act => act.Ignore())
                .ReverseMap();
            this.CreateMap<UserMessagesMessageOfTheDayContentHeader, LocTextBridge>()
                .ForMember(dest => dest.Base, act => act.MapFrom(src => src.@base))
                .ForMember(dest => dest.SkipLoc, act => act.MapFrom(src => src.skiploc))
                .ForMember(dest => dest.Description, act => act.Ignore())
                .ReverseMap();
            this.CreateMap<UserMessagesMessageOfTheDayTitleHeader, LocTextBridge>()
                .ReverseMap();
        }
    }
}
