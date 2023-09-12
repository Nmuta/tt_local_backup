namespace Turn10.LiveOps.StewardApi.Common
{
    /// <summary>
    ///     A static storage class for KeyVault key-value names
    /// </summary>
    public static class KeyVaultNameConstants
    {
        /// <summary>
        ///     Kusto Client KeyVault Secret Name
        /// </summary>
        public const string KustoClientSecretName = "aad-kusto-client-secret";

        /// <summary>
        ///     Azure Auth Client KeyVault Secret Name
        /// </summary>
        public const string AzureAuthClientSecretName = "aad-auth-client-secret";

        /// <summary>
        ///     Teams Help Channel Webhook KeyVault Secret Name
        /// </summary>
        public const string TeamsHelpChannelWebhookName = "teams-help-channel-webhook";

        /// <summary>
        ///     Woodstock PlayFab Dev Title ID KeyVault Secret Name
        /// </summary>
        public const string WoodstockPlayFabDevTitleIdName = "playfab-woodstock-dev-title";

        /// <summary>
        ///     Woodstock PlayFab DevKey KeyVault Secret Name
        /// </summary>
        public const string WoodstockPlayFabDevKeyName = "playfab-woodstock-dev-key";

        /// <summary>
        ///     PlayFab Forte Dev Title KeyVault Secret Name
        /// </summary>
        public const string FortePlayFabDevTitleIdName = "playfab-forte-dev-title";

        /// <summary>
        ///     PlayFab Forte Dev Key KeyVault Secret Name
        /// </summary>
        public const string FortePlayFabDevKeyName = "playfab-forte-dev-key";

        /// <summary>
        ///     Block Connection String KeyVault Secret Name
        /// </summary>
        public const string BlobConnectionStringName = "blob-connection-string";

        /// <summary>
        ///     Obligation Client Secret KeyVault Secret Name
        /// </summary>
        public const string ObligationClientSecretName = "obligation-aad-client-secret";

        /// <summary>
        ///     Apollo Certificate Secret KeyVault Secret Name
        /// </summary>
        public const string ApolloCertificateSecretName = "fm7-lsp-client";

        /// <summary>
        ///     Table Storage Connection String KeyVault Secret Name
        /// </summary>
        public const string TableStorageConnectionStringName = "table-storage-connection-string";

        /// <summary>
        ///     Opus Certificate Secret KeyVault Secret Name
        /// </summary>
        public const string OpusCertificateSecretName = "fh3-lsp-client";

        /// <summary>
        ///     Woodstock PlayFab Prod Title ID KeyVault Secret Name
        /// </summary>
        public const string WoodstockPlayFabProdTitleIdName = "playfab-woodstock-prod-title";

        /// <summary>
        ///     Woodstock Playfab Prod Key KeyVault Secret Name
        /// </summary>
        public const string WoodstockPlayFabProdKeyName = "playfab-woodstock-prod-key";

        /// <summary>
        ///     Sts Secreate KeyVault Secret Name
        /// </summary>
        public const string StsSecretName = "web-client";
    }
}
