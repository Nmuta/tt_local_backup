﻿using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoFixture;
using AutoMapper;
using FluentAssertions;
using Forza.LiveOps.FH4.Generated;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using NSubstitute.ReturnsExtensions;
using Turn10.Data.SecretProvider;
using Turn10.LiveOps.StewardApi.Common;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Data;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Contracts.QueryParams;
using Turn10.LiveOps.StewardApi.Contracts.Sunrise;
using Turn10.LiveOps.StewardApi.Controllers;
using Turn10.LiveOps.StewardApi.Logging;
using Turn10.LiveOps.StewardApi.ProfileMappers;
using Turn10.LiveOps.StewardApi.Providers;
using Turn10.LiveOps.StewardApi.Providers.Data;
using Turn10.LiveOps.StewardApi.Providers.Sunrise;
using Turn10.LiveOps.StewardApi.Validation;

namespace Turn10.LiveOps.StewardTest.Unit.Sunrise
{
    [TestClass]
    public sealed class SunriseControllerTests
    {
        private static readonly Fixture Fixture = new Fixture();

        [TestMethod]
        [TestCategory("Unit")]
        public void Ctor_DoesNotThrow()
        {
            // Arrange.
            var dependencies = new Dependencies();

            // Act.
            Action act = () => dependencies.Build();

            // Assert.
            act.Should().NotThrow();
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void Ctor_WhenLoggingServiceNull_Throws()
        {
            // Arrange.
            var dependencies = new Dependencies { LoggingService = null };

            // Act.
            Action act = () => dependencies.Build();

            // Assert.
            act.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "loggingService"));
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void Ctor_WhenKustoProviderNull_Throws()
        {
            // Arrange.
            var dependencies = new Dependencies { KustoProvider = null };

            // Act.
            Action act = () => dependencies.Build();

            // Assert.
            act.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "kustoProvider"));
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void Ctor_WhenSunrisePlayerDetailsProviderNull_Throws()
        {
            // Arrange.
            var dependencies = new Dependencies { SunrisePlayerDetailsProvider = null };

            // Act.
            Action act = () => dependencies.Build();

            // Assert.
            act.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "sunrisePlayerDetailsProvider"));
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void Ctor_WhenSunrisePlayerInventoryProviderNull_Throws()
        {
            // Arrange.
            var dependencies = new Dependencies { SunrisePlayerInventoryProvider = null };

            // Act.
            Action act = () => dependencies.Build();

            // Assert.
            act.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "SunrisePlayerInventoryProvider"));
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void Ctor_WhenKeyVaultProviderNull_Throws()
        {
            // Arrange.
            var dependencies = new Dependencies { KeyVaultProvider = null };

            // Act.
            Action act = () => dependencies.Build();

            // Assert.
            act.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "keyVaultProvider"));
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void Ctor_WhenGiftHistoryProviderNull_Throws()
        {
            // Arrange.
            var dependencies = new Dependencies { GiftHistoryProvider = null };

            // Act.
            Action act = () => dependencies.Build();

            // Assert.
            act.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "giftHistoryProvider"));
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void Ctor_WhenBanHistoryProviderNull_Throws()
        {
            // Arrange.
            var dependencies = new Dependencies { BanHistoryProvider = null };

            // Act.
            Action act = () => dependencies.Build();

            // Assert.
            act.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "banHistoryProvider"));
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void Ctor_WhenStorefrontProviderNull_Throws()
        {
            // Arrange.
            var dependencies = new Dependencies { StorefrontProvider = null };

            // Act.
            Action act = () => dependencies.Build();

            // Assert.
            act.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "storefrontProvider"));
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void Ctor_WhenConfigurationNull_Throws()
        {
            // Arrange.
            var dependencies = new Dependencies { Configuration = null };

            // Act.
            Action act = () => dependencies.Build();

            // Assert.
            act.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "configuration"));
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void Ctor_WhenSchedulerNull_Throws()
        {
            // Arrange.
            var dependencies = new Dependencies { Scheduler = null };

            // Act.
            Action act = () => dependencies.Build();

            // Assert.
            act.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "scheduler"));
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void Ctor_WhenJobTrackerNull_Throws()
        {
            // Arrange.
            var dependencies = new Dependencies { JobTracker = null };

            // Act.
            Action act = () => dependencies.Build();

            // Assert.
            act.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "jobTracker"));
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void Ctor_WhenMasterInventoryRequestValidatorNull_Throws()
        {
            // Arrange.
            var dependencies = new Dependencies { MasterInventoryRequestValidator = null };

            // Act.
            Action act = () => dependencies.Build();

            // Assert.
            act.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "masterInventoryRequestValidator"));
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void Ctor_WhenGiftRequestValidatorNull_Throws()
        {
            // Arrange.
            var dependencies = new Dependencies { GiftRequestValidator = null };

            // Act.
            Action act = () => dependencies.Build();

            // Assert.
            act.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "giftRequestValidator"));
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void Ctor_WhenGroupGiftRequestValidatorNull_Throws()
        {
            // Arrange.
            var dependencies = new Dependencies { GroupGiftRequestValidator = null };

            // Act.
            Action act = () => dependencies.Build();

            // Assert.
            act.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "groupGiftRequestValidator"));
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void Ctor_WhenBanParametersRequestValidatorNull_Throws()
        {
            // Arrange.
            var dependencies = new Dependencies { BanParametersRequestValidator = null };

            // Act.
            Action act = () => dependencies.Build();

            // Assert.
            act.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "banParametersRequestValidator"));
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void Ctor_WhenUserFlagsRequestValidatorNull_Throws()
        {
            // Arrange.
            var dependencies = new Dependencies { UserFlagsRequestValidator = null };

            // Act.
            Action act = () => dependencies.Build();

            // Assert.
            act.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "userFlagsRequestValidator"));
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void Ctor_WhenConfigurationValuesNull_Throws()
        {
            // Arrange.
            var dependencies = new Dependencies(false);

            // Act.
            Action act = () => dependencies.Build();

            // Assert.
            act.Should().Throw<ArgumentException>().WithMessage($"{TestConstants.ArgumentExceptionMissingSettingsMessagePartial}{ConfigurationKeyConstants.KeyVaultUrl},{ConfigurationKeyConstants.GroupGiftPasswordSecretName}");
        }

        [TestMethod]
        [TestCategory("Unit")]
        public async Task GetPlayerIdentities_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var query = Fixture.Create<IdentityQueryAlpha>();

            // Act.
            async Task<IActionResult> Action() => await controller.GetPlayerIdentity(new List<IdentityQueryAlpha> {query}).ConfigureAwait(false);

            // Assert.
            Action().Should().BeAssignableTo<Task<IActionResult>>();
            Action().Should().NotBeNull();
            var result = await Action().ConfigureAwait(false) as OkObjectResult;
            var details = result.Value as IList<IdentityResultAlpha>;
            details.Should().NotBeNull();
            details.Should().BeOfType<List<IdentityResultAlpha>>();
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void GetPlayerIdentities_WithInvalidInputs_DoesNotThrow()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var query = new IdentityQueryAlpha {Xuid = default, Gamertag = null};

            // Act.
            Func<Task<IActionResult>> action = async () => await controller.GetPlayerIdentity(new List<IdentityQueryAlpha> { query }).ConfigureAwait(false);

            // Assert.
            action.Should().NotThrow();
        }

        [TestMethod]
        [TestCategory("Unit")]
        public async Task GetPlayerDetails_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var gamertag = Fixture.Create<string>();
            var xuid = Fixture.Create<ulong>();
            var t10Id = Fixture.Create<string>();

            // Act.
            var actions = new List<Func<Task<IActionResult>>>
            {
                async () => await controller.GetPlayerDetails(gamertag).ConfigureAwait(false),
                async () => await controller.GetPlayerDetails(xuid).ConfigureAwait(false),
                async () => await controller.GetPlayerDetails(t10Id).ConfigureAwait(false)
            };

            // Assert.
            foreach (var action in actions)
            {
                action().Should().BeAssignableTo<Task<IActionResult>>();
                action().Should().NotBeNull();
                var result = await action().ConfigureAwait(false) as OkObjectResult;
                var details = result.Value as SunrisePlayerDetails;
                details.Should().NotBeNull();
                details.Should().BeOfType<SunrisePlayerDetails>();
            }
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void GetPlayerDetails_WithNullEmptyWhiteSpaceGamertag_Throws()
        {
            // Arrange.
            var controller = new Dependencies().Build();

            // Act.
            var actions = new List<Func<Task<IActionResult>>>
            {
                async () => await controller.GetPlayerDetails(null).ConfigureAwait(false),
                async () => await controller.GetPlayerDetails(TestConstants.Empty).ConfigureAwait(false),
                async () => await controller.GetPlayerDetails(TestConstants.WhiteSpace).ConfigureAwait(false),
            };

            foreach (var action in actions)
            {
                action.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "gamertag"));
            }
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void GetPlayerDetails_WithValidEndpointKeyHeader_DoesNotThrows()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            controller.Request.Headers.Add("endpointKey", "Sunrise|Retail");
            var gamertag = Fixture.Create<string>();

            // Act.
            Func<Task<IActionResult>> action = async () => await controller.GetPlayerDetails(gamertag).ConfigureAwait(false);

            // Assert.
            action.Should().NotThrow();
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void GetPlayerDetails_EmptyStringEndpointKeyHeader_Throws()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            controller.Request.Headers.Add("endpointKey", "");
            var gamertag = Fixture.Create<string>();

            // Act.
            var actions = new List<Func<Task<IActionResult>>>
            {
                async () => await controller.GetPlayerDetails(gamertag).ConfigureAwait(false),
            };

            foreach (var action in actions)
            {
                action.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "endpointKeyValue"));
            }
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void GetPlayerDetails_InvalidTitleEndpointKeyHeader_Throws()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            controller.Request.Headers.Add("endpointKey", "Opus|Retail");
            var gamertag = Fixture.Create<string>();

            // Act.
            var actions = new List<Func<Task<IActionResult>>>
            {
                async () => await controller.GetPlayerDetails(gamertag).ConfigureAwait(false),
            };

            foreach (var action in actions)
            {
                action.Should().Throw<BadHeaderStewardException>().WithMessage(string.Format(TestConstants.BadHeaderStewardExceptionBadTitleMessagePartial, "Opus", "Sunrise"));
            }
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void GetPlayerDetails_InvalidKeyEndpointKeyHeader_Throws()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            controller.Request.Headers.Add("endpointKey", "Sunrise|Tiger");
            var gamertag = Fixture.Create<string>();

            // Act.
            var actions = new List<Func<Task<IActionResult>>>
            {
                async () => await controller.GetPlayerDetails(gamertag).ConfigureAwait(false),
            };

            foreach (var action in actions)
            {
                action.Should().Throw<BadHeaderStewardException>().WithMessage(string.Format(TestConstants.BadHeaderStewardExceptionBadEndpointKeyMessagePartial, "Tiger", "Sunrise")) ;
            }
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void GetPlayerDetails_NoEndpointKeyEndpointKeyHeader_Throws()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            controller.Request.Headers.Add("endpointKey", "Sunrise|");
            var gamertag = Fixture.Create<string>();

            // Act.
            var actions = new List<Func<Task<IActionResult>>>
            {
                async () => await controller.GetPlayerDetails(gamertag).ConfigureAwait(false),
            };

            foreach (var action in actions)
            {
                action.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "key"));
            }
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void GetPlayerDetails_NoTitleEndpointKeyHeader_Throws()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            controller.Request.Headers.Add("endpointKey", "|Retail");
            var gamertag = Fixture.Create<string>();

            // Act.
            var actions = new List<Func<Task<IActionResult>>>
            {
                async () => await controller.GetPlayerDetails(gamertag).ConfigureAwait(false),
            };

            foreach (var action in actions)
            {
                action.Should().Throw<BadHeaderStewardException>().WithMessage(string.Format(TestConstants.BadHeaderStewardExceptionBadTitleMessagePartial, "", "Sunrise"));
            }
        }

        [TestMethod]
        [TestCategory("Unit")]
        public async Task GetConsoles_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var xuid = Fixture.Create<ulong>();
            var maxResults = Fixture.Create<int>();

            // Act.
            async Task<IActionResult> Action() => await controller.GetConsoles(xuid, maxResults).ConfigureAwait(false);

            // Assert.
            Action().Should().BeAssignableTo<Task<IActionResult>>();
            Action().Should().NotBeNull();
            var result = await Action().ConfigureAwait(false) as OkObjectResult;
            var details = result.Value as IList<ConsoleDetails>;
            details.Should().NotBeNull();
            details.Should().BeOfType<List<ConsoleDetails>>();
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void GetConsoles_WithNegativeMaxResults_Throws()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var xuid = Fixture.Create<ulong>();
            var maxResults = -1;

            // Act.
            Func<Task<IActionResult>> action = async () => await controller.GetConsoles(xuid, maxResults).ConfigureAwait(false);

            // Assert.
            action.Should().Throw<ArgumentOutOfRangeException>().WithMessage(string.Format(TestConstants.ArgumentOutOfRangeExceptionMessagePartial, nameof(maxResults), 0, maxResults));
        }

        [TestMethod]
        [TestCategory("Unit")]
        public async Task GetSharedConsoleUsers_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var xuid = Fixture.Create<ulong>();
            var startIndex = Fixture.Create<int>();
            var maxResults = Fixture.Create<int>();

            // Act.
            async Task<IActionResult> Action() => await controller.GetSharedConsoleUsers(xuid, startIndex, maxResults).ConfigureAwait(false);

            // Assert.
            Action().Should().BeAssignableTo<Task<IActionResult>>();
            Action().Should().NotBeNull();
            var result = await Action().ConfigureAwait(false) as OkObjectResult;
            var details = result.Value as IList<SharedConsoleUser>;
            details.Should().NotBeNull();
            details.Should().BeOfType<List<SharedConsoleUser>>();
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void GetSharedConsoleUsers_WithNegativeStartIndex_Throws()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var xuid = Fixture.Create<ulong>();
            var startIndex = -1;
            var maxResults = Fixture.Create<int>();

            // Act.
            Func<Task<IActionResult>> action = async () => await controller.GetSharedConsoleUsers(xuid, startIndex, maxResults).ConfigureAwait(false);

            // Assert.
            action.Should().Throw<ArgumentOutOfRangeException>().WithMessage(string.Format(TestConstants.ArgumentOutOfRangeExceptionMessagePartial, nameof(startIndex), -1, startIndex));
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void GetSharedConsoleUsers_WithNegativeMaxResults_Throws()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var xuid = Fixture.Create<ulong>();
            var startIndex = Fixture.Create<int>();
            var maxResults = -1;

            // Act.
            Func<Task<IActionResult>> action = async () => await controller.GetSharedConsoleUsers(xuid, startIndex, maxResults).ConfigureAwait(false);

            // Assert.

            action.Should().Throw<ArgumentOutOfRangeException>().WithMessage(string.Format(TestConstants.ArgumentOutOfRangeExceptionMessagePartial, nameof(maxResults), 0, maxResults));
        }

        [TestMethod]
        [TestCategory("Unit")]
        public async Task GetUserFlags_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var xuid = Fixture.Create<ulong>();

            // Act.
            async Task<IActionResult> Action() => await controller.GetUserFlags(xuid).ConfigureAwait(false);

            // Assert.
            Action().Should().BeAssignableTo<Task<IActionResult>>();
            Action().Should().NotBeNull();
            var result = await Action().ConfigureAwait(false) as OkObjectResult;
            var details = result.Value as SunriseUserFlags;
            details.Should().NotBeNull();
            details.Should().BeOfType<SunriseUserFlags>();
        }

        [TestMethod]
        [TestCategory("Unit")]
        public async Task SetUserFlags_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var xuid = Fixture.Create<ulong>();
            var userFlags = Fixture.Create<SunriseUserFlagsInput>();

            // Act.
            async Task<IActionResult> Action() => await controller.SetUserFlags(xuid, userFlags).ConfigureAwait(false);

            // Assert.
            Action().Should().BeAssignableTo<Task<IActionResult>>();
            Action().Should().NotBeNull();
            var result = await Action().ConfigureAwait(false) as OkObjectResult;
            var details = result.Value as SunriseUserFlags;
            details.Should().NotBeNull();
            details.Should().BeOfType<SunriseUserFlags>();
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void SetUserFlags_WithNullUserFlags_Throws()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var xuid = Fixture.Create<ulong>();

            // Act.
            Func<Task<IActionResult>> action = async () => await controller.SetUserFlags(xuid, null).ConfigureAwait(false);

            // Assert.
            action.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "userFlags"));
        }

        [TestMethod]
        [TestCategory("Unit")]
        public async Task GetProfileSummary_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var xuid = Fixture.Create<ulong>();

            // Act.
            async Task<IActionResult> Action() => await controller.GetProfileSummary(xuid).ConfigureAwait(false);

            // Assert.
            Action().Should().BeAssignableTo<Task<IActionResult>>();
            Action().Should().NotBeNull();
            var result = await Action().ConfigureAwait(false) as OkObjectResult;
            var details = result.Value as ProfileSummary;
            details.Should().NotBeNull();
            details.Should().BeOfType<ProfileSummary>();
        }

        [TestMethod]
        [TestCategory("Unit")]
        public async Task GetCreditUpdates_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var xuid = Fixture.Create<ulong>();
            var startIndex = Fixture.Create<int>();
            var maxResults = Fixture.Create<int>();

            // Act.
            async Task<IActionResult> Action() => await controller.GetCreditUpdates(xuid, startIndex, maxResults).ConfigureAwait(false);

            // Assert.
            Action().Should().BeAssignableTo<Task<IActionResult>>();
            Action().Should().NotBeNull();
            var result = await Action().ConfigureAwait(false) as OkObjectResult;
            var details = result.Value as IList<CreditUpdate>;
            details.Should().NotBeNull();
            details.Should().BeOfType<List<CreditUpdate>>();
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void GetCreditUpdates_WithNegativeStartIndex_Throws()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var xuid = Fixture.Create<ulong>();
            var startIndex = -1;
            var maxResults = Fixture.Create<int>();

            // Act.
            Func<Task<IActionResult>> action = async () => await controller.GetCreditUpdates(xuid, startIndex, maxResults).ConfigureAwait(false);

            // Assert.
            action.Should().Throw<ArgumentOutOfRangeException>().WithMessage(string.Format(TestConstants.ArgumentOutOfRangeExceptionMessagePartial, nameof(startIndex), -1, startIndex));
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void GetCreditUpdates_WithNegativeMaxResults_Throws()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var xuid = Fixture.Create<ulong>();
            var startIndex = Fixture.Create<int>();
            var maxResults = -1;

            // Act.
            Func<Task<IActionResult>> action = async () => await controller.GetCreditUpdates(xuid, startIndex, maxResults).ConfigureAwait(false);

            // Assert.
            action.Should().Throw<ArgumentOutOfRangeException>().WithMessage(string.Format(TestConstants.ArgumentOutOfRangeExceptionMessagePartial, nameof(maxResults), 0, maxResults));
        }

        [TestMethod]
        [TestCategory("Unit")]
        public async Task GetBackstagePassUpdates_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var xuid = Fixture.Create<ulong>();

            // Act.
            async Task<IActionResult> Action() => await controller.GetBackstagePassUpdates(xuid).ConfigureAwait(false);

            // Assert.
            Action().Should().BeAssignableTo<Task<IActionResult>>();
            Action().Should().NotBeNull();
            var result = await Action().ConfigureAwait(false) as OkObjectResult;
            var details = result.Value as IList<BackstagePassUpdate>;
            details.Should().NotBeNull();
            details.Should().BeOfType<List<BackstagePassUpdate>>();
        }

        [TestMethod]
        [TestCategory("Unit")]
        public async Task BanPlayers_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var banParameters = GenerateBanParameters();

            // Act.
            async Task<IActionResult> Action() => await controller.BanPlayers(banParameters).ConfigureAwait(false);

            // Assert.
            Action().Should().BeAssignableTo<Task<IActionResult>>();
            Action().Should().NotBeNull();
            var result = await Action().ConfigureAwait(false) as OkObjectResult;
            var details = result.Value as IList<BanResult>;
            details.Should().NotBeNull();
            details.Should().BeOfType<List<BanResult>>();
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void BanPlayers_WithNullBanParameters_Throws()
        {
            // Arrange.
            var controller = new Dependencies().Build();

            // Act.
            Func<Task<IActionResult>> action = async () => await controller.BanPlayers(null).ConfigureAwait(false);

            // Assert.
            action.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "banInput"));
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void BanPlayers_WithValidParameters_UseBackgroundProcessing_DoesNotThrow()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var banParameters = GenerateBanParameters();

            // Act.
            Func<Task<IActionResult>> action = async () => await controller.BanPlayersUseBackgroundProcessing(banParameters).ConfigureAwait(false);

            // Assert.
            action.Should().NotThrow();
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void BanPlayers_WithNullBanParameters_UseBackgroundProcessing_Throws()
        {
            // Arrange.
            var controller = new Dependencies().Build();

            // Act.
            Func<Task<IActionResult>> action = async () => await controller.BanPlayers(null).ConfigureAwait(false);

            // Assert.
            action.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "banInput"));
        }

        [TestMethod]
        [TestCategory("Unit")]
        public async Task GetBanSummaries_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var xuids = Fixture.Create<IList<ulong>>();

            // Act.
            async Task<IActionResult> Action() => await controller.GetBanSummaries(xuids).ConfigureAwait(false);

            // Assert.
            Action().Should().BeAssignableTo<Task<IActionResult>>();
            Action().Should().NotBeNull();
            var result = await Action().ConfigureAwait(false) as OkObjectResult;
            var details = result.Value as IList<BanSummary>;
            details.Should().NotBeNull();
            details.Should().BeOfType<List<BanSummary>>();
        }

        [TestMethod]
        [TestCategory("Unit")]
        public async Task GetProfileNotesAsync_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var xuid = Fixture.Create<ulong>();

            // Act.
            var actions = new List<Func<Task<IActionResult>>>
            {
                async () => await controller.GetProfileNotesAsync(xuid).ConfigureAwait(false),
            };

            // Assert.
            foreach (var action in actions)
            {
                action().Should().BeAssignableTo<Task<IActionResult>>();
                action().Should().NotBeNull();
                var result = await action().ConfigureAwait(false) as OkObjectResult;
                var details = result.Value as IList<SunriseProfileNote>;
                details.Should().NotBeNull();
                details.Should().BeOfType<List<SunriseProfileNote>>();
            }
        }

        [TestMethod]
        [TestCategory("Unit")]
        public async Task AddProfileNoteAsync_WithValidParameters_DoesNotThrow()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var xuid = Fixture.Create<ulong>();
            var note = Fixture.Create<SunriseProfileNote>();

            // Act.
            async Task<IActionResult> Action() => await controller.AddProfileNoteAsync(xuid, note).ConfigureAwait(false);

            // Assert.
            Action().Should().BeAssignableTo<Task<IActionResult>>();
            Action().Should().NotBeNull();
            var result = await Action().ConfigureAwait(false);
            result.Should().BeOfType<OkResult>();
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void AddProfileNoteAsync_WithNullProfileNote_Throws()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var xuid = Fixture.Create<ulong>();

            // Act.
            var actions = new List<Func<Task<IActionResult>>>
            {
                async () => await controller.AddProfileNoteAsync(xuid, null).ConfigureAwait(false)
            };

            // Assert.
            foreach (var action in actions)
            {
                action.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "profileNote"));
            }
        }

        [TestMethod]
        [TestCategory("Unit")]
        public async Task GetBanHistory_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var xuid = Fixture.Create<ulong>();
            var gamertag = Fixture.Create<string>();

            // Act.
            var actions = new List<Func<Task<IActionResult>>>
            {
                async () => await controller.GetBanHistory(xuid).ConfigureAwait(false),
                async () => await controller.GetBanHistory(gamertag).ConfigureAwait(false)
            };

            // Assert.
            foreach (var action in actions)
            {
                action().Should().BeAssignableTo<Task<IActionResult>>();
                action().Should().NotBeNull();
                var result = await action().ConfigureAwait(false) as OkObjectResult;
                var details = result.Value as IList<LiveOpsBanHistory>;
                details.Should().NotBeNull();
                details.Should().BeOfType<List<LiveOpsBanHistory>>();
            }
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void GetBanHistory_WithNullEmptyWhitespaceGamertag_Throws()
        {
            // Arrange.
            var controller = new Dependencies().Build();

            // Act.
            var actions = new List<Func<Task<IActionResult>>>
            {
                async () => await controller.GetBanHistory(null).ConfigureAwait(false),
                async () => await controller.GetBanHistory(TestConstants.Empty).ConfigureAwait(false),
                async () => await controller.GetBanHistory(TestConstants.WhiteSpace).ConfigureAwait(false)
            };

            // Assert.
            foreach (var action in actions)
            {
                action.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "gamertag"));
            }
        }

        [TestMethod]
        [TestCategory("Unit")]
        public async Task SetConsoleBanStatus_WithValidParameters_DoesNotThrow()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var consoleId = Fixture.Create<ulong>();
            var isBanned = true;

            // Act.
            async Task<IActionResult> Action() => await controller.SetConsoleBanStatus(consoleId, isBanned).ConfigureAwait(false);

            // Assert.
            Action().Should().BeAssignableTo<Task<IActionResult>>();
            Action().Should().NotBeNull();
            var result = await Action().ConfigureAwait(false);
            result.Should().BeOfType<OkResult>();
        }

        [TestMethod]
        [TestCategory("Unit")]
        public async Task GetPlayerInventory_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var xuid = Fixture.Create<ulong>();
            var profileId = Fixture.Create<int>();

            // Act.
            var actions = new List<Func<Task<IActionResult>>>
            {
                async () => await controller.GetPlayerInventory(xuid).ConfigureAwait(false),
                async () => await controller.GetPlayerInventoryByProfileId(profileId).ConfigureAwait(false)
            };

            // Assert.
            foreach (var action in actions)
            {
                action().Should().BeAssignableTo<Task<IActionResult>>();
                action().Should().NotBeNull();
                var result = await action().ConfigureAwait(false) as OkObjectResult;
                var details = result.Value as SunrisePlayerInventory;
                details.Should().NotBeNull();
                details.Should().BeOfType<SunrisePlayerInventory>();
            }
        }

        [TestMethod]
        [TestCategory("Unit")]
        public async Task GetgiftInventoryProfiles_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var xuid = Fixture.Create<ulong>();

            // Act.
            async Task<IActionResult> Action() => await controller.GetPlayerInventoryProfiles(xuid).ConfigureAwait(false);

            // Assert.
            Action().Should().BeAssignableTo<Task<IActionResult>>();
            Action().Should().NotBeNull();
            var result = await Action().ConfigureAwait(false) as OkObjectResult;
            var details = result.Value as IList<SunriseInventoryProfile>;
            details.Should().NotBeNull();
            details.Should().BeOfType<List<SunriseInventoryProfile>>();
        }

        [TestMethod]
        [TestCategory("Unit")]
        public async Task GetGroups_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var startIndex = Fixture.Create<int>();
            var maxResults = Fixture.Create<int>();

            // Act.
            async Task<IActionResult> Action() => await controller.GetGroups(startIndex, maxResults).ConfigureAwait(false);

            // Assert.
            Action().Should().BeAssignableTo<Task<IActionResult>>();
            Action().Should().NotBeNull();
            var result = await Action().ConfigureAwait(false) as OkObjectResult;
            var details = result.Value as IList<LspGroup>;
            details.Should().NotBeNull();
            details.Should().BeOfType<List<LspGroup>>();
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void GetGroups_WithNegativeStartIndex_Throws()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            const int startIndex = -1;
            var maxResults = Fixture.Create<int>();

            // Act.
            Func<Task<IActionResult>> action = async () => await controller.GetGroups(startIndex, maxResults).ConfigureAwait(false);

            // Assert.
            action.Should().Throw<ArgumentOutOfRangeException>().WithMessage(string.Format(TestConstants.ArgumentOutOfRangeExceptionMessagePartial, nameof(startIndex), -1, startIndex));
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void GetGroups_WithNegativeMaxResults_Throws()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var startIndex = Fixture.Create<int>();
            const int maxResults = -1;

            // Act.
            Func<Task<IActionResult>> action = async () => await controller.GetGroups(startIndex, maxResults).ConfigureAwait(false);

            // Assert.
            action.Should().Throw<ArgumentOutOfRangeException>().WithMessage(string.Format(TestConstants.ArgumentOutOfRangeExceptionMessagePartial, nameof(maxResults), 0, maxResults));
        }

        [TestMethod]
        [TestCategory("Unit")]
        public async Task UpdatePlayerInventories_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var groupGift = Fixture.Create<SunriseGroupGift>();
            groupGift.Inventory.Cars = new List<MasterInventoryItem> { new MasterInventoryItem { Id = 1, Quantity = 1 } };
            groupGift.Inventory.CarHorns = new List<MasterInventoryItem> { new MasterInventoryItem { Id = 1, Quantity = 1 } };
            groupGift.Inventory.VanityItems = new List<MasterInventoryItem> { new MasterInventoryItem { Id = 1, Quantity = 1 } };
            groupGift.Inventory.Emotes = new List<MasterInventoryItem> { new MasterInventoryItem { Id = 1, Quantity = 1 } };
            groupGift.Inventory.QuickChatLines = new List<MasterInventoryItem> { new MasterInventoryItem { Id = 1, Quantity = 1 } };

            // Act.
            var actions = new List<Func<Task<IActionResult>>>
            {
                async () => await controller.UpdateGroupInventories(groupGift).ConfigureAwait(false),
            };

            // Assert.
            foreach (var action in actions)
            {
                action().Should().BeAssignableTo<Task<IActionResult>>();
                var result = await action().ConfigureAwait(false) as OkObjectResult;
                result.Should().NotBeNull();
                result.StatusCode.Should().Be(200);
                result.Value.Should().NotBeNull();
            }
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void UpdatePlayerInventories_WithNullGroupGift_Throws()
        {
            // Arrange.
            var controller = new Dependencies().Build();

            // Act.
            var actions = new List<Func<Task<IActionResult>>>
            {
                async () => await controller.UpdateGroupInventories(null).ConfigureAwait(false),
            };

            // Assert.
            foreach (var action in actions)
            {
                action.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "groupGift"));
            }
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void UpdatePlayerInventories_WithValidParameters_UseBackgroundProcessing_ReturnsCorrectType()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var groupGift = Fixture.Create<SunriseGroupGift>();
            groupGift.Inventory.Cars = new List<MasterInventoryItem> { new MasterInventoryItem { Id = 1, Quantity = 1 } };
            groupGift.Inventory.CarHorns = new List<MasterInventoryItem> { new MasterInventoryItem { Id = 1, Quantity = 1 } };
            groupGift.Inventory.VanityItems = new List<MasterInventoryItem> { new MasterInventoryItem { Id = 1, Quantity = 1 } };
            groupGift.Inventory.Emotes = new List<MasterInventoryItem> { new MasterInventoryItem { Id = 1, Quantity = 1 } };
            groupGift.Inventory.QuickChatLines = new List<MasterInventoryItem> { new MasterInventoryItem { Id = 1, Quantity = 1 } };

            // Act.
            var actions = new List<Func<Task<IActionResult>>>
            {
                async () => await controller.UpdateGroupInventoriesUseBackgroundProcessing(groupGift).ConfigureAwait(false),
            };

            // Assert.
            foreach (var action in actions)
            {
                // To reset the context and prevent header key collision, rebuild the Dependencies.
                controller = new Dependencies().Build();
                action().Result.Should().BeAssignableTo<CreatedResult>();
            }
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void UpdatePlayerInventories_WithNullGroupGift_UseBackgroundProcessing_Throws()
        {
            // Arrange.
            var controller = new Dependencies().Build();

            // Act.
            var actions = new List<Func<Task<IActionResult>>>
            {
                async () => await controller.UpdateGroupInventories(null).ConfigureAwait(false),
            };

            // Assert.
            foreach (var action in actions)
            {
                action.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "groupGift"));
            }
        }

        [TestMethod]
        [TestCategory("Unit")]
        public async Task UpdateGroupInventories_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var groupId = Fixture.Create<int>();
            var gift = Fixture.Create<SunriseGift>();
            gift.Inventory.Cars = new List<MasterInventoryItem> { new MasterInventoryItem { Id = 1, Quantity = 1 } };
            gift.Inventory.CarHorns = new List<MasterInventoryItem> { new MasterInventoryItem { Id = 1, Quantity = 1 } };
            gift.Inventory.VanityItems = new List<MasterInventoryItem> { new MasterInventoryItem { Id = 1, Quantity = 1 } };
            gift.Inventory.Emotes = new List<MasterInventoryItem> { new MasterInventoryItem { Id = 1, Quantity = 1 } };
            gift.Inventory.QuickChatLines = new List<MasterInventoryItem> { new MasterInventoryItem { Id = 1, Quantity = 1 } };

            // Act.
            async Task<IActionResult> Action() => await controller.UpdateGroupInventories(groupId, gift).ConfigureAwait(false);

            // Assert.
            Action().Should().BeAssignableTo<Task<IActionResult>>();
            var result = await Action().ConfigureAwait(false) as OkObjectResult;
            result.Should().NotBeNull();
            result.StatusCode.Should().Be(200);
            result.Value.Should().NotBeNull();
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void UpdateGroupInventories_WithNullGift_Throws()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var groupId = Fixture.Create<int>();

            // Act.
            Func<Task<IActionResult>> action = async () => await controller.UpdateGroupInventories(groupId, null).ConfigureAwait(false);

            // Assert.
            action.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "gift"));
        }


        [TestMethod]
        [TestCategory("Unit")]
        public async Task GetGiftHistory_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var xuid = Fixture.Create<ulong>();

            // Act.
            async Task<IActionResult> Action() => await controller.GetGiftHistoriesAsync(xuid).ConfigureAwait(false);

            // Assert.
            Action().Should().BeAssignableTo<Task<IActionResult>>();
            Action().Should().NotBeNull();
            var result = await Action().ConfigureAwait(false) as OkObjectResult;
            var details = result.Value as IList<SunriseGiftHistory>;
            details.Should().NotBeNull();
            details.Should().BeOfType<List<SunriseGiftHistory>>();
        }

        [TestMethod]
        [TestCategory("Unit")]
        public async Task GetGroupGiftHistory_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var groupId = Fixture.Create<int>();

            // Act.
            async Task<IActionResult> Action() => await controller.GetGiftHistoriesAsync(groupId).ConfigureAwait(false);

            // Assert.
            Action().Should().BeAssignableTo<Task<IActionResult>>();
            Action().Should().NotBeNull();
            var result = await Action().ConfigureAwait(false) as OkObjectResult;
            var details = result.Value as IList<SunriseGiftHistory>;
            details.Should().NotBeNull();
            details.Should().BeOfType<List<SunriseGiftHistory>>();
        }

        [TestMethod]
        [TestCategory("Unit")]
        public async Task GetPlayerNotifications_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var xuid = Fixture.Create<ulong>();

            // Act.
            async Task<IActionResult> Action() => await controller.GetPlayerNotifications(xuid).ConfigureAwait(false);

            // Assert.
            Action().Should().BeAssignableTo<Task<IActionResult>>();
            Action().Should().NotBeNull();
            var result = await Action().ConfigureAwait(false) as OkObjectResult;
            var details = result.Value as IList<Notification>;
            details.Should().NotBeNull();
            details.Should().BeOfType<List<Notification>>();
        }

        [TestMethod]
        [TestCategory("Unit")]
        public async Task GetGroupNotifications_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var groupId = Fixture.Create<int>();

            // Act.
            async Task<IActionResult> Action() => await controller.GetGroupNotifications(groupId).ConfigureAwait(false);

            // Assert.
            Action().Should().BeAssignableTo<Task<IActionResult>>();
            Action().Should().NotBeNull();
            var result = await Action().ConfigureAwait(false) as OkObjectResult;
            var details = result.Value as IList<UserGroupNotification>;
            details.Should().NotBeNull();
            details.Should().BeOfType<List<UserGroupNotification>>();
        }

        [TestMethod]
        [TestCategory("Unit")]
        public async Task SendPlayerNotifications_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var communityMessage = Fixture.Create<BulkCommunityMessage>();
            communityMessage.Duration = TimeSpan.FromDays(1);

            // Act.
            async Task<IActionResult> Action() => await controller.SendPlayerNotifications(communityMessage).ConfigureAwait(false);

            // Assert.
            Action().Should().BeAssignableTo<Task<IActionResult>>();
            Action().Should().NotBeNull();
            var result = await Action().ConfigureAwait(false) as OkObjectResult;
            var details = result.Value as IList<MessageSendResult<ulong>>;
            details.Should().NotBeNull();
            details.Should().BeOfType<List<MessageSendResult<ulong>>>();
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void SendPlayerNotifications_WithNullCommunityMessage_Throws()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var groupId = Fixture.Create<int>();
            
            // Act.
            var actions = new List<Func<Task<IActionResult>>>
            {
                async () => await controller.SendPlayerNotifications(null).ConfigureAwait(false),
                async () => await controller.SendGroupNotifications(groupId, null).ConfigureAwait(false),
        };

            // Assert.
            foreach (var action in actions)
            {
                action.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "communityMessage"));
            }
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void SendPlayerNotifications_WithNullEmptyWhitespaceMessage_Throws()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var groupId = Fixture.Create<int>();
            var duration = TimeSpan.FromDays(1);
            var deviceType = DeviceType.All;
            
            // Act.
            var actions = new List<Func<Task<IActionResult>>>
            {
                async () => await controller.SendPlayerNotifications(new BulkCommunityMessage{Xuids = new List<ulong>(), Message = null, Duration = duration}).ConfigureAwait(false),
                async () => await controller.SendPlayerNotifications(new BulkCommunityMessage{Xuids = new List<ulong>(), Message = TestConstants.Empty, Duration = duration}).ConfigureAwait(false),
                async () => await controller.SendPlayerNotifications(new BulkCommunityMessage{Xuids = new List<ulong>(), Message = TestConstants.WhiteSpace, Duration = duration}).ConfigureAwait(false),
                async () => await controller.SendGroupNotifications(groupId, new LspGroupCommunityMessage{Message = null, Duration = duration, DeviceType = deviceType}).ConfigureAwait(false),
                async () => await controller.SendGroupNotifications(groupId, new LspGroupCommunityMessage{Message = TestConstants.Empty, Duration = duration, DeviceType = deviceType}).ConfigureAwait(false),
                async () => await controller.SendGroupNotifications(groupId, new LspGroupCommunityMessage{Message = TestConstants.WhiteSpace, Duration = duration, DeviceType = deviceType}).ConfigureAwait(false),
            };

            // Assert.
            foreach (var action in actions)
            {
                action.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "message"));
            }
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void SendPlayerNotifications_WithTooLongMessage_Throws()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var groupId = Fixture.Create<int>();
            var tooLong = new string('*', 520);
            var duration = TimeSpan.FromDays(1);
            var deviceType = DeviceType.All;

            // Act.
            var actions = new List<Func<Task>>
            {
                async () => await controller.SendPlayerNotifications(new BulkCommunityMessage{Xuids = new List<ulong>(), Message = tooLong, Duration = duration}).ConfigureAwait(false),
                async () => await controller.SendGroupNotifications(groupId, new LspGroupCommunityMessage{Message = tooLong, Duration = duration, DeviceType = deviceType}).ConfigureAwait(false),
            };

            // Assert.
            foreach (var action in actions)
            {
                action.Should().Throw<InvalidArgumentsStewardException>().WithMessage(string.Format(TestConstants.ArgumentTooLongExceptionMessagePartial, "Message", "512"));
            }
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void SendPlayerNotifications_WithTooShortDuration_Throws()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var groupId = Fixture.Create<int>();
            var message = Fixture.Create<string>();
            var duration = TimeSpan.FromHours(3);
            var deviceType = DeviceType.All;

            // Act.
            var actions = new List<Func<Task>>
            {
                async () => await controller.SendPlayerNotifications(new BulkCommunityMessage{Xuids = new List<ulong>(), Message = message, Duration = duration}).ConfigureAwait(false),
                async () => await controller.SendGroupNotifications(groupId, new LspGroupCommunityMessage{Message = message, Duration = duration, DeviceType = deviceType}).ConfigureAwait(false),
            };

            // Assert.
            foreach (var action in actions)
            {
                action.Should().Throw<InvalidArgumentsStewardException>().WithMessage(string.Format(TestConstants.ArgumentDurationTooShortMessagePartial, "Duration", TimeSpan.FromDays(1)));
            }
        }

        [TestMethod]
        [TestCategory("Unit")]
        public async Task SendGroupNotifications_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var groupId = TestConstants.InvalidProfileId;
            var communityMessage = Fixture.Create<LspGroupCommunityMessage>();
            communityMessage.Duration = TimeSpan.FromDays(1);
            communityMessage.DeviceType = DeviceType.All;

            // Act.
            async Task<IActionResult> Action() => await controller.SendGroupNotifications(groupId, communityMessage).ConfigureAwait(false);

            // Assert.
            Action().Should().BeAssignableTo<Task<IActionResult>>();
            Action().Should().NotBeNull();
            var result = await Action().ConfigureAwait(false) as OkObjectResult;
            var details = result.Value as MessageSendResult<int>;
            details.Should().NotBeNull();
            details.Should().BeOfType<MessageSendResult<int>>();
        }

        [TestMethod]
        [TestCategory("Unit")]
        public async Task GetAuctions_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var xuid = Fixture.Create<ulong>();

            // Act.
            async Task<IActionResult> Action() => await controller.GetAuctions(xuid).ConfigureAwait(false);

            // Assert.
            Action().Should().BeAssignableTo<Task<IActionResult>>();
            Action().Should().NotBeNull();
            var result = await Action().ConfigureAwait(false) as OkObjectResult;
            var details = result.Value as IList<PlayerAuction>;
            details.Should().NotBeNull();
            details.Should().BeOfType<List<PlayerAuction>>();
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void GetAuctions_WithNullEmptyWhitespaceStatus_Throws()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var xuid = Fixture.Create<ulong>();

            // Act.
            var actions = new List<Func<Task>>
            {
                async () => await controller.GetAuctions(xuid, status:null).ConfigureAwait(false),
                async () => await controller.GetAuctions(xuid, status:TestConstants.Empty).ConfigureAwait(false),
                async () => await controller.GetAuctions(xuid, status:TestConstants.WhiteSpace).ConfigureAwait(false),
            };

            // Assert.
            foreach (var action in actions)
            {
                action.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "status"));
            }
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void GetAuctions_WithNullEmptyWhitespaceSort_Throws()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var xuid = Fixture.Create<ulong>();

            // Act.
            var actions = new List<Func<Task>>
            {
                async () => await controller.GetAuctions(xuid, sort:null).ConfigureAwait(false),
                async () => await controller.GetAuctions(xuid, sort:TestConstants.Empty).ConfigureAwait(false),
                async () => await controller.GetAuctions(xuid, sort:TestConstants.WhiteSpace).ConfigureAwait(false),
            };

            // Assert.
            foreach (var action in actions)
            {
                action.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "sort"));
            }
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void GetAuctions_WithInvalidStatus_Throws()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var xuid = Fixture.Create<ulong>();
            var status = Fixture.Create<string>();

            // Act.
            var actions = new List<Func<Task>>
            {
                async () => await controller.GetAuctions(xuid, status:status).ConfigureAwait(false),
            };

            // Assert.
            foreach (var action in actions)
            {
                action.Should().Throw<InvalidArgumentsStewardException>().WithMessage($"Invalid AuctionStatus provided: {status}");
            }
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void GetAuctions_WithInvalidSort_Throws()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var xuid = Fixture.Create<ulong>();
            var sort = Fixture.Create<string>();

            // Act.
            var actions = new List<Func<Task>>
            {
                async () => await controller.GetAuctions(xuid, sort:sort).ConfigureAwait(false),
            };

            // Assert.
            foreach (var action in actions)
            {
                action.Should().Throw<InvalidArgumentsStewardException>().WithMessage($"Invalid AuctionSort provided: {sort}");
            }
        }

        [TestMethod]
        [TestCategory("Unit")]
        public async Task GetUGCItems_WithValidParams_ReturnsCorrectType()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var xuid = Fixture.Create<ulong>();

            // Act.
            async Task<IActionResult> Action() => await controller.GetUGCItems(xuid).ConfigureAwait(false);

            // Assert.
            Action().Should().BeAssignableTo<Task<IActionResult>>();
            Action().Should().NotBeNull();
            var result = await Action().ConfigureAwait(false) as OkObjectResult;
            var details = result.Value as IList<UGCItem>;
            details.Should().NotBeNull();
            details.Should().BeOfType<List<UGCItem>>();
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void GetUGCItems_WithEmptyUGCType_Throws()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var xuid = Fixture.Create<ulong>();

            // Act.
            var actions = new List<Func<Task>>
            {
                async () => await controller.GetUGCItems(xuid, ugcType: "").ConfigureAwait(false),
            };

            // Assert.
            foreach (var action in actions)
            {
                action.Should().Throw<ArgumentNullException>().WithMessage($"Value cannot be null. (Parameter 'ugcType')");
            }
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void GetUGCItems_WithBadUGCType_Throws()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var xuid = Fixture.Create<ulong>();
            var ugcType = "BAD_ENUM_STRING";

            // Act.
            var actions = new List<Func<Task>>
            {
                async () => await controller.GetUGCItems(xuid, ugcType: ugcType).ConfigureAwait(false),
            };

            // Assert.
            foreach (var action in actions)
            {
                action.Should().Throw<InvalidArgumentsStewardException>().WithMessage($"Invalid UGCType provided: {ugcType}");
            }
        }

        [TestMethod]
        [TestCategory("Unit")]
        public async Task GetUGCLivery_WithValidParams_ReturnsCorrectType()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var contentId = Fixture.Create<Guid>();

            // Act.
            async Task<IActionResult> Action() => await controller.GetUGCLivery(contentId).ConfigureAwait(false);

            // Assert.
            Action().Should().BeAssignableTo<Task<IActionResult>>();
            Action().Should().NotBeNull();
            var result = await Action().ConfigureAwait(false) as OkObjectResult;
            var details = result.Value as UGCItem;
            details.Should().NotBeNull();
            details.Should().BeOfType<UGCItem>();
        }

        [TestMethod]
        [TestCategory("Unit")]
        public async Task GetUGCPhoto_WithValidParams_ReturnsCorrectType()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var contentId = Fixture.Create<Guid>();

            // Act.
            async Task<IActionResult> Action() => await controller.GetUGCPhoto(contentId).ConfigureAwait(false);

            // Assert.
            Action().Should().BeAssignableTo<Task<IActionResult>>();
            Action().Should().NotBeNull();
            var result = await Action().ConfigureAwait(false) as OkObjectResult;
            var details = result.Value as UGCItem;
            details.Should().NotBeNull();
            details.Should().BeOfType<UGCItem>();
        }

        [TestMethod]
        [TestCategory("Unit")]
        public async Task GetUGCTune_WithValidParams_ReturnsCorrectType()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var contentId = Fixture.Create<Guid>();

            // Act.
            async Task<IActionResult> Action() => await controller.GetUGCTune(contentId).ConfigureAwait(false);

            // Assert.
            Action().Should().BeAssignableTo<Task<IActionResult>>();
            Action().Should().NotBeNull();
            var result = await Action().ConfigureAwait(false) as OkObjectResult;
            var details = result.Value as UGCItem;
            details.Should().NotBeNull();
            details.Should().BeOfType<UGCItem>();
        }

        [TestMethod]
        [TestCategory("Unit")]
        public async Task SetUGCFeaturedStatus_WithValidParams_ReturnsCorrectType()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var contentId = Fixture.Create<Guid>();
            var expiry = Fixture.Create<TimeSpan>();

            // Act.
            async Task<IActionResult> Action() => await controller.SetUGCFeaturedStatus(contentId.ToString(), new UGCFeaturedStatus()
            {
                IsFeatured = false,
                Expiry = expiry,
            }).ConfigureAwait(false);

            // Assert.
            Action().Should().BeAssignableTo<Task<IActionResult>>();
            Action().Should().NotBeNull();
            var response = await Action().ConfigureAwait(false) as OkObjectResult;
            response.Should().BeNull();
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void SetUGCFeaturedStatus_WithFeaturedTrueAndMissingExpiryTime_Throws()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var contentId = Fixture.Create<Guid>();

            // Act.
            var actions = new List<Func<Task>>
            {
                async () => await controller.SetUGCFeaturedStatus(contentId.ToString(), new UGCFeaturedStatus()
                {
                    IsFeatured = true,
                    Expiry = null,
                }).ConfigureAwait(false),
            };

            // Assert.
            foreach (var action in actions)
            {
                action.Should().Throw<InvalidArgumentsStewardException>().WithMessage($"Required query param is missing: Expiry");
            }
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void SetUGCFeaturedStatus_WithFeaturedTrueAndExpiryTimeUnderMinimumDuration_Throws()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var contentId = Fixture.Create<Guid>();
            var expiry = new TimeSpan(1, 0, 0); // 1 hour

            // Act.
            var actions = new List<Func<Task>>
            {
                async () => await controller.SetUGCFeaturedStatus(contentId.ToString(), new UGCFeaturedStatus()
                {
                    IsFeatured = true,
                    Expiry = expiry,
                }).ConfigureAwait(false),
            };

            // Assert.
            foreach (var action in actions)
            {
                action.Should().Throw<InvalidArgumentsStewardException>().WithMessage("Expiry cannot be less than 1.00:00:00.");
            }
        }


        private IList<SunriseBanParametersInput> GenerateBanParameters()
        {
            return new List<SunriseBanParametersInput>
            {
                new SunriseBanParametersInput {
                    Xuid = 111,
                    Gamertag = "gamerT1",
                    FeatureArea = "Matchmaking",
                    Reason = "Disgusting license plate.",
                    StartTimeUtc = DateTime.UtcNow,
                    Duration = TimeSpan.FromSeconds(1),
                    BanAllConsoles = false,
                    BanAllPcs = false,
                    DeleteLeaderboardEntries = false,
                    SendReasonNotification = false
                },
                new SunriseBanParametersInput {
                    Xuid = 222,
                    Gamertag = "gamerT2",
                    FeatureArea = "Matchmaking",
                    Reason = "Disgusting license plate.",
                    StartTimeUtc = DateTime.UtcNow,
                    Duration = TimeSpan.FromSeconds(1),
                    BanAllConsoles = false,
                    BanAllPcs = false,
                    DeleteLeaderboardEntries = false,
                    SendReasonNotification = false
                },
                new SunriseBanParametersInput {
                    Xuid = 333,
                    Gamertag = "gamerT3",
                    FeatureArea = "Matchmaking",
                    Reason = "Disgusting license plate.",
                    StartTimeUtc = DateTime.UtcNow,
                    Duration = TimeSpan.FromSeconds(1),
                    BanAllConsoles = false,
                    BanAllPcs = false,
                    DeleteLeaderboardEntries = false,
                    SendReasonNotification = false
                }
            };
        }

        private sealed class Dependencies
        {
            private readonly ControllerContext ControllerContext;

            public Dependencies(bool validConfiguration = true)
            {
                if (validConfiguration)
                {
                    this.Configuration[Arg.Any<string>()].Returns(Fixture.Create<string>());
                }
                else
                {
                    this.Configuration[Arg.Any<string>()].ReturnsNull();
                }

                var httpContext = new DefaultHttpContext();
                httpContext.Request.Path = TestConstants.TestRequestPath;
                httpContext.Request.Host = new HostString(TestConstants.TestRequestHost);
                httpContext.Request.Scheme = TestConstants.TestRequestScheme;

                var claims = new List<Claim> { new Claim("http://schemas.microsoft.com/identity/claims/objectidentifier", "unit-test-azure-object-id") };
                var claimsIdentities = new List<ClaimsIdentity> { new ClaimsIdentity(claims) };
                httpContext.User = new ClaimsPrincipal(claimsIdentities);

                this.ControllerContext = new ControllerContext { HttpContext = httpContext };

                this.KustoProvider.GetMasterInventoryList(Arg.Any<string>()).Returns(new List<MasterInventoryItem> { new MasterInventoryItem { Id = 1, Quantity = 1 } });
                this.KustoProvider.GetDetailedKustoCars(Arg.Any<string>()).Returns(Fixture.Create<IList<KustoCar>>());
                this.SunrisePlayerDetailsProvider.GetPlayerIdentitiesAsync(Arg.Any<List<IdentityQueryAlpha>>(), Arg.Any<string>()).Returns(Fixture.Create<IList<IdentityResultAlpha>>());
                this.SunrisePlayerDetailsProvider.GetPlayerDetailsAsync(Arg.Any<ulong>(), Arg.Any<string>()).Returns(Fixture.Create<SunrisePlayerDetails>());
                this.SunrisePlayerDetailsProvider.GetPlayerDetailsAsync(Arg.Any<string>(), Arg.Any<string>()).Returns(Fixture.Create<SunrisePlayerDetails>());
                this.SunrisePlayerDetailsProvider.GetConsolesAsync(Arg.Any<ulong>(), Arg.Any<int>(), Arg.Any<string>()).Returns(Fixture.Create<IList<ConsoleDetails>>());
                this.SunrisePlayerDetailsProvider.GetSharedConsoleUsersAsync(Arg.Any<ulong>(), Arg.Any<int>(), Arg.Any<int>(), Arg.Any<string>()).Returns(Fixture.Create<IList<SharedConsoleUser>>());
                this.SunrisePlayerDetailsProvider.EnsurePlayerExistsAsync(Arg.Any<ulong>(), Arg.Any<string>()).Returns(true);
                this.SunrisePlayerDetailsProvider.EnsurePlayerExistsAsync(Arg.Any<string>(), Arg.Any<string>()).Returns(true);
                this.SunrisePlayerDetailsProvider.GetUserFlagsAsync(Arg.Any<ulong>(), Arg.Any<string>()).Returns(Fixture.Create<SunriseUserFlags>());
                this.SunrisePlayerDetailsProvider.GetProfileSummaryAsync(Arg.Any<ulong>(), Arg.Any<string>()).Returns(Fixture.Create<ProfileSummary>());
                this.SunrisePlayerDetailsProvider.GetCreditUpdatesAsync(Arg.Any<ulong>(), Arg.Any<int>(), Arg.Any<int>(), Arg.Any<string>()).Returns(Fixture.Create<IList<CreditUpdate>>());
                this.SunrisePlayerDetailsProvider.BanUsersAsync(Arg.Any<List<SunriseBanParameters>>(), Arg.Any<string>(), Arg.Any<string>()).Returns(Fixture.Create<IList<BanResult>>());
                this.SunrisePlayerDetailsProvider.GetUserBanSummariesAsync(Arg.Any<IList<ulong>>(), Arg.Any<string>()).Returns(Fixture.Create<IList<BanSummary>>());
                this.SunrisePlayerDetailsProvider.GetUserBanHistoryAsync(Arg.Any<ulong>(), Arg.Any<string>()).Returns(Fixture.Create<IList<LiveOpsBanHistory>>());
                this.SunrisePlayerDetailsProvider.GetPlayerNotificationsAsync(Arg.Any<ulong>(), Arg.Any<int>(), Arg.Any<string>()).Returns(Fixture.Create<IList<Notification>>());
                this.SunrisePlayerDetailsProvider.GetGroupNotificationsAsync(Arg.Any<int>(), Arg.Any<int>(), Arg.Any<string>()).Returns(Fixture.Create<IList<UserGroupNotification>>());
                this.SunrisePlayerInventoryProvider.GetPlayerInventoryAsync(Arg.Any<ulong>(), Arg.Any<string>()).Returns(Fixture.Create<SunrisePlayerInventory>());
                this.SunrisePlayerInventoryProvider.GetPlayerInventoryAsync(Arg.Any<int>(), Arg.Any<string>()).Returns(Fixture.Create<SunrisePlayerInventory>());
                this.SunrisePlayerInventoryProvider.GetInventoryProfilesAsync(Arg.Any<ulong>(), Arg.Any<string>()).Returns(Fixture.Create<IList<SunriseInventoryProfile>>());
                this.SunriseServiceManagementProvider.GetLspGroupsAsync(Arg.Any<int>(), Arg.Any<int>(), Arg.Any<string>()).Returns(new List<LspGroup>{ new LspGroup{Id = TestConstants.InvalidProfileId, Name = "UnitTesting"} });
                this.SunrisePlayerInventoryProvider.UpdateGroupInventoriesAsync(Arg.Any<int>(), Arg.Any<SunriseGift>(), Arg.Any<string>(), Arg.Any<bool>(), Arg.Any<string>()).Returns(Fixture.Create<GiftResponse<int>>()); ;
                this.SunrisePlayerInventoryProvider.UpdatePlayerInventoriesAsync(Arg.Any<SunriseGroupGift>(), Arg.Any<string>(), Arg.Any<bool>(), Arg.Any<string>()).Returns(Fixture.Create<IList<GiftResponse<ulong>>>());
                this.SunrisePlayerDetailsProvider.SendCommunityMessageAsync(Arg.Any<IList<ulong>>(), Arg.Any<string>(), Arg.Any<DateTime>(), Arg.Any<string>()).Returns(Fixture.Create<IList<MessageSendResult<ulong>>>());
                this.SunrisePlayerDetailsProvider.SendCommunityMessageAsync(Arg.Any<int>(), Arg.Any<string>(), Arg.Any<DateTime>(), Arg.Any<DeviceType>(), Arg.Any<string>()).Returns(Fixture.Create<MessageSendResult<int>>());
                this.SunrisePlayerDetailsProvider.GetProfileNotesAsync(Arg.Any<ulong>(), Arg.Any<string>()).Returns(Fixture.Create<IList<SunriseProfileNote>>());
                this.SunrisePlayerDetailsProvider.GetBackstagePassUpdatesAsync(Arg.Any<ulong>(), Arg.Any<string>()).Returns(Fixture.Create<IList<BackstagePassUpdate>>());
                this.SunrisePlayerDetailsProvider.GetPlayerAuctionsAsync(Arg.Any<ulong>(), Arg.Any<AuctionFilters>(), Arg.Any<string>()).Returns(Fixture.Create<IList<PlayerAuction>>());
                this.StorefrontProvider.SearchUGCItems(Arg.Any<UGCType>(), Arg.Any<UGCFilters>(), Arg.Any<string>()).Returns(Fixture.Create<IList<UGCItem>>());
                this.StorefrontProvider.GetUGCLivery(Arg.Any<Guid>(), Arg.Any<string>()).Returns(Fixture.Create<UGCItem>());
                this.StorefrontProvider.GetUGCPhoto(Arg.Any<Guid>(), Arg.Any<string>()).Returns(Fixture.Create<UGCItem>());
                this.StorefrontProvider.GetUGCTune(Arg.Any<Guid>(), Arg.Any<string>()).Returns(Fixture.Create<UGCItem>());
                this.StorefrontProvider.SetUGCFeaturedStatus(Arg.Any<Guid>(), Arg.Any<bool>(), Arg.Any<TimeSpan>(), Arg.Any<string>());
                this.JobTracker.CreateNewJobAsync(Arg.Any<string>(), Arg.Any<string>(), Arg.Any<string>()).Returns(Fixture.Create<string>());
                this.KeyVaultProvider.GetSecretAsync(Arg.Any<string>(), Arg.Any<string>()).Returns(TestConstants.GetSecretResult);
                this.GiftHistoryProvider.GetGiftHistoriesAsync(Arg.Any<string>(), Arg.Any<string>(), Arg.Any<GiftIdentityAntecedent>(), Arg.Any<string>()).Returns(Fixture.Create<IList<SunriseGiftHistory>>());
            }
            public ILoggingService LoggingService { get; set; } = Substitute.For<ILoggingService>();

            public IKustoProvider KustoProvider { get; set; } = Substitute.For<IKustoProvider>();
            
            public ISunrisePlayerDetailsProvider SunrisePlayerDetailsProvider { get; set; } = Substitute.For<ISunrisePlayerDetailsProvider>();

            public ISunrisePlayerInventoryProvider SunrisePlayerInventoryProvider { get; set; } = Substitute.For<ISunrisePlayerInventoryProvider>();

            public ISunriseStorefrontProvider StorefrontProvider { get; set; } = Substitute.For<ISunriseStorefrontProvider>();

            public ISunriseServiceManagementProvider SunriseServiceManagementProvider { get; set; } = Substitute.For<ISunriseServiceManagementProvider>();

            public IKeyVaultProvider KeyVaultProvider { get; set; } = Substitute.For<IKeyVaultProvider>();

            public ISunriseGiftHistoryProvider GiftHistoryProvider { get; set; } = Substitute.For<ISunriseGiftHistoryProvider>();

            public ISunriseBanHistoryProvider BanHistoryProvider { get; set; } = Substitute.For<ISunriseBanHistoryProvider>();

            public IConfiguration Configuration { get; set; } = Substitute.For<IConfiguration>();

            public IScheduler Scheduler { get; set; } = Substitute.For<IScheduler>();

            public IJobTracker JobTracker { get; set; } = Substitute.For<IJobTracker>();

            public IMapper Mapper { get; set; } = Substitute.ForPartsOf<Mapper>(new MapperConfiguration(mc =>
            {
                mc.AddProfile(new SunriseProfileMapper());
                mc.AllowNullCollections = true;
            }));

            public IRequestValidator<SunriseMasterInventory> MasterInventoryRequestValidator { get; set; } = Substitute.For<IRequestValidator<SunriseMasterInventory>>();

            public IRequestValidator<SunriseGift> GiftRequestValidator { get; set; } = Substitute.For<IRequestValidator<SunriseGift>>();

            public IRequestValidator<SunriseGroupGift> GroupGiftRequestValidator { get; set; } = Substitute.For<IRequestValidator<SunriseGroupGift>>();

            public IRequestValidator<SunriseBanParametersInput> BanParametersRequestValidator { get; set; } = Substitute.For<IRequestValidator<SunriseBanParametersInput>>();

            public IRequestValidator<SunriseUserFlagsInput> UserFlagsRequestValidator { get; set; } = Substitute.For<IRequestValidator<SunriseUserFlagsInput>>();

            public SunriseController Build() => new SunriseController(
                new MemoryCache(new MemoryCacheOptions()),
                this.LoggingService,
                this.KustoProvider,
                this.SunrisePlayerDetailsProvider,
                this.SunrisePlayerInventoryProvider,
                this.SunriseServiceManagementProvider,
                this.KeyVaultProvider,
                this.GiftHistoryProvider,
                this.BanHistoryProvider,
                this.StorefrontProvider,
                this.Configuration,
                this.Scheduler,
                this.JobTracker,
                this.Mapper,
                this.MasterInventoryRequestValidator,
                this.GiftRequestValidator,
                this.GroupGiftRequestValidator,
                this.BanParametersRequestValidator,
                this.UserFlagsRequestValidator)
            { ControllerContext = this.ControllerContext };
        }
    }
}
