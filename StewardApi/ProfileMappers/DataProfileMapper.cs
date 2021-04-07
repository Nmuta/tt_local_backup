using System;
using System.Collections.Generic;
using AutoMapper;
using Newtonsoft.Json;
using Turn10.LiveOps.StewardApi.Contracts;
using Turn10.LiveOps.StewardApi.Contracts.Data;

namespace Turn10.LiveOps.StewardApi.ProfileMappers
{
    /// <summary>
    ///    Mapper for Job Controller DTOs.
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
                    opt.MapFrom(src => Enum.Parse(typeof(BackgroundJobStatus), src.Status, true)))
                .ReverseMap();
            this.CreateMap<KustoQueryInternal, KustoQuery>()
                .ForMember(des => des.Id, opt => opt.MapFrom(src => src.RowKey))
                .ReverseMap();
        }
    }
}
