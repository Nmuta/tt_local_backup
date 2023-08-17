using AutoMapper;
using Turn10.LiveOps.StewardApi.Contracts.Data;
using Turn10.LiveOps.StewardApi.Contracts.External.PlayFab;

namespace Turn10.LiveOps.StewardApi.ProfileMappers
{
    /// <summary>
    ///     Mapper for External Controller DTOs.
    /// </summary>
    public sealed class ExternalProfileMapper : Profile
    {
        /// <summary>
        ///     Initializes a new instance of the <see cref="ExternalProfileMapper"/> class.
        /// </summary>
        public ExternalProfileMapper()
        {
            this.CreateMap<PlayFabBuildLock, ExternalPlayFabBuildLock>();
        }
    }
}
