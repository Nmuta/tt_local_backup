﻿using System.Threading.Tasks;
using Turn10.LiveOps.StewardApi.Contracts.Common;

namespace Turn10.LiveOps.StewardApi.Providers.Data
{
    /// <summary>
    ///     Exposes methods for retrieving and creating Steward users.
    /// </summary>
    public interface IScopedStewardUserProvider
    {
        /// <summary>
        ///     Retrieves a steward user.
        /// </summary>
        Task<StewardUserInternal> GetStewardUserAsync(string id);
    }
}
