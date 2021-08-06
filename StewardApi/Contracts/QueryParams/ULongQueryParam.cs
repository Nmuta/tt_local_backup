using System;
using System.ComponentModel;
using System.Globalization;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;

namespace Turn10.LiveOps.StewardApi.Contracts.QueryParams
{
    /// <summary>
    ///     Represents a ulong query param.
    /// </summary>
    [TypeConverter(typeof(ULongQueryParamConvert))]
    public class ULongQueryParam
    {
        public ulong? Value { get; set; }
    }

    /// <summary>
    ///     The ulong type converter.
    /// </summary>
    internal class ULongQueryParamConvert : TypeConverter
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
                ULongQueryParam uLongParam = new ULongQueryParam();

                try
                {
                    uLongParam.Value = Convert.ToUInt64((string)value);
                }
                catch
                {
                    throw new InvalidArgumentsStewardException($"Invalid ulong query param provided: { (string)value }");
                }

                return uLongParam;
            }

            return base.ConvertFrom(context, culture, value);
        }
    }
}
