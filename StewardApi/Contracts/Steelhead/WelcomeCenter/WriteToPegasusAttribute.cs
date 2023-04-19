﻿using System;

namespace Turn10.LiveOps.StewardApi.Contracts.Steelhead.WelcomeCenter
{
    /// <summary>
    ///     Signals whether Steward writes to this Pegasus data.
    /// </summary>
    [AttributeUsage(AttributeTargets.Property, Inherited = false, AllowMultiple = false)]
    internal sealed class WriteToPegasusAttribute : Attribute
    {
        /// <summary>
        ///     Initializes a new instance of the <see cref="WriteToPegasusAttribute"/> class.
        /// </summary>
        public WriteToPegasusAttribute()
        {
        }

        /// <summary>
        ///     Gets or sets a value indicating whether the node's
        ///     value should be wrapped in a CDATA tag to ignore XML markup
        ///     (i.e., treat the value as a verbatim string).
        /// </summary>
        public bool AddCdataMarkupToEntry { get; set; }

        /// <summary>
        ///     Gets or sets a value indicating whether this element
        ///     is a base type with multiple exchangable derived types.
        /// </summary>
        public bool IsMultiElement { get; set; }

        /// <summary>
        ///     Gets or sets a value indicating whether this element
        ///     needs to be created even if its null. Used for Display Conditions
        /// </summary>
        public bool CreateIfNull { get; set; }
    }
}
