using System.Runtime.Serialization;

namespace Turn10.LiveOps.StewardApi.Obligation
{
    /// <summary>
    ///     Valid types of Kusto Data Activity. Controls behavior.
    /// </summary>
    public enum DataActivityType
    {
        /// <summary>
        ///     A kusto data set. The default.
        /// </summary>
        [EnumMember(Value = "kusto_dataset")]
        Kusto,

        /// <summary>
        ///     A Restate-o-matic dataset.
        /// </summary>
        [EnumMember(Value = "restate_o_matic_dataset")]
        RestateOMatic,
    }
}
