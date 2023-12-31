﻿using AutoFixture;
using AutoMapper;
using FluentAssertions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using NSubstitute.ReturnsExtensions;
using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using Turn10.Data.SecretProvider;
using Turn10.LiveOps.StewardApi.Common;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Data;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Contracts.Woodstock;
using Turn10.LiveOps.StewardApi.Controllers;
using Turn10.LiveOps.StewardApi.Logging;
using Turn10.LiveOps.StewardApi.ProfileMappers;
using Turn10.LiveOps.StewardApi.Providers;
using Turn10.LiveOps.StewardApi.Providers.Data;
using Turn10.LiveOps.StewardApi.Providers.Woodstock;
using Turn10.LiveOps.StewardApi.Proxies.Lsp.Woodstock;
using Turn10.LiveOps.StewardApi.Validation;
using Turn10.LiveOps.StewardTest.Utilities;
using Turn10.Services.LiveOps.FH5_main.Generated;

namespace Turn10.LiveOps.StewardTest.Unit.Woodstock.ControllerTests
{
    [TestClass]
    public sealed class WoodstockControllerTests
    {
        private static readonly Fixture Fixture = new Fixture();
        private const ulong ValidXuid = 2535405314408422; // Testing 01001 (lugeiken)

        [TestMethod]
        [UnitTest]
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
        [UnitTest]
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
        [UnitTest]
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
        [UnitTest]
        public void Ctor_WhenWoodstockPlayerDetailsProviderNull_Throws()
        {
            // Arrange.
            var dependencies = new Dependencies { WoodstockPlayerDetailsProvider = null };

            // Act.
            Action act = () => dependencies.Build();

            // Assert.
            act.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "woodstockPlayerDetailsProvider"));
        }

        [TestMethod]
        [UnitTest]
        public void Ctor_WhenWoodstockPlayerInventoryProviderNull_Throws()
        {
            // Arrange.
            var dependencies = new Dependencies { WoodstockPlayerInventoryProvider = null };

            // Act.
            Action act = () => dependencies.Build();

            // Assert.
            act.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "woodstockPlayerInventoryProvider"));
        }

        [TestMethod]
        [UnitTest]
        public void Ctor_WhenWoodstockServiceManagementProviderNull_Throws()
        {
            // Arrange.
            var dependencies = new Dependencies { WoodstockServiceManagementProvider = null };

            // Act.
            Action act = () => dependencies.Build();

            // Assert.
            act.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "woodstockServiceManagementProvider"));
        }

        [TestMethod]
        [UnitTest]
        public void Ctor_WhenWoodstockNotificationProviderNull_Throws()
        {
            // Arrange.
            var dependencies = new Dependencies { WoodstockNotificationProvider = null };

            // Act.
            Action act = () => dependencies.Build();

            // Assert.
            act.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "woodstockNotificationProvider"));
        }

        [TestMethod]
        [UnitTest]
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
        [UnitTest]
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
        [UnitTest]
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
        [UnitTest]
        public void Ctor_WhenNotificationHistoryProviderNull_Throws()
        {
            // Arrange.
            var dependencies = new Dependencies { NotificationHistoryProvider = null };

            // Act.
            Action act = () => dependencies.Build();

            // Assert.
            act.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "notificationHistoryProvider"));
        }

        [TestMethod]
        [UnitTest]
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
        [UnitTest]
        public void Ctor_WhenItemsProviderNull_Throws()
        {
            // Arrange.
            var dependencies = new Dependencies { ItemsProvider = null };

            // Act.
            Action act = () => dependencies.Build();

            // Assert.
            act.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "itemsProvider"));
        }

        [TestMethod]
        [UnitTest]
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
        [UnitTest]
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
        [UnitTest]
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
        [UnitTest]
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
        [UnitTest]
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
        [UnitTest]
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
        [UnitTest]
        public async Task GetPlayerIdentities_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var query = Fixture.Create<IdentityQueryAlpha>();

            // Act.
            async Task<IActionResult> Action() => await controller.GetPlayerIdentity(new List<IdentityQueryAlpha> { query }).ConfigureAwait(false);

            // Assert.
            Action().Should().BeAssignableTo<Task<IActionResult>>();
            Action().Should().NotBeNull();
            var result = await Action().ConfigureAwait(false) as OkObjectResult;
            var details = result.Value as IList<IdentityResultAlpha>;
            details.Should().NotBeNull();
            details.Should().BeOfType<List<IdentityResultAlpha>>();
        }

        [TestMethod]
        [UnitTest]
        public void GetPlayerIdentities_WithInvalidInputs_DoesNotThrow()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var query = new IdentityQueryAlpha { Xuid = default, Gamertag = null };

            // Act.
            Func<Task<IActionResult>> action = async () => await controller.GetPlayerIdentity(new List<IdentityQueryAlpha> { query }).ConfigureAwait(false);

            // Assert.
            action.Should().NotThrow();
        }

        [TestMethod]
        [UnitTest]
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
                var details = result.Value as WoodstockPlayerDetails;
                details.Should().NotBeNull();
                details.Should().BeOfType<WoodstockPlayerDetails>();
            }
        }

        [TestMethod]
        [UnitTest]
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
        [UnitTest]
        public void GetPlayerDetails_WithValidEndpointKeyHeader_DoesNotThrows()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            controller.Request.Headers.Add("endpointKey", "Woodstock|Retail");
            var gamertag = Fixture.Create<string>();

            // Act.
            Func<Task<IActionResult>> action = async () => await controller.GetPlayerDetails(gamertag).ConfigureAwait(false);

            // Assert.
            action.Should().NotThrow();
        }

        [TestMethod]
        [UnitTest]
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
        [UnitTest]
        public void GetPlayerDetails_InvalidTitleEndpointKeyHeader_Throws()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            controller.Request.Headers.Add("endpointKey", "Opus|Development");
            var gamertag = Fixture.Create<string>();

            // Act.
            var actions = new List<Func<Task<IActionResult>>>
            {
                async () => await controller.GetPlayerDetails(gamertag).ConfigureAwait(false),
            };

            foreach (var action in actions)
            {
                action.Should().Throw<BadHeaderStewardException>().WithMessage(string.Format(TestConstants.BadHeaderStewardExceptionBadTitleMessagePartial, "Opus", "Woodstock"));
            }
        }

        [TestMethod]
        [UnitTest]
        public void GetPlayerDetails_InvalidKeyEndpointKeyHeader_Throws()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            controller.Request.Headers.Add("endpointKey", "Woodstock|Tiger");
            var gamertag = Fixture.Create<string>();

            // Act.
            var actions = new List<Func<Task<IActionResult>>>
            {
                async () => await controller.GetPlayerDetails(gamertag).ConfigureAwait(false),
            };

            foreach (var action in actions)
            {
                action.Should().Throw<BadHeaderStewardException>().WithMessage(string.Format(TestConstants.BadHeaderStewardExceptionBadEndpointKeyMessagePartial, "Tiger", "Woodstock"));
            }
        }

        [TestMethod]
        [UnitTest]
        public void GetPlayerDetails_NoEndpointKeyEndpointKeyHeader_Throws()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            controller.Request.Headers.Add("endpointKey", "Woodstock|");
            var gamertag = Fixture.Create<string>();

            // Act.
            var actions = new List<Func<Task<IActionResult>>>
            {
                async () => await controller.GetPlayerDetails(gamertag).ConfigureAwait(false),
            };

            foreach (var action in actions)
            {
                action.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "endpointKey"));
            }
        }

        [TestMethod]
        [UnitTest]
        public void GetPlayerDetails_NoTitleEndpointKeyHeader_Throws()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            controller.Request.Headers.Add("endpointKey", "|Development");
            var gamertag = Fixture.Create<string>();

            // Act.
            var actions = new List<Func<Task<IActionResult>>>
            {
                async () => await controller.GetPlayerDetails(gamertag).ConfigureAwait(false),
            };

            foreach (var action in actions)
            {
                action.Should().Throw<BadHeaderStewardException>().WithMessage(string.Format(TestConstants.BadHeaderStewardExceptionBadTitleMessagePartial, "", "Woodstock"));
            }
        }

        [TestMethod]
        [UnitTest]
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
        [UnitTest]
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
        [UnitTest]
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
        [UnitTest]
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
        [UnitTest]
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
        [UnitTest]
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
            var details = result.Value as WoodstockUserFlags;
            details.Should().NotBeNull();
            details.Should().BeOfType<WoodstockUserFlags>();
        }

        [TestMethod]
        [UnitTest]
        public async Task SetUserFlags_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var xuid = ValidXuid;
            var userFlags = Fixture.Create<WoodstockUserFlagsInput>();

            // Act.
            async Task<IActionResult> Action() => await controller.SetUserFlags(xuid, userFlags).ConfigureAwait(false);

            // Assert.
            Action().Should().BeAssignableTo<Task<IActionResult>>();
            Action().Should().NotBeNull();
            var result = await Action().ConfigureAwait(false) as OkObjectResult;
            var details = result.Value as WoodstockUserFlags;
            details.Should().NotBeNull();
            details.Should().BeOfType<WoodstockUserFlags>();
        }

        [TestMethod]
        [UnitTest]
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
        [UnitTest]
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
        [UnitTest]
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
        [UnitTest]
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
        [UnitTest]
        public async Task GetBanHistory_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var xuid = TestUtilities.GenerateValidTestXuid(); ;
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
        [UnitTest]
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
        [UnitTest]
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
        [UnitTest]
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
                var details = result.Value as WoodstockPlayerInventory;
                details.Should().NotBeNull();
                details.Should().BeOfType<WoodstockPlayerInventory>();
            }
        }

        [TestMethod]
        [UnitTest]
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
            var details = result.Value as IList<WoodstockInventoryProfile>;
            details.Should().NotBeNull();
            details.Should().BeOfType<List<WoodstockInventoryProfile>>();
        }

        [TestMethod]
        [UnitTest]
        public async Task GetGroups_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var controller = new Dependencies().Build();

            // Act.
            async Task<IActionResult> Action() => await controller.GetGroups().ConfigureAwait(false);

            // Assert.
            Action().Should().BeAssignableTo<Task<IActionResult>>();
            Action().Should().NotBeNull();
            var result = await Action().ConfigureAwait(false) as OkObjectResult;
            var details = result.Value as IList<LspGroup>;
            details.Should().NotBeNull();
            details.Should().BeOfType<List<LspGroup>>();
        }

        [TestMethod]
        [UnitTest]
        public async Task GetGiftHistory_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var xuid = Fixture.Create<ulong>();
            var startDate = Fixture.Create<DateTimeOffset>();
            var endDate = startDate.AddDays(10);

            // Act.
            async Task<IActionResult> Action() => await controller.GetGiftHistoriesAsync(xuid, startDate, endDate).ConfigureAwait(false);

            // Assert.
            Action().Should().BeAssignableTo<Task<IActionResult>>();
            Action().Should().NotBeNull();
            var result = await Action().ConfigureAwait(false) as OkObjectResult;
            var details = result.Value as IList<WoodstockGiftHistory>;
            details.Should().NotBeNull();
            details.Should().BeOfType<List<WoodstockGiftHistory>>();
        }

        [TestMethod]
        [UnitTest]
        public async Task GetGroupGiftHistory_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var groupId = Fixture.Create<int>();
            var startDate = Fixture.Create<DateTimeOffset>();
            var endDate = startDate.AddDays(10);

            // Act.
            async Task<IActionResult> Action() => await controller.GetGiftHistoriesAsync(groupId, startDate, endDate).ConfigureAwait(false);

            // Assert.
            Action().Should().BeAssignableTo<Task<IActionResult>>();
            Action().Should().NotBeNull();
            var result = await Action().ConfigureAwait(false) as OkObjectResult;
            var details = result.Value as IList<WoodstockGiftHistory>;
            details.Should().NotBeNull();
            details.Should().BeOfType<List<WoodstockGiftHistory>>();
        }

        [TestMethod]
        [UnitTest]
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
        [UnitTest]
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
        [UnitTest]
        public async Task SendPlayerNotifications_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var communityMessage = Fixture.Create<BulkCommunityMessage>();
            communityMessage.StartTimeUtc = DateTime.UtcNow.AddMinutes(1);
            communityMessage.ExpireTimeUtc = DateTime.UtcNow.AddMinutes(5);
            communityMessage.Xuids = new List<ulong>() { ValidXuid };

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
        [UnitTest]
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
        [UnitTest]
        public void SendPlayerNotifications_WithNullEmptyWhitespaceMessage_Throws()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var groupId = Fixture.Create<int>();
            var sendDate = DateTime.UtcNow.AddMinutes(1);
            var endDate = DateTime.UtcNow.AddMinutes(5);
            var deviceType = DeviceType.All;

            // Act.
            var actions = new List<Func<Task<IActionResult>>>
            {
                async () => await controller.SendPlayerNotifications(new BulkCommunityMessage{Xuids = new List<ulong>(), Message = null, StartTimeUtc = sendDate, ExpireTimeUtc = endDate}).ConfigureAwait(false),
                async () => await controller.SendPlayerNotifications(new BulkCommunityMessage{Xuids = new List<ulong>(), Message = TestConstants.Empty, StartTimeUtc = sendDate, ExpireTimeUtc = endDate}).ConfigureAwait(false),
                async () => await controller.SendPlayerNotifications(new BulkCommunityMessage{Xuids = new List<ulong>(), Message = TestConstants.WhiteSpace, StartTimeUtc = sendDate, ExpireTimeUtc = endDate}).ConfigureAwait(false),
                async () => await controller.SendGroupNotifications(groupId, new LspGroupCommunityMessage{Message = null, StartTimeUtc = sendDate, ExpireTimeUtc = endDate, DeviceType = deviceType}).ConfigureAwait(false),
                async () => await controller.SendGroupNotifications(groupId, new LspGroupCommunityMessage{Message = TestConstants.Empty, StartTimeUtc = sendDate, ExpireTimeUtc = endDate, DeviceType = deviceType}).ConfigureAwait(false),
                async () => await controller.SendGroupNotifications(groupId, new LspGroupCommunityMessage{Message = TestConstants.WhiteSpace, StartTimeUtc = sendDate, ExpireTimeUtc = endDate, DeviceType = deviceType}).ConfigureAwait(false),
            };

            // Assert.
            foreach (var action in actions)
            {
                action.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "message"));
            }
        }

        [TestMethod]
        [UnitTest]
        public void SendPlayerNotifications_WithTooLongMessage_Throws()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var groupId = Fixture.Create<int>();
            var tooLong = new string('*', 520);
            var sendDate = DateTime.UtcNow.AddMinutes(1);
            var endDate = DateTime.UtcNow.AddMinutes(5);
            var deviceType = DeviceType.All;

            // Act.
            var actions = new List<Func<Task>>
            {
                async () => await controller.SendPlayerNotifications(new BulkCommunityMessage{Xuids = new List<ulong>(), Message = tooLong, StartTimeUtc = sendDate, ExpireTimeUtc = endDate}).ConfigureAwait(false),
                async () => await controller.SendGroupNotifications(groupId, new LspGroupCommunityMessage(){Message = tooLong, StartTimeUtc = sendDate, ExpireTimeUtc = endDate, DeviceType = deviceType}).ConfigureAwait(false),
            };

            // Assert.
            foreach (var action in actions)
            {
                action.Should().Throw<InvalidArgumentsStewardException>().WithMessage(string.Format(TestConstants.ArgumentTooLongExceptionMessagePartial, "Message", "512"));
            }
        }

        [TestMethod]
        [UnitTest]
        public void SendPlayerNotifications_WithExpireBeforeNow_Throws()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var groupId = Fixture.Create<int>();
            var message = Fixture.Create<string>();
            var sendDate = DateTime.UtcNow.AddMinutes(1);
            var endDate = DateTime.UtcNow.AddMinutes(-5);
            var deviceType = DeviceType.All;

            // Act.
            var actions = new List<Func<Task>>
            {
                async () => await controller.SendPlayerNotifications(new BulkCommunityMessage{Xuids = new List<ulong>(), Message = message, StartTimeUtc = sendDate, ExpireTimeUtc = endDate}).ConfigureAwait(false),
                async () => await controller.SendGroupNotifications(groupId, new LspGroupCommunityMessage{Message = message, StartTimeUtc = sendDate, ExpireTimeUtc = endDate, DeviceType = deviceType}).ConfigureAwait(false),
            };

            // Assert.
            foreach (var action in actions)
            {
                action.Should().Throw<InvalidArgumentsStewardException>().WithMessage($"ExpireTimeUtc: {endDate} must come after StartTimeUtc: {sendDate}.");
            }
        }

        [TestMethod]
        [UnitTest]
        public async Task SendGroupNotifications_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var groupId = TestConstants.InvalidProfileId;
            var communityMessage = Fixture.Create<LspGroupCommunityMessage>();
            communityMessage.StartTimeUtc = DateTime.UtcNow.AddMinutes(1);
            communityMessage.ExpireTimeUtc = DateTime.UtcNow.AddMinutes(5);
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
        [UnitTest]
        public async Task EditNotification_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var notificationId = Fixture.Create<Guid>();
            var xuid = ValidXuid;
            var communityMessageEdit = Fixture.Create<CommunityMessage>();
            communityMessageEdit.StartTimeUtc = DateTime.UtcNow.AddMinutes(1);
            communityMessageEdit.ExpireTimeUtc = DateTime.UtcNow.AddMinutes(5);

            // Act.
            async Task<IActionResult> Action() => await controller.EditPlayerNotification(notificationId, xuid, communityMessageEdit).ConfigureAwait(false);

            // Assert.
            Action().Should().BeAssignableTo<Task<IActionResult>>();
            Action().Should().NotBeNull();
            var result = await Action().ConfigureAwait(false);
            result.Should().BeOfType<OkResult>();
        }

        [TestMethod]
        [UnitTest]
        public async Task EditGroupNotification_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var notificationId = Fixture.Create<Guid>();
            var communityMessageEdit = Fixture.Create<LspGroupCommunityMessage>();
            communityMessageEdit.StartTimeUtc = DateTime.UtcNow.AddMinutes(1);
            communityMessageEdit.ExpireTimeUtc = DateTime.UtcNow.AddMinutes(5);
            communityMessageEdit.DeviceType = DeviceType.All;

            // Act.
            async Task<IActionResult> Action() => await controller.EditGroupNotification(notificationId, communityMessageEdit).ConfigureAwait(false);

            // Assert.
            Action().Should().BeAssignableTo<Task<IActionResult>>();
            Action().Should().NotBeNull();
            var result = await Action().ConfigureAwait(false);
            result.Should().BeOfType<OkResult>();
        }

        [TestMethod]
        [UnitTest]
        public void EditNotification_WithNullEditParameters_Throws()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var notificationId = Fixture.Create<Guid>();
            var xuid = Fixture.Create<ulong>();

            // Act.
            var actions = new List<Func<Task<IActionResult>>>
            {
                async () => await controller.EditPlayerNotification(notificationId, xuid, null).ConfigureAwait(false),
                async () => await controller.EditGroupNotification(notificationId, null).ConfigureAwait(false),
            };

            // Assert.
            foreach (var action in actions)
            {
                action.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "editParameters"));
            }
        }

        [TestMethod]
        [UnitTest]
        public void EditNotification_WithNullEmptyWhitespaceMessage_Throws()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var notificationId = Fixture.Create<Guid>();
            var xuid = Fixture.Create<ulong>();
            var sendDate = DateTime.UtcNow.AddMinutes(1);
            var endDate = DateTime.UtcNow.AddMinutes(5);
            var deviceType = DeviceType.All;

            // Act.
            var actions = new List<Func<Task<IActionResult>>>
            {
                async () => await controller.EditPlayerNotification(notificationId, xuid, new CommunityMessage{Message = null, StartTimeUtc = sendDate, ExpireTimeUtc = endDate}).ConfigureAwait(false),
                async () => await controller.EditPlayerNotification(notificationId, xuid, new CommunityMessage{Message = TestConstants.Empty, StartTimeUtc = sendDate, ExpireTimeUtc = endDate}).ConfigureAwait(false),
                async () => await controller.EditPlayerNotification(notificationId, xuid, new CommunityMessage{Message = TestConstants.WhiteSpace, StartTimeUtc = sendDate, ExpireTimeUtc = endDate}).ConfigureAwait(false),
                async () => await controller.EditGroupNotification(notificationId, new LspGroupCommunityMessage{Message = null, StartTimeUtc = sendDate, ExpireTimeUtc = endDate, DeviceType = deviceType}).ConfigureAwait(false),
                async () => await controller.EditGroupNotification(notificationId, new LspGroupCommunityMessage{Message = TestConstants.Empty, StartTimeUtc = sendDate, ExpireTimeUtc = endDate, DeviceType = deviceType}).ConfigureAwait(false),
                async () => await controller.EditGroupNotification(notificationId, new LspGroupCommunityMessage{Message = TestConstants.WhiteSpace, StartTimeUtc = sendDate, ExpireTimeUtc = endDate, DeviceType = deviceType}).ConfigureAwait(false),
            };

            // Assert.
            foreach (var action in actions)
            {
                action.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "message"));
            }
        }

        [TestMethod]
        [UnitTest]
        public void EditPlayerNotifications_WithTooLongMessage_Throws()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var notificationId = Fixture.Create<Guid>();
            var xuid = Fixture.Create<ulong>();
            var tooLong = new string('*', 520);
            var sendDate = DateTime.UtcNow.AddMinutes(1);
            var endDate = DateTime.UtcNow.AddMinutes(5);
            var deviceType = DeviceType.All;

            // Act.
            var actions = new List<Func<Task>>
            {
                async () => await controller.EditPlayerNotification(notificationId, xuid, new CommunityMessage{Message = tooLong, StartTimeUtc = sendDate, ExpireTimeUtc = endDate}).ConfigureAwait(false),
                async () => await controller.EditGroupNotification(notificationId, new LspGroupCommunityMessage{Message = tooLong, StartTimeUtc = sendDate, ExpireTimeUtc = endDate, DeviceType = deviceType}).ConfigureAwait(false),
            };

            // Assert.
            foreach (var action in actions)
            {
                action.Should().Throw<InvalidArgumentsStewardException>().WithMessage(string.Format(TestConstants.ArgumentTooLongExceptionMessagePartial, "Message", "512"));
            }
        }

        [TestMethod]
        [UnitTest]
        public async Task DeleteNotification_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var notificationId = Fixture.Create<Guid>();
            var xuid = ValidXuid;

            // Act.
            async Task<IActionResult> Action() => await controller.DeletePlayerNotification(notificationId, xuid).ConfigureAwait(false);

            // Assert.
            Action().Should().BeAssignableTo<Task<IActionResult>>();
            Action().Should().NotBeNull();
            var result = await Action().ConfigureAwait(false);
            result.Should().BeOfType<OkResult>();
        }

        [TestMethod]
        [UnitTest]
        public async Task DeleteGroupNotification_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var notificationId = Fixture.Create<Guid>();

            // Act.
            async Task<IActionResult> Action() => await controller.DeleteGroupNotification(notificationId).ConfigureAwait(false);

            // Assert.
            Action().Should().BeAssignableTo<Task<IActionResult>>();
            Action().Should().NotBeNull();
            var result = await Action().ConfigureAwait(false);
            result.Should().BeOfType<OkResult>();
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

                var fakeMasterInventory = new WoodstockMasterInventory()
                {
                    CreditRewards = new List<MasterInventoryItem>() { new MasterInventoryItem { Id = 1, Quantity = 1 } },
                    Cars = new List<MasterInventoryItem>() { new MasterInventoryItem { Id = 1, Quantity = 1 } },
                    CarHorns = new List<MasterInventoryItem>() { new MasterInventoryItem { Id = 1, Quantity = 1 } },
                    VanityItems = new List<MasterInventoryItem>() { new MasterInventoryItem { Id = 1, Quantity = 1 } },
                    Emotes = new List<MasterInventoryItem>() { new MasterInventoryItem { Id = 1, Quantity = 1 } },
                    QuickChatLines = new List<MasterInventoryItem>() { new MasterInventoryItem { Id = 1, Quantity = 1 } },
                };

                this.WoodstockPlayerDetailsProvider.GetPlayerIdentitiesAsync(Arg.Any<IList<IdentityQueryAlpha>>(), Arg.Any<string>()).Returns(Fixture.Create<IList<IdentityResultAlpha>>());
                this.WoodstockPlayerDetailsProvider.GetPlayerDetailsAsync(Arg.Any<ulong>(), Arg.Any<string>()).Returns(Fixture.Create<WoodstockPlayerDetails>());
                this.WoodstockPlayerDetailsProvider.GetPlayerDetailsAsync(Arg.Any<string>(), Arg.Any<string>()).Returns(Fixture.Create<WoodstockPlayerDetails>());
                this.WoodstockPlayerDetailsProvider.GetConsolesAsync(Arg.Any<ulong>(), Arg.Any<int>(), Arg.Any<string>()).Returns(Fixture.Create<IList<ConsoleDetails>>());
                this.WoodstockPlayerDetailsProvider.GetSharedConsoleUsersAsync(Arg.Any<ulong>(), Arg.Any<int>(), Arg.Any<int>(), Arg.Any<string>()).Returns(Fixture.Create<IList<SharedConsoleUser>>());
                this.WoodstockPlayerDetailsProvider.DoesPlayerExistAsync(Arg.Any<ulong>(), Arg.Any<string>()).Returns(true);
                this.WoodstockPlayerDetailsProvider.DoesPlayerExistAsync(Arg.Any<string>(), Arg.Any<string>()).Returns(true);
                this.WoodstockPlayerDetailsProvider.GetUserFlagsAsync(Arg.Any<ulong>(), Arg.Any<string>()).Returns(Fixture.Create<WoodstockUserFlags>());
                this.WoodstockPlayerDetailsProvider.GetProfileSummaryAsync(Arg.Any<ulong>(), Arg.Any<string>()).Returns(Fixture.Create<ProfileSummary>());
                this.WoodstockPlayerDetailsProvider.GetCreditUpdatesAsync(Arg.Any<ulong>(), Arg.Any<int>(), Arg.Any<int>(), Arg.Any<string>()).Returns(Fixture.Create<IList<CreditUpdate>>());
                this.WoodstockPlayerDetailsProvider.GetUserBanSummariesAsync(Arg.Any<IList<ulong>>(), Arg.Any<string>()).Returns(Fixture.Create<IList<BanSummary>>());
                this.WoodstockPlayerDetailsProvider.GetUserBanHistoryAsync(Arg.Any<ulong>(), Arg.Any<string>()).Returns(Fixture.Create<IList<LiveOpsBanHistory>>());
                this.WoodstockPlayerDetailsProvider.GetBackstagePassUpdatesAsync(Arg.Any<ulong>(), Arg.Any<string>()).Returns(Fixture.Create<IList<BackstagePassUpdate>>());
                this.WoodstockNotificationProvider.GetPlayerNotificationsAsync(Arg.Any<ulong>(), Arg.Any<int>(), Arg.Any<string>()).Returns(Fixture.Create<IList<Notification>>());
                this.WoodstockNotificationProvider.GetGroupNotificationsAsync(Arg.Any<int>(), Arg.Any<int>(), Arg.Any<string>()).Returns(Fixture.Create<IList<UserGroupNotification>>());
                this.WoodstockNotificationProvider.SendNotificationsAsync(Arg.Any<IList<ulong>>(), Arg.Any<string>(), Arg.Any<DateTime>(), Arg.Any<DateTime>(), Arg.Any<string>(), Arg.Any<string>()).Returns(Fixture.Create<IList<MessageSendResult<ulong>>>());
                this.WoodstockNotificationProvider.SendGroupNotificationAsync(Arg.Any<int>(), Arg.Any<string>(), Arg.Any<DateTime>(), Arg.Any<DateTime>(), Arg.Any<DeviceType>(), Arg.Any<string>(), Arg.Any<string>()).Returns(Fixture.Create<MessageSendResult<int>>());
                this.WoodstockNotificationProvider.GetGroupNotificationAsync(Arg.Any<Guid>(), Arg.Any<string>()).Returns(Fixture.Build<UserGroupNotification>().With(x => x.NotificationType, "CommunityMessageNotification").Create());
                this.WoodstockPlayerInventoryProvider.GetPlayerInventoryAsync(Arg.Any<ulong>(), Arg.Any<string>()).Returns(Fixture.Create<WoodstockPlayerInventory>());
                this.WoodstockPlayerInventoryProvider.GetPlayerInventoryAsync(Arg.Any<int>(), Arg.Any<string>()).Returns(Fixture.Create<WoodstockPlayerInventory>());
                this.WoodstockPlayerInventoryProvider.GetInventoryProfilesAsync(Arg.Any<ulong>(), Arg.Any<string>()).Returns(Fixture.Create<IList<WoodstockInventoryProfile>>());
                this.WoodstockServiceManagementProvider.GetLspGroupsAsync(Arg.Any<string>()).Returns(new List<LspGroup> { new LspGroup { Id = TestConstants.InvalidProfileId, Name = "UnitTesting" } });
                this.WoodstockPlayerInventoryProvider.UpdateGroupInventoriesAsync(Arg.Any<int>(), Arg.Any<WoodstockGift>(), Arg.Any<string>(), Arg.Any<bool>(), Arg.Any<WoodstockProxyBundle>()).Returns(Fixture.Create<GiftResponse<int>>());
                this.WoodstockPlayerInventoryProvider.UpdatePlayerInventoriesAsync(Arg.Any<WoodstockGroupGift>(), Arg.Any<string>(), Arg.Any<bool>(), Arg.Any<WoodstockProxyBundle>()).Returns(Fixture.Create<IList<GiftResponse<ulong>>>());
                this.StorefrontProvider.SearchUgcContentAsync(Arg.Any<UgcType>(), Arg.Any<ForzaUGCSearchRequest>(), Arg.Any<string>()).Returns(Fixture.Create<IList<WoodstockUgcItem>>());
                this.StorefrontProvider.GetUgcLiveryAsync(Arg.Any<Guid>(), Arg.Any<string>()).Returns(Fixture.Create<WoodstockUgcLiveryItem>());
                this.StorefrontProvider.GetUgcPhotoAsync(Arg.Any<Guid>(), Arg.Any<string>()).Returns(Fixture.Create<WoodstockUgcItem>());
                this.StorefrontProvider.GetUgcTuneAsync(Arg.Any<Guid>(), Arg.Any<string>()).Returns(Fixture.Create<WoodstockUgcItem>());
                this.StorefrontProvider.SetUgcFeaturedStatusAsync(Arg.Any<Guid>(), Arg.Any<bool>(), Arg.Any<TimeSpan>(), Arg.Any<TimeSpan>(), Arg.Any<string>());
                this.JobTracker.CreateNewJobAsync(Arg.Any<string>(), Arg.Any<string>(), Arg.Any<string>(), Arg.Any<HttpResponse>()).Returns(Fixture.Create<string>());
                this.KeyVaultProvider.GetSecretAsync(Arg.Any<string>(), Arg.Any<string>()).Returns(TestConstants.GetSecretResult);
                this.GiftHistoryProvider.GetGiftHistoriesAsync(Arg.Any<string>(), Arg.Any<string>(), Arg.Any<GiftIdentityAntecedent>(), Arg.Any<string>(), Arg.Any<DateTimeOffset>(), Arg.Any<DateTimeOffset>()).Returns(Fixture.Create<IList<WoodstockGiftHistory>>());
                this.ItemsProvider.GetCarsAsync<SimpleCar>().Returns(Fixture.Create<IEnumerable<SimpleCar>>());
                this.ItemsProvider.GetMasterInventoryAsync().Returns(fakeMasterInventory);
            }

            public IActionLogger ActionLogger { get; set; } = Substitute.For<IActionLogger>();

            public ILoggingService LoggingService { get; set; } = Substitute.For<ILoggingService>();

            public IKustoProvider KustoProvider { get; set; } = Substitute.For<IKustoProvider>();

            public IWoodstockPlayerDetailsProvider WoodstockPlayerDetailsProvider { get; set; } = Substitute.For<IWoodstockPlayerDetailsProvider>();

            public IWoodstockPlayerInventoryProvider WoodstockPlayerInventoryProvider { get; set; } = Substitute.For<IWoodstockPlayerInventoryProvider>();

            public IWoodstockServiceManagementProvider WoodstockServiceManagementProvider { get; set; } = Substitute.For<IWoodstockServiceManagementProvider>();

            public IWoodstockNotificationProvider WoodstockNotificationProvider { get; set; } = Substitute.For<IWoodstockNotificationProvider>();

            public IKeyVaultProvider KeyVaultProvider { get; set; } = Substitute.For<IKeyVaultProvider>();

            public IWoodstockGiftHistoryProvider GiftHistoryProvider { get; set; } = Substitute.For<IWoodstockGiftHistoryProvider>();

            public IWoodstockBanHistoryProvider BanHistoryProvider { get; set; } = Substitute.For<IWoodstockBanHistoryProvider>();

            public INotificationHistoryProvider NotificationHistoryProvider { get; set; } = Substitute.For<INotificationHistoryProvider>();

            public IWoodstockStorefrontProvider StorefrontProvider { get; set; } = Substitute.For<IWoodstockStorefrontProvider>();

            public IWoodstockItemsProvider ItemsProvider { get; set; } = Substitute.For<IWoodstockItemsProvider>();

            public IConfiguration Configuration { get; set; } = Substitute.For<IConfiguration>();

            public IScheduler Scheduler { get; set; } = Substitute.For<IScheduler>();

            public IJobTracker JobTracker { get; set; } = Substitute.For<IJobTracker>();

            public IMapper Mapper { get; set; } = Substitute.ForPartsOf<Mapper>(new MapperConfiguration(mc =>
            {
                mc.AddProfile(new WoodstockProfileMapper());
                mc.AllowNullCollections = true;
            }));

            public IRequestValidator<WoodstockMasterInventory> MasterInventoryRequestValidator { get; set; } = Substitute.For<IRequestValidator<WoodstockMasterInventory>>();

            public IRequestValidator<WoodstockUserFlagsInput> UserFlagsRequestValidator { get; set; } = Substitute.For<IRequestValidator<WoodstockUserFlagsInput>>();

            [System.Diagnostics.CodeAnalysis.SuppressMessage("Reliability", "CA2000:Dispose objects before losing scope", Justification = "Test")]
            public WoodstockController Build() => new WoodstockController(
                new MemoryCache(new MemoryCacheOptions()),
                this.ActionLogger,
                this.LoggingService,
                this.KustoProvider,
                this.WoodstockPlayerDetailsProvider,
                this.WoodstockPlayerInventoryProvider,
                this.WoodstockServiceManagementProvider,
                this.WoodstockNotificationProvider,
                this.KeyVaultProvider,
                this.GiftHistoryProvider,
                this.BanHistoryProvider,
                this.NotificationHistoryProvider,
                this.StorefrontProvider,
                this.ItemsProvider,
                this.Configuration,
                this.Scheduler,
                this.JobTracker,
                this.Mapper,
                this.MasterInventoryRequestValidator,
                this.UserFlagsRequestValidator)
            { ControllerContext = this.ControllerContext };
        }
    }
}
