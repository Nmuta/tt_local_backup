#pragma warning disable SA1600 // Elements must be documented
#pragma warning disable CS1591 // Missing XML comment for publicly visible type or member

namespace Turn10.LiveOps.StewardApi.Contracts.Data
{
    public enum StewardSubject
    {
        None,
        Player,
        Players,
        PlayerInventory,
        PlayerInventories,
        GroupInventories,
        Console,
        UserFlags,
        UserGeneratedContent,
        Messages,
        ProfileNotes,
        Auction,
        AuctionBlocklistEntry,
        Leaderboards,
        PlayerMessages,
        GroupMessages,
        UserGroup,
        CmsOverride,
        ApiPermissions,
        Ban,
        UgcGeoFlags,
        UgcReport,
        WelcomeCenter,
        UserPermissions,
        Users,
        UserTeam,
        PlayFabBuildLock,
        PlayFabSettings,
    }
}
