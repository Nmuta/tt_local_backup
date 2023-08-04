using AutoMapper;
using System;
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

        /// <summary>
        ///     Validation utility method copied from https://stackoverflow.com/questions/954480/automapper-ignore-the-rest/38073718#38073718
        /// </summary>
        public static void IgnoreUnmapped(this IProfileExpression profile)
        {
            profile.ForAllMaps(IgnoreUnmappedProperties);
        }

        /// <summary>
        ///     Validation utility method copied from https://stackoverflow.com/questions/954480/automapper-ignore-the-rest/38073718#38073718
        /// </summary>
        public static void IgnoreUnmapped(this IProfileExpression profile, Func<TypeMap, bool> filter)
        {
            profile.ForAllMaps((map, expr) =>
            {
                if (filter(map))
                {
                    IgnoreUnmappedProperties(map, expr);
                }
            });
        }

        /// <summary>
        ///     Validation utility method copied from https://stackoverflow.com/questions/954480/automapper-ignore-the-rest/38073718#38073718
        /// </summary>
        public static void IgnoreUnmapped(this IProfileExpression profile, Type src, Type dest)
        {
            profile.IgnoreUnmapped((TypeMap map) => map.SourceType == src && map.DestinationType == dest);
        }

        /// <summary>
        ///     Validation utility method copied from https://stackoverflow.com/questions/954480/automapper-ignore-the-rest/38073718#38073718
        /// </summary>
        public static void IgnoreUnmapped<TSrc, TDest>(this IProfileExpression profile)
        {
            profile.IgnoreUnmapped(typeof(TSrc), typeof(TDest));
        }

        private static void IgnoreUnmappedProperties(TypeMap map, IMappingExpression expr)
        {
            foreach (string propName in map.GetUnmappedPropertyNames())
            {
                if (map.SourceType.GetProperty(propName) != null)
                {
                    expr.ForSourceMember(propName, opt => opt.DoNotValidate());
                }
                if (map.DestinationType.GetProperty(propName) != null)
                {
                    expr.ForMember(propName, opt => opt.Ignore());
                }
            }
        }
    }
}
