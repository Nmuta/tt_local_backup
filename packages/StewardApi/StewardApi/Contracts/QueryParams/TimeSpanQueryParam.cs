using System;
using System.ComponentModel;
using Turn10.LiveOps.StewardApi.Contracts.QueryParams.QueryParamConverters;

namespace Turn10.LiveOps.StewardApi.Contracts.QueryParams
{
    /// <summary>
    ///     Represents a TimeSpan query param.
    /// </summary>
    [TypeConverter(typeof(TimeSpanQueryParamConvert))]
    public class TimeSpanQueryParam
    {
        /// <summary>
        ///     Gets or sets the value.
        /// </summary>
        public TimeSpan? Value { get; set; }
    }
}
