using System;
using System.Globalization;
using System.Xml.Serialization;

#pragma warning disable SA1402 // File may only contain a single type
#pragma warning disable SA1306 // Field names should begin with lower-case letter

namespace Turn10.LiveOps.StewardApi.Contracts.Steelhead.WelcomeCenter
{
    /// <summary>
    ///     Custom time range bridge for World of Forza bridge
    /// </summary>
    public partial class CustomRangeBridge
    {
        public RangePointBridge From { get; set; }

        public RangePointBridge To { get; set; }

        public string Name { get; set; }
    }

    /// <summary>
    ///     Range Point bridge for World of Forza bridge
    /// </summary>
    public partial class RangePointBridge
    {
        private DateTime InternalDateUtc;

        /// <summary>
        ///     Gets or sets the text property. This property
        ///     is XmlText in the model, so its value is written
        ///     but the property name is not created into an element.
        /// </summary>
        public string DateUtc
        {
            get => this.InternalDateUtc.ToString("O");
            set => this.InternalDateUtc = DateTime.Parse(value, CultureInfo.InvariantCulture).ToUniversalTime();
        }

        /// <summary>
        ///     Gets or sets the when attribute from the model.
        /// </summary>
        public string When { get; set; }

        public NullableDisplayNameBridge DisplayName { get; set; }
    }

    /// <summary>
    ///     Nullable Display Name Bridge
    /// </summary>
    public partial class NullableDisplayNameBridge
    {
        public string Text { get; set; }
    }
}
