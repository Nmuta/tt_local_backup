using AutoMapper;
using Newtonsoft.Json;
using PlayFab.EconomyModels;
using PlayFab.MultiplayerModels;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Data;
using Turn10.LiveOps.StewardApi.Contracts.PlayFab;

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
            this.CreateMap<PlayFabBuildLockInternal, PlayFabBuildLock>()
               .ForMember(des => des.Id, opt => opt.MapFrom(src => src.RowKey))
               .ReverseMap();
            this.CreateMap<GetBuildResponse, PlayFabBuildSummary>()
                .ForMember(des => des.Id, opt => opt.MapFrom(src => src.BuildId))
                .ForMember(des => des.Name, opt => opt.MapFrom(src => src.BuildName))
                .ReverseMap();
            this.CreateMap<BuildSummary, PlayFabBuildSummary>()
                .ForMember(des => des.Id, opt => opt.MapFrom(src => src.BuildId))
                .ForMember(des => des.Name, opt => opt.MapFrom(src => src.BuildName))
                .ReverseMap();
            this.CreateMap<CatalogItem, PlayFabVoucher>().ReverseMap();
            this.CreateMap<StewardUserInternal, StewardUser>()
                .ForMember(des => des.Attributes, opt =>
                    opt.MapFrom(src => src.AuthorizationAttributes()))
                .ForMember(des => des.Team, opt =>
                    opt.MapFrom(src => src.DeserializeTeam()));
        }
    }
}