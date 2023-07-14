using System.Collections.Generic;
using System.Threading.Tasks;
using Turn10.LiveOps.StewardApi.Contracts.Data;

namespace Turn10.LiveOps.StewardApi.Providers.Data
{
    /// <summary>
    ///     Exposes interfaces for logging Steward actions.
    /// </summary>
    public interface IActionLogger
    {
        /// <summary>
        ///     Updates action tracking table.
        /// </summary>
        public Task UpdateActionTrackingTableAsync();

        /// <summary>
        ///     Sets recipient list and type then updates action tracking table.
        /// </summary>
        public Task UpdateActionTrackingTableAsync(RecipientType type, List<string> recipientIds);
    }
}
