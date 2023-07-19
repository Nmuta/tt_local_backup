namespace Turn10.LiveOps.StewardApi.Contracts.Common
{
    /// <summary>
    ///     Represents an LSP group message to send.
    /// </summary>
    public sealed class LspGroupCommunityMessage : CommunityMessage
    {
        /// <summary>
        ///     Gets or sets the device type.
        /// </summary>
        public DeviceType DeviceType { get; set; }
    }
}
