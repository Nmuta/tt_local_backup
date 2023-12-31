﻿namespace Turn10.LiveOps.StewardApi.Contracts.Common
{
    /// <summary>
    ///     Represents a console.
    /// </summary>
    public sealed class ConsoleDetails
    {
        /// <summary>
        ///     Gets or sets the console ID.
        /// </summary>
        public ulong ConsoleId { get; set; }

        /// <summary>
        ///     Gets or sets a value indicating whether the user is banned.
        /// </summary>
        public bool IsBanned { get; set; }

        /// <summary>
        ///     Gets or sets a value indicating whether the user is bannable.
        /// </summary>
        public bool IsBannable { get; set; }

        /// <summary>
        ///     Gets or sets the device type.
        /// </summary>
        public string DeviceType { get; set; }

        /// <summary>
        ///     Gets or sets the client version.
        /// </summary>
        public string ClientVersion { get; set; }
    }
}
