using System;
using System.ComponentModel;
using System.Globalization;
using System.Xml;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;

namespace Turn10.LiveOps.StewardApi.Contracts.QueryParams
{
    /// <summary>
    ///     Represents a TimeSpan query param.
    /// </summary>
    [TypeConverter(typeof(TimeSpanQueryParamConvert))]
    public class TimeSpanQueryParam
    {
        public TimeSpan? Value { get; set; }
    }

    /// <summary>
    ///     The TimeSpan type converter.
    /// </summary>
    internal class TimeSpanQueryParamConvert : TypeConverter
    {
        public override bool CanConvertFrom(ITypeDescriptorContext context, Type sourceType)
        {
            if (sourceType == typeof(string))
            {
                return true;
            }
            return base.CanConvertFrom(context, sourceType);
        }

        public override object ConvertFrom(ITypeDescriptorContext context,
            CultureInfo culture, object value)
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
                        throw new InvalidArgumentsStewardException($"Invalid TimeSpan query param provided: { (string)value }");
                    }
                }

                return timeSpanParam;
            }
            return base.ConvertFrom(context, culture, value);
        }
    }
}
