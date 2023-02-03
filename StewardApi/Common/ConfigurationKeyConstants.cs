namespace Turn10.LiveOps.StewardApi.Common
{
    /// <summary>
    ///     Represents configuration keys.
    /// </summary>
    public sealed class ConfigurationKeyConstants
    {
        /// <summary>
        ///     The Azure instance.
        /// </summary>
        public const string AzureInstance = "AzureAd:Instance";

        /// <summary>
        ///     The Azure tenant ID.
        /// </summary>
        public const string AzureTenantId = "AzureAd:TenantId";

        /// <summary>
        ///     The Azure client ID.
        /// </summary>
        public const string AzureClientId = "AzureAd:ClientId";

        /// <summary>
        ///     The Azure service principal ID.
        /// </summary>
        public const string AzureServicePrincipalId = "AzureAd:ServicePrincipalId";

        /// <summary>
        ///     The Azure client secret key in Key Vault.
        /// </summary>
        public const string AzureClientSecretKey = "AzureAd:ClientSecretKey";

        /// <summary>
        ///     The key vault url.
        /// </summary>
        public const string KeyVaultUrl = "KeyVaultUrl";

        /// <summary>
        ///     The STS url.
        /// </summary>
        public const string StsUrl = "Sts:Url";

        /// <summary>
        ///     The STS secret name.
        /// </summary>
        public const string StsSecretName = "Sts:SecretName";

        /// <summary>
        ///     The Kusto logger database.
        /// </summary>
        public const string KustoLoggerDatabase = "KustoLoggerConfiguration:Database";

        /// <summary>
        ///     The Kusto client secret name.
        /// </summary>
        public const string KustoClientSecretName = "KustoClientSecretName";

        /// <summary>
        ///     The blob connection string secret name.
        /// </summary>
        public const string BlobConnectionSecretName = "BlobConnectionSecretName";

        /// <summary>
        ///     The group gift password secret name.
        /// </summary>
        public const string GroupGiftPasswordSecretName = "GroupGiftingPasswordSecretName";

        /// <summary>
        ///     The Apollo uri.
        /// </summary>
        public const string ApolloUri = "ApolloEnvironment:Uri";

        /// <summary>
        ///     The Apollo client version.
        /// </summary>
        public const string ApolloClientVersion = "ApolloEnvironment:ClientVersion";

        /// <summary>
        ///     The Apollo admin xuid.
        /// </summary>
        public const string ApolloAdminXuid = "ApolloEnvironment:AdminXuid";

        /// <summary>
        ///     The Apollo sandbox.
        /// </summary>
        public const string ApolloSandbox = "ApolloEnvironment:Sandbox";

        /// <summary>
        ///     The Apollo certificate key vault name.
        /// </summary>
        public const string ApolloCertificateKeyVaultName = "ApolloEnvironment:CertificateKeyVaultName";

        /// <summary>
        ///     The Apollo certificate secret name.
        /// </summary>
        public const string ApolloCertificateSecretName = "ApolloEnvironment:CertificateSecretName";

        /// <summary>
        ///     The Opus uri.
        /// </summary>
        public const string OpusUri = "OpusEnvironment:Uri";

        /// <summary>
        ///     The Opus client version.
        /// </summary>
        public const string OpusClientVersion = "OpusEnvironment:ClientVersion";

        /// <summary>
        ///     The Opus admin xuid.
        /// </summary>
        public const string OpusAdminXuid = "OpusEnvironment:AdminXuid";

        /// <summary>
        ///     The Opus certificate key vault name.
        /// </summary>
        public const string OpusCertificateKeyVaultName = "OpusEnvironment:CertificateKeyVaultName";

        /// <summary>
        ///     The Opus certificate secret name.
        /// </summary>
        public const string OpusCertificateSecretName = "OpusEnvironment:CertificateSecretName";

        /// <summary>
        ///     The Sunrise uri.
        /// </summary>
        public const string SunriseUri = "SunriseEnvironment:Uri";

        /// <summary>
        ///     The Sunrise client version.
        /// </summary>
        public const string SunriseClientVersion = "SunriseEnvironment:ClientVersion";

        /// <summary>
        ///     The Sunrise admin xuid.
        /// </summary>
        public const string SunriseAdminXuid = "SunriseEnvironment:AdminXuid";

        /// <summary>
        ///     The Sunrise sandbox.
        /// </summary>
        public const string SunriseSandbox = "SunriseEnvironment:Sandbox";

        /// <summary>
        ///     The Sunrise title ID.
        /// </summary>
        public const string SunriseTitleId = "SunriseEnvironment:TitleId";

        /// <summary>
        ///     The Steelhead uri.
        /// </summary>
        public const string SteelheadUri = "SteelheadEnvironment:Uri";

        /// <summary>
        ///     The Steelhead client version.
        /// </summary>
        public const string SteelheadClientVersion = "SteelheadEnvironment:ClientVersion";

        /// <summary>
        ///     The Steelhead admin xuid.
        /// </summary>
        public const string SteelheadAdminXuid = "SteelheadEnvironment:AdminXuid";

        /// <summary>
        ///     The Steelhead sandbox.
        /// </summary>
        public const string SteelheadSandbox = "SteelheadEnvironment:Sandbox";

        /// <summary>
        ///     The Steelhead title ID.
        /// </summary>
        public const string SteelheadTitleId = "SteelheadEnvironment:TitleId";

        /// <summary>
        ///     The Woodstock uri.
        /// </summary>
        public const string WoodstockUri = "WoodstockEnvironment:Uri";

        /// <summary>
        ///     The Woodstock client version.
        /// </summary>
        public const string WoodstockClientVersion = "WoodstockEnvironment:ClientVersion";

        /// <summary>
        ///     The Woodstock admin xuid.
        /// </summary>
        public const string WoodstockAdminXuid = "WoodstockEnvironment:AdminXuid";

        /// <summary>
        ///     The Woodstock sandbox.
        /// </summary>
        public const string WoodstockSandbox = "WoodstockEnvironment:Sandbox";

        /// <summary>
        ///     The Woodstock title ID.
        /// </summary>
        public const string WoodstockTitleId = "WoodstockEnvironment:TitleId";

        /// <summary>
        ///     The Pegasus CMS environments.
        /// </summary>
        public const string PegasusCmsEnvironments = "PegasusCms:Environments";

        /// <summary>
        ///     The Pegasus CMS supported titles.
        /// </summary>
        public const string PegasusCmsTitles = "PegasusCms:Titles";

        /// <summary>
        ///     The Pegasus CMS Steelhead environment.
        /// </summary>
        public const string PegasusCmsDefaultSteelhead = "PegasusCms:SteelheadDefault";

        /// <summary>
        ///     The Pegasus CMS Woodstock environment.
        /// </summary>
        public const string PegasusCmsDefaultWoodstock = "PegasusCms:WoodstockDefault";

        /// <summary>
        ///     The Pegasus CMS Sunrise environment.
        /// </summary>
        public const string PegasusCmsDefaultSunrise = "PegasusCms:SunriseDefault";

        /// <summary>
        ///     The Steward environment.
        /// </summary>
        public const string StewardEnvironment = "StewardEnvironment";

        /// <summary>
        ///     The Steelhead Content PAT.
        /// </summary>
        public const string SteelheadContentAccessToken = "Git:SteelheadContentAccessToken";

        /// <summary>
        ///     The Steelhead Content project id.
        /// </summary>
        public const string SteelheadContentProjectId = "Git:SteelheadContentProjectId";

        /// <summary>
        ///     The Steelhead Content repo id.
        /// </summary>
        public const string SteelheadContentRepoId = "Git:SteelheadContentRepoId";

        /// <summary>
        ///     The Steelhead Content organization URL.
        /// </summary>
        public const string SteelheadContentOrganizationUrl = "Git:SteelheadContentOrganizationUrl";

        /// <summary>
        ///     The Steelhead Message of the Day Path in the Steelhead Content repo.
        /// </summary>
        public const string SteelheadMessageOfTheDayPath = "Git:SteelheadMessageOfTheDayPath";

        /// <summary>
        ///     The Steelhead World of Forza path in the Steelhead Content repo.
        /// </summary>
        public const string SteelheadWorldOfForzaPath = "Git:SteelheadWorldOfForzaPath";

        /// <summary>
        ///     The Steelhead format pipeline build definitoin key.
        /// </summary>
        public const string SteelheadFormatPipelineBuildDefinition = "Git:SteelheadFormatPipelineBuildDefinition";

        /// <summary>
        ///    The Woodstock PlayFab dev title id.
        /// </summary>
        public const string WoodstockPlayFabDevTitleId = "WoodstockEnvironment:PlayFab:Dev:TitleId";

        /// <summary>
        ///    The Woodstock PlayFab dev key.
        /// </summary>
        public const string WoodstockPlayFabDevKey = "WoodstockEnvironment:PlayFab:Dev:Key";
    }
}
