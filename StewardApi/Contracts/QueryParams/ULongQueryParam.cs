using System.ComponentModel;
using Turn10.LiveOps.StewardApi.Contracts.QueryParams.QueryParamConverters;

namespace Turn10.LiveOps.StewardApi.Contracts.QueryParams
{
    /// <summary>
    ///     Represents a ulong query param.
    /// </summary>
    [TypeConverter(typeof(ULongQueryParamConvert))]
    public class ULongQueryParam
    {
        /// <summary>
        ///     Gets or sets the value.
        /// </summary>
        public ulong? Value { get; set; }
    }
}
