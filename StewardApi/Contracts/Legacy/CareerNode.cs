namespace Turn10.LiveOps.StewardApi.Contracts.Legacy
{
    /// <summary>
    ///     Represents the career node.
    /// </summary>
    public sealed class CareerNode
    {
        /// <summary>
        ///     Gets or sets the node type.
        /// </summary>
        public string NodeType { get; set; }

        /// <summary>
        ///     Gets or sets the ID.
        /// </summary>
        public uint Id { get; set; }
    }
}