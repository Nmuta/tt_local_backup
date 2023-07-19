using System.Threading.Tasks;
using Turn10.Services.LiveOps.FH5_main.Generated;
using NotificationsManagementService = Turn10.Services.LiveOps.FH5_main.Generated.NotificationsManagementService;

#pragma warning disable VSTHRD200 // Use  Suffix
#pragma warning disable SA1516 // Blank lines
#pragma warning disable SA1600 // Elements must be documented
#pragma warning disable CS1591 // Missing XML comment for publicly visible type or member

namespace Turn10.LiveOps.StewardApi.Proxies.Lsp.Woodstock.Services
{
    public interface INotificationsManagementService
    {
        /// <summary>
        ///     Deletes all of a player's notifications.
        /// </summary>
        Task<NotificationsManagementService.DeleteNotificationsForUserOutput> DeleteNotificationsForUser(ulong xuid);
    }
}
