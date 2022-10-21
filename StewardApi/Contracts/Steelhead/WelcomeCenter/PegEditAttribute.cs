using System;

namespace Turn10.LiveOps.StewardApi.Contracts.Steelhead.WelcomeCenter
{
    /// <summary>
    ///     Signals whether Steward writes to this Pegasus data.
    /// </summary>
    [AttributeUsage(AttributeTargets.Property, Inherited = false, AllowMultiple = false)]
    internal sealed class PegEditAttribute : Attribute
    {
        /// <summary>
        ///     Initializes a new instance of the <see cref="PegEditAttribute"/> class.
        /// </summary>
        public PegEditAttribute()
        {
        }

        /// <summary>
        ///     Gets or sets a value indicating whether an xml entry's value
        ///     should ignore being interpreted as xml character markup.
        ///     <![CDATA[]]>
        /// </summary>
        public bool AddCdataMarkupToEntry { get; set; }
    }
}
