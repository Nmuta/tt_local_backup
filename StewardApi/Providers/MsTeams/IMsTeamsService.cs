using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Graph;
using Turn10.LiveOps.StewardApi.Contracts.Common;

namespace Turn10.LiveOps.StewardApi.Providers.MsGraph
{
    /// <summary>
    ///     Exposes methods for interacting with Microsoft Teams.
    /// </summary>
    public interface IMsTeamsService
    {
        /// <summary>
        ///     Sends message to help channel on Steward's MS Team.
        /// </summary>
        Task SendHelpChannelMessageAsync(string jsonCardMessage);
    }
}
