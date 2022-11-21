﻿using System;
using System.Globalization;

namespace Turn10.LiveOps.StewardApi.Contracts.Steelhead.WelcomeCenter.MessageOfTheDay
{
    /// <summary>
    ///     Message of the Day response object.
    /// </summary>
    public class MotdBridge
    {
        private DateTime internalDateUtc;

        /// <summary>
        ///     Gets or sets the friendly message name.
        /// </summary>
        public string FriendlyMessageName { get; set; }

        /// <summary>
        ///     Gets or sets the title header.
        /// </summary>
        public LocTextBridge TitleHeader { get; set; }

        /// <summary>
        ///     Gets or sets the content header.
        /// </summary>
        public LocTextBridge ContentHeader { get; set; }

        /// <summary>
        ///     Gets or sets the content body.
        /// </summary>
        public LocTextBridge ContentBody { get; set; }

        /// <summary>
        ///     Gets or sets the content image path.
        /// </summary>
        public string ContentImagePath { get; set; }

        /// <summary>
        ///     Gets or sets the date.
        /// </summary>
        public string Date
        {
            get => this.internalDateUtc.ToString("O");
            set => this.internalDateUtc = DateTime.Parse(value, CultureInfo.InvariantCulture).ToUniversalTime();
        }
    }
}
