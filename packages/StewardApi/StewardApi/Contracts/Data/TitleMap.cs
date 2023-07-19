using System.Data;
using Forza.WebServices.MixerObjects.FH4.Generated;

namespace Turn10.LiveOps.StewardApi.Contracts.Data
{
    /// <summary>
    ///     Maps various title strings.
    /// </summary>
    public sealed class TitleMap
    {
        /// <summary>
        ///     Initializes a new instance of the <see cref="TitleMap"/> class.
        /// </summary>
        public TitleMap(string titleId, string nameInternal, string nameExternal, string nameExternalFull)
        {
            this.TitleId = titleId;
            this.NameInternal = nameInternal;
            this.NameExternal = nameExternal;
            this.NameExternalFull = nameExternalFull;
        }

        /// <summary>
        ///     Gets the query used to retrieve title map.
        /// </summary>
        public static string Query
        {
            get => "playfab_title_mapping()";
        }

        /// <summary>
        ///     Gets or sets the title ID.
        /// </summary>
        public string TitleId { get; set; }

        /// <summary>
        ///     Gets or sets the name internal.
        /// </summary>
        public string NameInternal { get; set; }

        /// <summary>
        ///     Gets or sets the name external.
        /// </summary>
        public string NameExternal { get; set; }

        /// <summary>
        ///     Gets or sets the name external full.
        /// </summary>
        public string NameExternalFull { get; set; }

        /// <summary>
        ///     Parses query results into a Kusto car object.
        /// </summary>
        public static TitleMap FromQueryResult(IDataReader reader)
        {
            return new TitleMap(
                reader.Get<string>(nameof(TitleId)),
                reader.Get<string>(nameof(NameInternal)),
                reader.Get<string>(nameof(NameExternal)),
                reader.Get<string>(nameof(NameExternalFull)));
        }
    }
}
