﻿using System.Threading.Tasks;
using Turn10.Contracts.STS;
using Turn10.Contracts.STS.Responses;

namespace Turn10.LiveOps.StewardApi.Providers
{
    /// <summary>
    ///     Exposes methods for interacting with <see cref="StsClientWrapper"/>.
    /// </summary>
    public interface IStsClient
    {
        /// <summary>
        ///     Forges a user token.
        /// </summary>
        /// <remarks>
        ///     The token returned is used to authenticate to an LSP.
        /// </remarks>
        Task<GetUserTokenResponse> ForgeUserTokenAsync(TokenForgeryRequest tokenForgeryRequest);
    }
}
