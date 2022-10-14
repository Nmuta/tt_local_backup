﻿using System;
using System.Threading.Tasks;
using Forza.WebServices.FM7.Generated;
using static Forza.WebServices.FM7.Generated.UserManagementService;

#pragma warning disable VSTHRD200 // Use Async Suffix

namespace Turn10.LiveOps.StewardApi.Proxies.Lsp.Apollo.Services
{
    /// <summary>
    ///     Proxy interface for <see cref="UserManagementService"/>.
    /// </summary>
    public interface IUserManagementService
    {
        /// <summary>
        ///     Gets users for a user group.
        /// </summary>
        Task<GetUserGroupUsersOutput> GetUserGroupUsers(int userGroupId, int startAt, int maxResults);

        /// <summary>
        ///     Removes every users from a user group.
        /// </summary>
        Task ClearUserGroup(int groupId);

        /// <summary>
        ///     Removes user from user groups.
        /// </summary>
        Task RemoveFromUserGroups(ulong xuid, int[] groupIds);

        /// <summary>
        ///     Removes user from user groups by gamertag.
        /// </summary>
        Task RemoveFromUserGroupsByGamertag(string gamertag, int[] groupIds);

        /// <summary>
        ///     Adds user to user groups.
        /// </summary>
        Task AddToUserGroups(ulong xuid, int[] groupIds);

        /// <summary>
        ///     Adds user to user groups by gamertag.
        /// </summary>
        Task AddToUserGroupsByGamertag(string gamertag, int[] groupIds);

        /// <summary>
        ///     Creates a LSP user group.
        /// </summary>
        Task<CreateUserGroupOutput> CreateUserGroup(string groupName);
    }
}
