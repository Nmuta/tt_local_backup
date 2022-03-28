using System;
using AutoMapper;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;

namespace Turn10.LiveOps.StewardApi.Helpers
{
    /// <summary>
    ///     Helpers for mapping data.
    /// </summary>
    public static class MapperExtensions
    {
        /// <summary>
        ///    Tries to map data and throws exception if it fails.
        /// </summary>
        public static T SafeMap<T>(this IMapper mapper, object source)
        {
            try
            {
                return mapper.Map<T>(source);
            }
            catch (Exception ex)
            {
                throw new ConversionFailedStewardException($"Failed to convert source to type: {nameof(T)}", ex);
            }
        }
    }
}
