using System.Threading.Tasks;

namespace Turn10.LiveOps.StewardApi.Providers
{
    /// <summary>Declares an initialization function run on startup.</summary>
    public interface IInitializeable
    {
        /// <summary>
        ///     Performs necessary initialization.
        /// </summary>
        Task InitializeAsync();
    }
}
