using System;
using System.Threading.Tasks;
using Forza.WebServices.FH4.Generated;
using static Forza.WebServices.FH4.Generated.UserService;

#pragma warning disable VSTHRD200 // Use Async Suffix

namespace Turn10.LiveOps.StewardApi.Proxies.Lsp.Sunrise.Services
{
    /// <summary>
    ///     Proxy interface for <see cref="UserService"/>.
    /// </summary>
    public interface IUserService
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
        ///     Removes user from user groups by gamertag.
        /// </summary>
        Task RemoveFromUserGroupsByGamertag(string gamertag, int[] groupIds);

        /// <summary>
        ///     Adds user to user groups by gamertag.
        /// </summary>
        Task AddToUserGroupsByGamertag(string gamertag, int[] groupIds);

        /// <summary>
        ///     Get the status of a user group bulk operation.
        /// </summary>
        Task<GetUserGroupBulkOperationStatusOutput> GetUserGroupBulkOperationStatus(ForzaBulkOperationType operation, int userGroupId, Guid blobId);

        /// <summary>
        ///     Create a add/remove bulk operation on a user group.
        /// </summary>
        Task<CreateUserGroupBulkOperationV2Output> CreateUserGroupBulkOperationV2(ForzaBulkOperationType operation, int userGroupId, ForzaUserGroupOperationPage[] pages);
    }
}
