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
        ///     Gets or sets a value indicating whether the node's
        ///     value should be wrapped in a CDATA tag to ignore XML markup
        ///     (i.e., treat the value as a verbatim string).
        /// </summary>
        public bool AddCdataMarkupToEntry { get; set; }

        /// <summary>
        ///     Gets or sets a value indicating whether the element's
        ///     value has an anonymous property name. e.g. In the following example,
        ///     the value 'green' is backed by a property in the deserialized model named
        ///     (e.g., Text). <code><![CDATA[<color>green<color/>]]></code>
        /// </summary>
        public bool AnonymousField { get; set; }
    }
}
