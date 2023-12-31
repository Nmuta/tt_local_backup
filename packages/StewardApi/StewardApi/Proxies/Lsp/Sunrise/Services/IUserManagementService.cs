﻿using System.Threading.Tasks;
using Forza.LiveOps.FH4.Generated;
using static Forza.LiveOps.FH4.Generated.UserManagementService;

#pragma warning disable VSTHRD200 // Use Async Suffix

namespace Turn10.LiveOps.StewardApi.Proxies.Lsp.Sunrise.Services
{
    /// <summary>
    ///     Proxy interface for <see cref="UserManagementService"/>.
    /// </summary>
    public interface IUserManagementService
    {
        /// <summary>
        ///     Creates a LSP user group.
        /// </summary>
        Task<CreateUserGroupOutput> CreateUserGroup(string groupName);

        /// <summary>
        ///     Gets user IDs.
        /// </summary>
        Task<GetUserIdsOutput> GetUserIds(int paramCount, ForzaPlayerLookupParameters[] playerLookupParameters);

        /// <summary>
        ///     Adds user to user groups.
        /// </summary>
        Task AddToUserGroups(ulong xuid, int[] groupIds);

        /// <summary>
        ///     Removes user from user groups.
        /// </summary>
        Task RemoveFromUserGroups(ulong xuid, int[] groupIds);

        /// <summary>
        ///     Gets ban history summaries by xuids.
        /// </summary>
        Task<GetUserBanSummariesOutput> GetUserBanSummaries(ulong[] xuids, int xuidCount);

        /// <summary>
        ///    Add meta-level comment to a player.
        /// </summary>
        Task AddAdminComment(ulong xuid, string text, string author);

        /// <summary>
        ///     Gets meta-level comments on a player.
        /// </summary>
        Task<GetAdminCommentsOutput> GetAdminComments(ulong xuid, int maxResults);
    }
}
