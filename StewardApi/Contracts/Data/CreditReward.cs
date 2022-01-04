using System.Data;

namespace Turn10.LiveOps.StewardApi.Contracts.Data
{
    /// <summary>
    ///     Represents a credit reward.
    /// </summary>
    public sealed class CreditReward
    {
        /// <summary>
        ///     Initializes a new instance of the <see cref="CreditReward"/> class.
        /// </summary>
        public CreditReward(long id, string rarity, long amount)
        {
            this.Id = id;
            this.Rarity = rarity;
            this.Amount = amount;
        }

        /// <summary>
        ///     Gets or sets the ID.
        /// </summary>
        public long Id { get; set; }

        /// <summary>
        ///     Gets or sets the amount.
        /// </summary>
        public long Amount { get; set; }

        /// <summary>
        ///     Gets or sets the rarity.
        /// </summary>
        public string Rarity { get; set; }

        /// <summary>
        ///     Makes a query for credit rewards that this model can read.
        /// </summary>
        public static string MakeQuery(string gameDbName)
        {
            return $"{gameDbName}_CreditReward | project ['id'], Rarity, Amount";
        }

        /// <summary>
        ///     Parses query results into a credit reward object.
        /// </summary>
        public static CreditReward FromQueryResult(IDataReader reader)
        {
            return new CreditReward(
                reader.Get<long>(nameof(Id)),
                reader.Get<string>(nameof(Rarity)),
                reader.Get<long>(nameof(Amount))
            );
        }
    }
}
