using System;

namespace Turn10.LiveOps.StewardApi.Contracts.Steelhead.WelcomeCenter
{
    /// <summary>
    ///     Properties of localized text.
    /// </summary>
    public class LocTextBridge
    {
        /// <summary>
        ///     Gets or sets a value indicating whether to skip localization.
        /// </summary>
        public bool SkipLoc { get; set; }

        /// <summary>
        ///     Gets or sets the base.
        /// </summary>
        public string Base { get; set; }

        /// <summary>
        ///     Gets or sets the description.
        /// </summary>
        public string Description { get; set; }

        /// <summary>
        ///     Gets or sets the localized text definition.
        /// </summary>
        public string Locdef { get; set; }

        /// <summary>
        ///     Gets or sets the localized text reference.
        /// </summary>
        public string Locref { get; set; }
    }
}
