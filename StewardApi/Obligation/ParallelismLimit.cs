using Newtonsoft.Json;

namespace Turn10.LiveOps.StewardApi.Obligation
{
    /// <summary>
    ///     Allows user defined parallelism limits.
    ///
    ///     Any other units of work sharing that tag that are in progress will count against the given limit.
    ///
    ///     Parallelism limits are calculated based on your limit.
    ///     So, you could have two data activities that you wanted to limit like this:
    ///         data activity a -> { tag: 'hello', limit: 1 }
    ///         data activity b -> { tag: 'hello', limit: 2 }
    ///     This is fine, and means that only one 'a' will run, but b might have two running, xor one 'a' and one 'b'.
    ///
    ///     Parallelism limits are calculated by tenant.
    /// </summary>
    public class ParallelismLimit
    {
        /// <summary>
        ///     Gets or sets the tag.
        /// </summary>
        /// <remarks>
        ///     A tag representing a group of data activities with a shared parallelism limit.
        /// </remarks>
        [JsonProperty("tag")]
        public string Tag { get; set; }

        /// <summary>
        ///     Gets or sets the tag.
        /// </summary>
        /// <remarks>
        ///     The maximum number of slices that can be run at a time for a given tag.
        /// </remarks>
        [JsonProperty("limit")]
        public int Limit { get; set; }
    }
}
