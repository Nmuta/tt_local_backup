using AutoMapper;
using Newtonsoft.Json;
using Turn10.LiveOps.StewardApi.Contracts;

namespace Turn10.LiveOps.StewardApi.ProfileMappers
{
    /// <summary>
    ///    Mapper for Job Controller DTOs.
    /// </summary>
    public sealed class JobsProfileMapper : Profile
    {
        /// <summary>
        ///     Initializes a new instance of the <see cref="JobsProfileMapper"/> class.
        /// </summary>
        public JobsProfileMapper()
        {
            this.CreateMap<BackgroundJobInternal, BackgroundJob>()
                .ForMember(des => des.RawResult, opt =>
                    opt.MapFrom(src => JsonConvert.DeserializeObject<object>(src.Result)))
                .ReverseMap();
        }
    }
}
