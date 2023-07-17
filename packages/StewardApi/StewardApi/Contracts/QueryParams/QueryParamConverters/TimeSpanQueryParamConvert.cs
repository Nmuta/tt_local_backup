using System;
using System.ComponentModel;
using System.Diagnostics.CodeAnalysis;
using System.Globalization;
using System.Xml;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;

namespace Turn10.LiveOps.StewardApi.Contracts.QueryParams.QueryParamConverters
{
    /// <summary>
    ///     The TimeSpan type converter.
    /// </summary>
    [SuppressMessage("Microsoft.Performance", "CA1812", Justification = "Not instantiated by design, used as input for TypeConverter attribute.")]
    internal sealed class TimeSpanQueryParamConvert : TypeConverter
    {
        /// <summary>
        ///     Determines if the type can be converted.
        /// </summary>
        public override bool CanConvertFrom(ITypeDescriptorContext context, Type sourceType)
        {
            if (sourceType == typeof(string))
            {
                return true;
            }

            return base.CanConvertFrom(context, sourceType);
        }

        /// <summary>
        ///     Override to enable conversion from string.
        /// </summary>
        public override object ConvertFrom(ITypeDescriptorContext context, CultureInfo culture, object value)
        {
            if (value is string)
            {
                TimeSpanQueryParam timeSpanParam = new TimeSpanQueryParam();

                try
                {
                    timeSpanParam.Value = XmlConvert.ToTimeSpan((string)value);
                }
                catch
                {
                    try
                    {
                        timeSpanParam.Value = TimeSpan.Parse((string)value, CultureInfo.InvariantCulture);
                    }
                    catch
                    {
                        throw new InvalidArgumentsStewardException($"Invalid TimeSpan query param provided: {(string)value}");
                    }
                }

                return timeSpanParam;
            }

            return base.ConvertFrom(context, culture, value);
        }
    }
}
