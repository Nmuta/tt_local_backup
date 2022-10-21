using AutoMapper;
using Newtonsoft.Json;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Data;

namespace Turn10.LiveOps.StewardApi.ProfileMappers
{
    /// <summary>
    ///     Mapper for Job Controller DTOs.
    /// </summary>
    public sealed class DataProfileMapper : Profile
    {
        /// <summary>
        ///     Initializes a new instance of the <see cref="DataProfileMapper"/> class.
        /// </summary>
        public DataProfileMapper()
        {
            this.CreateMap<BackgroundJobInternal, BackgroundJob>()
                .ForMember(des => des.RawResult, opt =>
                    opt.MapFrom(src => JsonConvert.DeserializeObject<object>(src.Result)))
                .ForMember(des => des.JobId, opt =>
                    opt.MapFrom(src => src.JobId))
                .ForMember(des => des.IsRead, opt => opt.MapFrom(src => src.IsRead ?? true))
                .ForMember(des => des.CreatedDateUtc, opt => opt.MapFrom(src => src.CreatedTimeUtc))
                .ForMember(des => des.UserId, opt => opt.MapFrom(src => src.PartitionKey))
                .ReverseMap();
            this.CreateMap<KustoQueryInternal, KustoQuery>()
                .ForMember(des => des.Id, opt => opt.MapFrom(src => src.RowKey))
                .ReverseMap();
            this.CreateMap<StewardUserInternal, StewardUser>()
                .ForMember(des => des.Attributes, opt =>
                    opt.MapFrom(src => src.AuthorizationAttributes()));
        }
    }
}
