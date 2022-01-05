// This file is used by Code Analysis to maintain SuppressMessage
// attributes that are applied to this project.
// Project-level suppressions either have no target or are given
// a specific target and scoped to a namespace, type, member, etc.

using System.Diagnostics.CodeAnalysis;

[assembly: SuppressMessage("Naming", "CA1711:Identifiers should not have incorrect suffix", Justification = "SupportAgentNew defines a new support agent at T10.", Scope = "member", Target = "~F:Turn10.LiveOps.StewardApi.Authorization.UserRole.SupportAgentNew")]
[assembly: SuppressMessage("Performance", "CA1815:Override equals and operator equals on value types", Justification = "Not our code.", Scope = "type", Target = "~T:Turn10.LiveOps.StewardApi.Obligation.TimeRange")]
[assembly: SuppressMessage("CodeQuality", "IDE0051:Remove unused private members", Justification = "Not our code.", Scope = "member", Target = "~F:Turn10.LiveOps.StewardApi.Obligation.KustoDataActivity.Type")]
[assembly: SuppressMessage("CodeQuality", "IDE0052:Remove unread private members", Justification = "Not our code.", Scope = "member", Target = "~F:Turn10.LiveOps.StewardApi.Obligation.KustoDataActivity.attemptMidPartitionSyncSwap")]
[assembly: SuppressMessage("Reliability", "CA2000:Dispose objects before losing scope", Justification = "Can't be disposed.", Scope = "member", Target = "~M:Turn10.LiveOps.StewardApi.Providers.StsClientWrapper.#ctor(Microsoft.Extensions.Configuration.IConfiguration,Turn10.Data.SecretProvider.IKeyVaultProvider)")]
[assembly: SuppressMessage("Usage", "VSTHRD103:GetResult synchronously blocks", Justification = "Used in conjunction with Task.WhenAll.", Scope = "namespaceanddescendants", Target = "Turn10.LiveOps.StewardApi.Controllers")]
[assembly: SuppressMessage("Style", "VSTHRD200:Use \"Async\" suffix for async methods", Justification = "Named to properly reflect controller actions.", Scope = "namespaceanddescendants", Target = "Turn10.LiveOps.StewardApi.Controllers")]
[assembly: SuppressMessage("Style", "VSTHRD200:Use \"Async\" suffix for async methods", Justification = "Named to properly reflect controller actions.", Scope = "namespaceanddescendants", Target = "Turn10.LiveOps.StewardApi.Hubs")]