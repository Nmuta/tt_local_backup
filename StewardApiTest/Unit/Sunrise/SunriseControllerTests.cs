﻿using System;
using System.Collections.Generic;
using System.Globalization;
using System.Threading.Tasks;
using AutoFixture;
using FluentAssertions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using NSubstitute.ReturnsExtensions;
using Turn10.LiveOps.StewardApi.Common;
using Turn10.LiveOps.StewardApi.Contracts;
using Turn10.LiveOps.StewardApi.Contracts.Data;
using Turn10.LiveOps.StewardApi.Contracts.Sunrise;
using Turn10.LiveOps.StewardApi.Controllers;
using Turn10.LiveOps.StewardApi.Providers;
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
            act.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "sunrisePlayerInventoryProvider"));
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
        public void Ctor_WhenPlayerInventoryRequestValidatorNull_Throws()
        {
            // Arrange.
            var dependencies = new Dependencies { PlayerInventoryRequestValidator = null };

            // Act.
            Action act = () => dependencies.Build();

            // Assert.
            act.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "playerInventoryRequestValidator"));
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
                async () => await controller.GetPlayerDetails(xuid).ConfigureAwait(false)
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
        public async Task GetPlayerDetails_WithNullEmptyWhiteSpaceGamertag_Throws()
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
                action().Should().BeAssignableTo<Task<IActionResult>>();
                var result = await action().ConfigureAwait(false) as BadRequestObjectResult;
                result.StatusCode.Should().Be(400);
                (result.Value as ArgumentNullException).Message.Should().Be(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "gamertag"));
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
            Func<Task<IActionResult>> action = async () => await controller.GetConsoles(xuid, maxResults).ConfigureAwait(false);

            // Assert.
            action().Should().BeAssignableTo<Task<IActionResult>>();
            action().Should().NotBeNull();
            var result = await action().ConfigureAwait(false) as OkObjectResult;
            var details = result.Value as IList<SunriseConsoleDetails>;
            details.Should().NotBeNull();
            details.Should().BeOfType<List<SunriseConsoleDetails>>();
        }

        [TestMethod]
        [TestCategory("Unit")]
        public async Task GetConsoles_WithNegativeMaxResults_Throws()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var xuid = Fixture.Create<ulong>();
            var maxResults = -1;

            // Act.
            Func<Task<IActionResult>> action = async () => await controller.GetConsoles(xuid, maxResults).ConfigureAwait(false);

            // Assert.
            action().Should().BeAssignableTo<Task<IActionResult>>();
            var result = await action().ConfigureAwait(false) as BadRequestObjectResult;
            result.StatusCode.Should().Be(400);
            (result.Value as ArgumentOutOfRangeException).Message.Should().Be(string.Format(TestConstants.ArgumentOutOfRangeExceptionMessagePartial, nameof(maxResults), 0, maxResults));
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
            Func<Task<IActionResult>> action = async () => await controller.GetSharedConsoleUsers(xuid, startIndex, maxResults).ConfigureAwait(false);

            // Assert.
            action().Should().BeAssignableTo<Task<IActionResult>>();
            action().Should().NotBeNull();
            var result = await action().ConfigureAwait(false) as OkObjectResult;
            var details = result.Value as IList<SunriseSharedConsoleUser>;
            details.Should().NotBeNull();
            details.Should().BeOfType<List<SunriseSharedConsoleUser>>();
        }

        [TestMethod]
        [TestCategory("Unit")]
        public async Task GetSharedConsoleUsers_WithNegativeStartIndex_Throws()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var xuid = Fixture.Create<ulong>();
            var startIndex = -1;
            var maxResults = Fixture.Create<int>();

            // Act.
            Func<Task<IActionResult>> action = async () => await controller.GetSharedConsoleUsers(xuid, startIndex, maxResults).ConfigureAwait(false);

            // Assert.
            action().Should().BeAssignableTo<Task<IActionResult>>();
            var result = await action().ConfigureAwait(false) as BadRequestObjectResult;
            result.StatusCode.Should().Be(400);
            (result.Value as ArgumentOutOfRangeException).Message.Should().Be(string.Format(TestConstants.ArgumentOutOfRangeExceptionMessagePartial, nameof(startIndex), -1, startIndex));
        }

        [TestMethod]
        [TestCategory("Unit")]
        public async Task GetSharedConsoleUsers_WithNegativeMaxResults_Throws()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var xuid = Fixture.Create<ulong>();
            var startIndex = Fixture.Create<int>();
            var maxResults = -1;

            // Act.
            Func<Task<IActionResult>> action = async () => await controller.GetSharedConsoleUsers(xuid, startIndex, maxResults).ConfigureAwait(false);

            // Assert.
            action().Should().BeAssignableTo<Task<IActionResult>>();
            var result = await action().ConfigureAwait(false) as BadRequestObjectResult;
            result.StatusCode.Should().Be(400);
            (result.Value as ArgumentOutOfRangeException).Message.Should().Be(string.Format(TestConstants.ArgumentOutOfRangeExceptionMessagePartial, nameof(maxResults), 0, maxResults));
        }

        [TestMethod]
        [TestCategory("Unit")]
        public async Task GetUserFlags_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var xuid = Fixture.Create<ulong>();

            // Act.
            Func<Task<IActionResult>> action = async () => await controller.GetUserFlags(xuid).ConfigureAwait(false);

            // Assert.
            action().Should().BeAssignableTo<Task<IActionResult>>();
            action().Should().NotBeNull();
            var result = await action().ConfigureAwait(false) as OkObjectResult;
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
            var userFlags = Fixture.Create<SunriseUserFlags>();

            // Act.
            Func<Task<IActionResult>> action = async () => await controller.SetUserFlags(xuid, userFlags).ConfigureAwait(false);

            // Assert.
            action().Should().BeAssignableTo<Task<IActionResult>>();
            action().Should().NotBeNull();
            var result = await action().ConfigureAwait(false) as OkObjectResult;
            var details = result.Value as SunriseUserFlags;
            details.Should().NotBeNull();
            details.Should().BeOfType<SunriseUserFlags>();
        }

        [TestMethod]
        [TestCategory("Unit")]
        public async Task SetUserFlags_WithNullUserFlags_Throws()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var xuid = Fixture.Create<ulong>();

            // Act.
            Func<Task<IActionResult>> action = async () => await controller.SetUserFlags(xuid, null).ConfigureAwait(false);

            // Assert.
            action().Should().BeAssignableTo<Task<IActionResult>>();
            var result = await action().ConfigureAwait(false) as BadRequestObjectResult;
            result.StatusCode.Should().Be(400);
            (result.Value as ArgumentNullException).Message.Should().Be(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "userFlags"));
        }

        [TestMethod]
        [TestCategory("Unit")]
        public async Task GetProfileSummary_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var xuid = Fixture.Create<ulong>();

            // Act.
            Func<Task<IActionResult>> action = async () => await controller.GetProfileSummary(xuid).ConfigureAwait(false);

            // Assert.
            action().Should().BeAssignableTo<Task<IActionResult>>();
            action().Should().NotBeNull();
            var result = await action().ConfigureAwait(false) as OkObjectResult;
            var details = result.Value as SunriseProfileSummary;
            details.Should().NotBeNull();
            details.Should().BeOfType<SunriseProfileSummary>();
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
            Func<Task<IActionResult>> action = async () => await controller.GetCreditUpdates(xuid, startIndex, maxResults).ConfigureAwait(false);

            // Assert.
            action().Should().BeAssignableTo<Task<IActionResult>>();
            action().Should().NotBeNull();
            var result = await action().ConfigureAwait(false) as OkObjectResult;
            var details = result.Value as IList<SunriseCreditUpdate>;
            details.Should().NotBeNull();
            details.Should().BeOfType<List<SunriseCreditUpdate>>();
        }

        [TestMethod]
        [TestCategory("Unit")]
        public async Task GetCreditUpdates_WithNegativeStartIndex_Throws()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var xuid = Fixture.Create<ulong>();
            var startIndex = -1;
            var maxResults = Fixture.Create<int>();

            // Act.
            Func<Task<IActionResult>> action = async () => await controller.GetCreditUpdates(xuid, startIndex, maxResults).ConfigureAwait(false);

            // Assert.
            action().Should().BeAssignableTo<Task<IActionResult>>();
            var result = await action().ConfigureAwait(false) as BadRequestObjectResult;
            result.StatusCode.Should().Be(400);
            (result.Value as ArgumentOutOfRangeException).Message.Should().Be(string.Format(TestConstants.ArgumentOutOfRangeExceptionMessagePartial, nameof(startIndex), -1, startIndex));
        }

        [TestMethod]
        [TestCategory("Unit")]
        public async Task GetCreditUpdates_WithNegativeMaxResults_Throws()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var xuid = Fixture.Create<ulong>();
            var startIndex = Fixture.Create<int>();
            var maxResults = -1;

            // Act.
            Func<Task<IActionResult>> action = async () => await controller.GetCreditUpdates(xuid, startIndex, maxResults).ConfigureAwait(false);

            // Assert.
            action().Should().BeAssignableTo<Task<IActionResult>>();
            var result = await action().ConfigureAwait(false) as BadRequestObjectResult;
            result.StatusCode.Should().Be(400);
            (result.Value as ArgumentOutOfRangeException).Message.Should().Be(string.Format(TestConstants.ArgumentOutOfRangeExceptionMessagePartial, nameof(maxResults), 0, maxResults));
        }

        [TestMethod]
        [TestCategory("Unit")]
        public async Task BanPlayers_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var banParameters = GenerateBanParameters();
            var useBackgroundProcessing = false;
            var requestingAgent = Fixture.Create<string>();

            // Act.
            Func<Task<IActionResult>> action = async () => await controller.BanPlayers(banParameters, useBackgroundProcessing, requestingAgent).ConfigureAwait(false);

            // Assert.
            action().Should().BeAssignableTo<Task<IActionResult>>();
            action().Should().NotBeNull();
            var result = await action().ConfigureAwait(false) as CreatedResult;
            var details = result.Value as IList<SunriseBanResult>;
            details.Should().NotBeNull();
            details.Should().BeOfType<List<SunriseBanResult>>();
        }

        [TestMethod]
        [TestCategory("Unit")]
        public async Task BanPlayers_WithNullBanParameters_Throws()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var useBackgroundProcessing = false;
            var requestingAgent = Fixture.Create<string>();

            // Act.
            Func<Task<IActionResult>> action = async () => await controller.BanPlayers(null, useBackgroundProcessing, requestingAgent).ConfigureAwait(false);

            // Assert.
            action().Should().BeAssignableTo<Task<IActionResult>>();
            var result = await action().ConfigureAwait(false) as BadRequestObjectResult;
            result.StatusCode.Should().Be(400);
            (result.Value as ArgumentNullException).Message.Should().Be(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "banParameters"));
        }

        [TestMethod]
        [TestCategory("Unit")]
        public async Task BanPlayers_WithNullEmptyWhitespaceRequestingAgent_Throws()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var banParameters = GenerateBanParameters();
            var useBackgroundProcessing = false;

            // Act.
            var actions = new List<Func<Task<IActionResult>>>
            {
                async () => await controller.BanPlayers(banParameters, useBackgroundProcessing, null).ConfigureAwait(false),
                async () => await controller.BanPlayers(banParameters, useBackgroundProcessing, TestConstants.Empty).ConfigureAwait(false),
                async () => await controller.BanPlayers(banParameters, useBackgroundProcessing, TestConstants.WhiteSpace).ConfigureAwait(false)
            };

            // Assert.
            foreach (var action in actions)
            {
                action().Should().BeAssignableTo<Task<IActionResult>>();
                var result = await action().ConfigureAwait(false) as BadRequestObjectResult;
                result.StatusCode.Should().Be(400);
                (result.Value as ArgumentNullException).Message.Should().Be(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "requestingAgent"));
            }
        }

        [TestMethod]
        [TestCategory("Unit")]
        public async Task BanPlayers_WithValidParameters_UseBackgroundProcessing_DoesNotThrow()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var banParameters = GenerateBanParameters();
            var useBackgroundProcessing = true;
            var requestingAgent = Fixture.Create<string>();

            // Act.
            Func<Task<IActionResult>> action = async () => await controller.BanPlayers(banParameters, useBackgroundProcessing, requestingAgent).ConfigureAwait(false);

            // Assert.
            action.Should().NotThrow();
        }

        [TestMethod]
        [TestCategory("Unit")]
        public async Task BanPlayers_WithNullBanParameters_UseBackgroundProcessing_Throws()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var useBackgroundProcessing = true;
            var requestingAgent = Fixture.Create<string>();

            // Act.
            Func<Task<IActionResult>> action = async () => await controller.BanPlayers(null, useBackgroundProcessing, requestingAgent).ConfigureAwait(false);

            // Assert.
            action().Should().BeAssignableTo<Task<IActionResult>>();
            var result = await action().ConfigureAwait(false) as BadRequestObjectResult;
            result.StatusCode.Should().Be(400);
            (result.Value as ArgumentNullException).Message.Should().Be(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "banParameters"));
        }

        [TestMethod]
        [TestCategory("Unit")]
        public async Task GetBanSummaries_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var xuids = Fixture.Create<IList<ulong>>();

            // Act.
            Func<Task<IActionResult>> action = async () => await controller.GetBanSummaries(xuids).ConfigureAwait(false);

            // Assert.
            action().Should().BeAssignableTo<Task<IActionResult>>();
            action().Should().NotBeNull();
            var result = await action().ConfigureAwait(false) as OkObjectResult;
            var details = result.Value as IList<SunriseBanSummary>;
            details.Should().NotBeNull();
            details.Should().BeOfType<List<SunriseBanSummary>>();
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
        public async Task GetBanHistory_WithNullEmptyWhitespaceGamertag_Throws()
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
                action().Should().BeAssignableTo<Task<IActionResult>>();
                var result = await action().ConfigureAwait(false) as BadRequestObjectResult;
                result.StatusCode.Should().Be(400);
                (result.Value as ArgumentNullException).Message.Should().Be(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "gamertag"));
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
            Func<Task<IActionResult>> action = async () => await controller.SetConsoleBanStatus(consoleId, isBanned).ConfigureAwait(false);

            // Assert.
            action().Should().BeAssignableTo<Task<IActionResult>>();
            action().Should().NotBeNull();
            var result = await action().ConfigureAwait(false);
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
        public async Task GetPlayerInventoryProfiles_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var xuid = Fixture.Create<ulong>();

            // Act.
            Func<Task<IActionResult>> action = async () => await controller.GetPlayerInventoryProfiles(xuid).ConfigureAwait(false);

            // Assert.
            action().Should().BeAssignableTo<Task<IActionResult>>();
            action().Should().NotBeNull();
            var result = await action().ConfigureAwait(false) as OkObjectResult;
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
            Func<Task<IActionResult>> action = async () => await controller.GetGroups(startIndex, maxResults).ConfigureAwait(false);

            // Assert.
            action().Should().BeAssignableTo<Task<IActionResult>>();
            action().Should().NotBeNull();
            var result = await action().ConfigureAwait(false) as OkObjectResult;
            var details = result.Value as IList<SunriseLspGroup>;
            details.Should().NotBeNull();
            details.Should().BeOfType<List<SunriseLspGroup>>();
        }

        [TestMethod]
        [TestCategory("Unit")]
        public async Task GetGroups_WithNegativeStartIndex_Throws()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var startIndex = -1;
            var maxResults = Fixture.Create<int>();

            // Act.
            Func<Task<IActionResult>> action = async () => await controller.GetGroups(startIndex, maxResults).ConfigureAwait(false);

            // Assert.
            action().Should().BeAssignableTo<Task<IActionResult>>();
            var result = await action().ConfigureAwait(false) as BadRequestObjectResult;
            result.StatusCode.Should().Be(400);
            (result.Value as ArgumentOutOfRangeException).Message.Should().Be(string.Format(CultureInfo.InvariantCulture, TestConstants.ArgumentOutOfRangeExceptionMessagePartial, nameof(startIndex), -1, startIndex));
        }

        [TestMethod]
        [TestCategory("Unit")]
        public async Task GetGroups_WithNegativeMaxResults_Throws()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var startIndex = Fixture.Create<int>();
            var maxResults = -1;

            // Act.
            Func<Task<IActionResult>> action = async () => await controller.GetGroups(startIndex, maxResults).ConfigureAwait(false);

            // Assert.
            action().Should().BeAssignableTo<Task<IActionResult>>();
            var result = await action().ConfigureAwait(false) as BadRequestObjectResult;
            result.StatusCode.Should().Be(400);
            (result.Value as ArgumentOutOfRangeException).Message.Should().Be(string.Format(CultureInfo.InvariantCulture, TestConstants.ArgumentOutOfRangeExceptionMessagePartial, nameof(maxResults), 0, maxResults));
        }

        [TestMethod]
        [TestCategory("Unit")]
        public async Task UpdatePlayerInventory_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var playerInventory = Fixture.Create<SunrisePlayerInventory>();
            var useBackgroundProcessing = false;
            var requestingAgent = Fixture.Create<string>();

            // Act.
            Func<Task<IActionResult>> action = async () => await controller.UpdatePlayerInventory(playerInventory, useBackgroundProcessing, requestingAgent).ConfigureAwait(false);

            // Assert.
            action().Should().BeAssignableTo<Task<IActionResult>>();
            action().Should().NotBeNull();
            var result = await action().ConfigureAwait(false) as CreatedResult;
            var details = result.Value as SunrisePlayerInventory;
            details.Should().NotBeNull();
            details.Should().BeOfType<SunrisePlayerInventory>();
        }

        [TestMethod]
        [TestCategory("Unit")]
        public async Task UpdatePlayerInventory_WithNullPlayerInventory_Throws()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var useBackgroundProcessing = false;
            var requestingAgent = Fixture.Create<string>();

            // Act.
            Func<Task<IActionResult>> action = async () => await controller.UpdatePlayerInventory(null, useBackgroundProcessing, requestingAgent).ConfigureAwait(false);

            // Assert.
            action().Should().BeAssignableTo<Task<IActionResult>>();
            var result = await action().ConfigureAwait(false) as BadRequestObjectResult;
            result.StatusCode.Should().Be(400);
            (result.Value as ArgumentNullException).Message.Should().Be(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "playerInventory"));
        }

        [TestMethod]
        [TestCategory("Unit")]
        public async Task UpdatePlayerInventory_WithNullEmptyWhitespaceRequestingAgent_Throws()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var playerInventory = Fixture.Create<SunrisePlayerInventory>();
            var useBackgroundProcessing = false;

            // Act.
            var actions = new List<Func<Task<IActionResult>>>
            {
                async () => await controller.UpdatePlayerInventory(playerInventory, useBackgroundProcessing, null).ConfigureAwait(false),
                async () => await controller.UpdatePlayerInventory(playerInventory, useBackgroundProcessing, TestConstants.Empty).ConfigureAwait(false),
                async () => await controller.UpdatePlayerInventory(playerInventory, useBackgroundProcessing, TestConstants.WhiteSpace).ConfigureAwait(false)
            };

            // Assert.
            foreach (var action in actions)
            {
                action().Should().BeAssignableTo<Task<IActionResult>>();
                var result = await action().ConfigureAwait(false) as BadRequestObjectResult;
                result.StatusCode.Should().Be(400);
                (result.Value as ArgumentNullException).Message.Should().Be(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "requestingAgent"));
            }
        }

        [TestMethod]
        [TestCategory("Unit")]
        public async Task UpdatePlayerInventory_WithValidParameters_UseBackgroundProcessing_ReturnsCorrectType()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var playerInventory = Fixture.Create<SunrisePlayerInventory>();
            var useBackgroundProcessing = true;
            var requestingAgent = Fixture.Create<string>();

            // Act.
            Func<Task<IActionResult>> action = async () => await controller.UpdatePlayerInventory(playerInventory, useBackgroundProcessing, requestingAgent).ConfigureAwait(false);

            // Assert.
            action().Result.Should().BeAssignableTo<AcceptedResult>();
        }

        [TestMethod]
        [TestCategory("Unit")]
        public async Task UpdatePlayerInventory_WithNullPlayerInventory_UseBackgroundProcessing_Throws()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var useBackgroundProcessing = true;
            var requestingAgent = Fixture.Create<string>();

            // Act.
            Func<Task<IActionResult>> action = async () => await controller.UpdatePlayerInventory(null, useBackgroundProcessing, requestingAgent).ConfigureAwait(false);

            // Assert.
            action().Should().BeAssignableTo<Task<IActionResult>>();
            var result = await action().ConfigureAwait(false) as BadRequestObjectResult;
            result.StatusCode.Should().Be(400);
            (result.Value as ArgumentNullException).Message.Should().Be(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "playerInventory"));
        }

        [TestMethod]
        [TestCategory("Unit")]
        public async Task UpdatePlayerInventory_WithNullEmptyWhitespaceRequestingAgent_UseBackgroundProcessing_Throws()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var playerInventory = Fixture.Create<SunrisePlayerInventory>();
            var useBackgroundProcessing = true;

            // Act.
            var actions = new List<Func<Task<IActionResult>>>
            {
                async () => await controller.UpdatePlayerInventory(playerInventory, useBackgroundProcessing, null).ConfigureAwait(false),
                async () => await controller.UpdatePlayerInventory(playerInventory, useBackgroundProcessing, TestConstants.Empty).ConfigureAwait(false),
                async () => await controller.UpdatePlayerInventory(playerInventory, useBackgroundProcessing, TestConstants.WhiteSpace).ConfigureAwait(false)
            };

            // Assert.
            foreach (var action in actions)
            {
                action().Should().BeAssignableTo<Task<IActionResult>>();
                var result = await action().ConfigureAwait(false) as BadRequestObjectResult;
                result.StatusCode.Should().Be(400);
                (result.Value as ArgumentNullException).Message.Should().Be(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "requestingAgent"));
            }
        }

        [TestMethod]
        [TestCategory("Unit")]
        public async Task UpdatePlayerInventories_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var groupGift = Fixture.Create<SunriseGroupGift>();
            var useBackgroundProcessing = false;
            var requestingAgent = Fixture.Create<string>();

            // Act.
            var actions = new List<Func<Task<IActionResult>>>
            {
                async () => await controller.UpdateGroupInventories(groupGift, useBackgroundProcessing, requestingAgent).ConfigureAwait(false),
                async () => await controller.UpdateGroupInventoriesByGamertags(groupGift, useBackgroundProcessing, requestingAgent).ConfigureAwait(false)
            };

            // Assert.
            foreach (var action in actions)
            {
                action().Should().BeAssignableTo<Task<IActionResult>>();
                action().Should().NotBeNull();
                var result = await action().ConfigureAwait(false) as CreatedResult;
                var details = result.Value as SunrisePlayerInventory;
                details.Should().NotBeNull();
                details.Should().BeOfType<SunrisePlayerInventory>();
            }
        }

        [TestMethod]
        [TestCategory("Unit")]
        public async Task UpdatePlayerInventories_WithNullGroupGift_Throws()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var useBackgroundProcessing = false;
            var requestingAgent = Fixture.Create<string>();

            // Act.
            var actions = new List<Func<Task<IActionResult>>>
            {
                async () => await controller.UpdateGroupInventories(null, useBackgroundProcessing, requestingAgent).ConfigureAwait(false),
                async () => await controller.UpdateGroupInventoriesByGamertags(null, useBackgroundProcessing, requestingAgent).ConfigureAwait(false)
            };

            // Assert.
            foreach (var action in actions)
            {
                action().Should().BeAssignableTo<Task<IActionResult>>();
                var result = await action().ConfigureAwait(false) as BadRequestObjectResult;
                result.StatusCode.Should().Be(400);
                (result.Value as ArgumentNullException).Message.Should().Be(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "groupGift"));
            }
        }

        [TestMethod]
        [TestCategory("Unit")]
        public async Task UpdatePlayerInventories_WithNullEmptyWhitespaceRequestingAgent_Throws()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var groupGift = Fixture.Create<SunriseGroupGift>();
            var useBackgroundProcessing = false;

            // Act.
            var actions = new List<Func<Task<IActionResult>>>
            {
                async () => await controller.UpdateGroupInventories(groupGift, useBackgroundProcessing, null).ConfigureAwait(false),
                async () => await controller.UpdateGroupInventories(groupGift, useBackgroundProcessing, TestConstants.Empty).ConfigureAwait(false),
                async () => await controller.UpdateGroupInventories(groupGift, useBackgroundProcessing, TestConstants.WhiteSpace).ConfigureAwait(false),
                async () => await controller.UpdateGroupInventoriesByGamertags(groupGift, useBackgroundProcessing, null).ConfigureAwait(false),
                async () => await controller.UpdateGroupInventoriesByGamertags(groupGift, useBackgroundProcessing, TestConstants.Empty).ConfigureAwait(false),
                async () => await controller.UpdateGroupInventoriesByGamertags(groupGift, useBackgroundProcessing, TestConstants.WhiteSpace).ConfigureAwait(false)
            };

            // Assert.
            foreach (var action in actions)
            {
                action().Should().BeAssignableTo<Task<IActionResult>>();
                var result = await action().ConfigureAwait(false) as BadRequestObjectResult;
                result.StatusCode.Should().Be(400);
                (result.Value as ArgumentNullException).Message.Should().Be(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "requestingAgent"));
            }
        }

        [TestMethod]
        [TestCategory("Unit")]
        public async Task UpdatePlayerInventories_WithValidParameters_UseBackgroundProcessing_ReturnsCorrectType()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var groupGift = Fixture.Create<SunriseGroupGift>();
            var useBackgroundProcessing = true;
            var requestingAgent = Fixture.Create<string>();

            // Act.
            var actions = new List<Func<Task<IActionResult>>>
            {
                async () => await controller.UpdateGroupInventories(groupGift, useBackgroundProcessing, requestingAgent).ConfigureAwait(false),
                async () => await controller.UpdateGroupInventoriesByGamertags(groupGift, useBackgroundProcessing, requestingAgent).ConfigureAwait(false)
            };

            // Assert.
            foreach (var action in actions)
            {
                // To reset the context and prevent header key collision, rebuild the Dependencies.
                controller = new Dependencies().Build();
                action().Result.Should().BeAssignableTo<AcceptedResult>();
            }
        }

        [TestMethod]
        [TestCategory("Unit")]
        public async Task UpdatePlayerInventories_WithNullGroupGift_UseBackgroundProcessing_Throws()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var useBackgroundProcessing = true;
            var requestingAgent = Fixture.Create<string>();

            // Act.
            var actions = new List<Func<Task<IActionResult>>>
            {
                async () => await controller.UpdateGroupInventories(null, useBackgroundProcessing, requestingAgent).ConfigureAwait(false),
                async () => await controller.UpdateGroupInventoriesByGamertags(null, useBackgroundProcessing, requestingAgent).ConfigureAwait(false)
            };

            // Assert.
            foreach (var action in actions)
            {
                action().Should().BeAssignableTo<Task<IActionResult>>();
                var result = await action().ConfigureAwait(false) as BadRequestObjectResult;
                result.StatusCode.Should().Be(400);
                (result.Value as ArgumentNullException).Message.Should().Be(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "groupGift"));
            }
        }

        [TestMethod]
        [TestCategory("Unit")]
        public async Task UpdatePlayerInventories_WithNullEmptyWhitespaceRequestingAgent_UseBackgroundProcessing_Throws()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var groupGift = Fixture.Create<SunriseGroupGift>();
            var useBackgroundProcessing = true;

            // Act.
            var actions = new List<Func<Task<IActionResult>>>
            {
                async () => await controller.UpdateGroupInventories(groupGift, useBackgroundProcessing, null).ConfigureAwait(false),
                async () => await controller.UpdateGroupInventories(groupGift, useBackgroundProcessing, TestConstants.Empty).ConfigureAwait(false),
                async () => await controller.UpdateGroupInventories(groupGift, useBackgroundProcessing, TestConstants.WhiteSpace).ConfigureAwait(false),
                async () => await controller.UpdateGroupInventoriesByGamertags(groupGift, useBackgroundProcessing, null).ConfigureAwait(false),
                async () => await controller.UpdateGroupInventoriesByGamertags(groupGift, useBackgroundProcessing, TestConstants.Empty).ConfigureAwait(false),
                async () => await controller.UpdateGroupInventoriesByGamertags(groupGift, useBackgroundProcessing, TestConstants.WhiteSpace).ConfigureAwait(false)
            };

            // Assert.
            foreach (var action in actions)
            {
                action().Should().BeAssignableTo<Task<IActionResult>>();
                var result = await action().ConfigureAwait(false) as BadRequestObjectResult;
                result.StatusCode.Should().Be(400);
                (result.Value as ArgumentNullException).Message.Should().Be(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "requestingAgent"));
            }
        }

        [TestMethod]
        [TestCategory("Unit")]
        public async Task UpdateGroupInventories_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var groupId = Fixture.Create<int>();
            var playerInventory = Fixture.Create<SunrisePlayerInventory>();
            var adminAuth = TestConstants.GetSecretResult;
            var requestingAgent = Fixture.Create<string>();

            // Act.
            Func<Task<IActionResult>> action = async () => await controller.UpdateGroupInventories(groupId, playerInventory, adminAuth, requestingAgent).ConfigureAwait(false);

            // Assert.
            action().Should().BeAssignableTo<Task<IActionResult>>();
            action().Should().NotBeNull();
            var result = await action().ConfigureAwait(false) as CreatedResult;
            var details = result.Value as SunrisePlayerInventory;
            details.Should().NotBeNull();
            details.Should().BeOfType<SunrisePlayerInventory>();
        }

        [TestMethod]
        [TestCategory("Unit")]
        public async Task UpdateGroupInventories_WithNullPlayerInventory_Throws()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var groupId = Fixture.Create<int>();
            var adminAuth = TestConstants.GetSecretResult;
            var requestingAgent = Fixture.Create<string>();

            // Act.
            Func<Task<IActionResult>> action = async () => await controller.UpdateGroupInventories(groupId, null, adminAuth, requestingAgent).ConfigureAwait(false);

            // Assert.
            action().Should().BeAssignableTo<Task<IActionResult>>();
            var result = await action().ConfigureAwait(false) as BadRequestObjectResult;
            result.StatusCode.Should().Be(400);
            (result.Value as ArgumentNullException).Message.Should().Be(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "playerInventory"));
        }

        [TestMethod]
        [TestCategory("Unit")]
        public async Task UpdateGroupInventories_WithIncorrectAdminAuth_Throws()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var groupId = Fixture.Create<int>();
            var playerInventory = Fixture.Create<SunrisePlayerInventory>();
            var adminAuth = Fixture.Create<string>();
            var requestingAgent = Fixture.Create<string>();

            // Act.
            Func<Task<IActionResult>> action = async () => await controller.UpdateGroupInventories(groupId, playerInventory, adminAuth, requestingAgent).ConfigureAwait(false);

            // Assert.
            action().Should().BeAssignableTo<Task<IActionResult>>();
            var result = await action().ConfigureAwait(false) as UnauthorizedObjectResult;
            result.StatusCode.Should().Be(401);
            result.Value.Should().Be("adminAuth header was incorrect.");
        }

        [TestMethod]
        [TestCategory("Unit")]
        public async Task UpdateGroupInventories_WithNullEmptyWhitespaceAdminAuth_Throws()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var groupId = Fixture.Create<int>();
            var playerInventory = Fixture.Create<SunrisePlayerInventory>();
            var requestingAgent = Fixture.Create<string>();

            // Act.
            var actions = new List<Func<Task<IActionResult>>>
            {
                async () => await controller.UpdateGroupInventories(groupId, playerInventory, null, requestingAgent).ConfigureAwait(false),
                async () => await controller.UpdateGroupInventories(groupId, playerInventory, TestConstants.Empty, requestingAgent).ConfigureAwait(false),
                async () => await controller.UpdateGroupInventories(groupId, playerInventory, TestConstants.WhiteSpace, requestingAgent).ConfigureAwait(false)
            };

            // Assert.
            foreach (var action in actions)
            {
                action().Should().BeAssignableTo<Task<IActionResult>>();
                var result = await action().ConfigureAwait(false) as BadRequestObjectResult;
                result.StatusCode.Should().Be(400);
                (result.Value as ArgumentNullException).Message.Should().Be(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "adminAuth"));
            }
        }

        [TestMethod]
        [TestCategory("Unit")]
        public async Task UpdateGroupInventories_WithNullEmptyWhitespaceRequestingAgent_Throws()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var groupId = Fixture.Create<int>();
            var adminAuth = TestConstants.GetSecretResult;
            var playerInventory = Fixture.Create<SunrisePlayerInventory>();

            // Act.
            var actions = new List<Func<Task<IActionResult>>>
            {
                async () => await controller.UpdateGroupInventories(groupId, playerInventory, adminAuth, null).ConfigureAwait(false),
                async () => await controller.UpdateGroupInventories(groupId, playerInventory, adminAuth, TestConstants.Empty).ConfigureAwait(false),
                async () => await controller.UpdateGroupInventories(groupId, playerInventory, adminAuth, TestConstants.WhiteSpace).ConfigureAwait(false)
            };

            // Assert.
            foreach (var action in actions)
            {
                action().Should().BeAssignableTo<Task<IActionResult>>();
                var result = await action().ConfigureAwait(false) as BadRequestObjectResult;
                result.StatusCode.Should().Be(400);
                (result.Value as ArgumentNullException).Message.Should().Be(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "requestingAgent"));
            }
        }

        [TestMethod]
        [TestCategory("Unit")]
        public async Task GetGiftHistory_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var xuid = Fixture.Create<ulong>();

            // Act.
            Func<Task<IActionResult>> action = async () => await controller.GetGiftHistoriesAsync(xuid).ConfigureAwait(false);

            // Assert.
            action().Should().BeAssignableTo<Task<IActionResult>>();
            action().Should().NotBeNull();
            var result = await action().ConfigureAwait(false) as OkObjectResult;
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
            Func<Task<IActionResult>> action = async () => await controller.GetGiftHistoriesAsync(groupId).ConfigureAwait(false);

            // Assert.
            action().Should().BeAssignableTo<Task<IActionResult>>();
            action().Should().NotBeNull();
            var result = await action().ConfigureAwait(false) as OkObjectResult;
            var details = result.Value as IList<SunriseGiftHistory>;
            details.Should().NotBeNull();
            details.Should().BeOfType<List<SunriseGiftHistory>>();
        }

        private SunriseBanParameters GenerateBanParameters()
        {
            return new SunriseBanParameters
            {
                Xuids = new List<ulong> { 111, 222, 333 },
                Gamertags = new List<string> { "gamerT1", "gamerT2", "gamerT3" },
                FeatureArea = "Matchmaking",
                Reason = "Disgusting license plate.",
                StartTimeUtc = DateTime.UtcNow,
                ExpireTimeUtc = DateTime.UtcNow.AddSeconds(1),
                BanAllConsoles = false,
                BanAllPcs = false,
                DeleteLeaderboardEntries = false,
                SendReasonNotification = false
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
                this.ControllerContext = new ControllerContext { HttpContext = httpContext };

                this.SunrisePlayerDetailsProvider.GetPlayerDetailsAsync(Arg.Any<ulong>()).Returns(Fixture.Create<SunrisePlayerDetails>());
                this.SunrisePlayerDetailsProvider.GetPlayerDetailsAsync(Arg.Any<string>()).Returns(Fixture.Create<SunrisePlayerDetails>());
                this.SunrisePlayerDetailsProvider.GetConsolesAsync(Arg.Any<ulong>(), Arg.Any<int>()).Returns(Fixture.Create<IList<SunriseConsoleDetails>>());
                this.SunrisePlayerDetailsProvider.GetSharedConsoleUsersAsync(Arg.Any<ulong>(), Arg.Any<int>(), Arg.Any<int>()).Returns(Fixture.Create<IList<SunriseSharedConsoleUser>>());
                this.SunrisePlayerDetailsProvider.EnsurePlayerExistsAsync(Arg.Any<ulong>()).Returns(true);
                this.SunrisePlayerDetailsProvider.EnsurePlayerExistsAsync(Arg.Any<string>()).Returns(true);
                this.SunrisePlayerDetailsProvider.GetUserFlagsAsync(Arg.Any<ulong>()).Returns(Fixture.Create<SunriseUserFlags>());
                this.SunrisePlayerDetailsProvider.GetProfileSummaryAsync(Arg.Any<ulong>()).Returns(Fixture.Create<SunriseProfileSummary>());
                this.SunrisePlayerDetailsProvider.GetCreditUpdatesAsync(Arg.Any<ulong>(), Arg.Any<int>(), Arg.Any<int>()).Returns(Fixture.Create<IList<SunriseCreditUpdate>>());
                this.SunrisePlayerDetailsProvider.BanUsersAsync(Arg.Any<SunriseBanParameters>(), Arg.Any<string>()).Returns(Fixture.Create<IList<SunriseBanResult>>());
                this.SunrisePlayerDetailsProvider.GetUserBanSummariesAsync(Arg.Any<IList<ulong>>()).Returns(Fixture.Create<IList<SunriseBanSummary>>());
                this.SunrisePlayerDetailsProvider.GetUserBanHistoryAsync(Arg.Any<ulong>()).Returns(Fixture.Create<IList<LiveOpsBanHistory>>());
                this.SunrisePlayerDetailsProvider.GetUserBanHistoryAsync(Arg.Any<string>()).Returns(Fixture.Create<IList<LiveOpsBanHistory>>());
                this.SunrisePlayerInventoryProvider.GetPlayerInventoryAsync(Arg.Any<ulong>()).Returns(Fixture.Create<SunrisePlayerInventory>());
                this.SunrisePlayerInventoryProvider.GetPlayerInventoryAsync(Arg.Any<int>()).Returns(Fixture.Create<SunrisePlayerInventory>());
                this.SunrisePlayerInventoryProvider.GetInventoryProfilesAsync(Arg.Any<ulong>()).Returns(Fixture.Create<IList<SunriseInventoryProfile>>());
                this.SunrisePlayerInventoryProvider.GetLspGroupsAsync(Arg.Any<int>(), Arg.Any<int>()).Returns(Fixture.Create<IList<SunriseLspGroup>>());
                this.JobTracker.CreateNewJobAsync(Arg.Any<string>(), Arg.Any<string>()).Returns(Fixture.Create<string>());
                this.KeyVaultProvider.GetSecretAsync(Arg.Any<string>(), Arg.Any<string>()).Returns(TestConstants.GetSecretResult);
                this.GiftHistoryProvider.GetGiftHistoriesAsync(Arg.Any<string>(), Arg.Any<string>(), Arg.Any<GiftHistoryAntecedent>()).Returns(Fixture.Create<IList<SunriseGiftHistory>>());
            }

            public ISunrisePlayerDetailsProvider SunrisePlayerDetailsProvider { get; set; } = Substitute.For<ISunrisePlayerDetailsProvider>();

            public ISunrisePlayerInventoryProvider SunrisePlayerInventoryProvider { get; set; } = Substitute.For<ISunrisePlayerInventoryProvider>();

            public IKeyVaultProvider KeyVaultProvider { get; set; } = Substitute.For<IKeyVaultProvider>();

            public ISunriseGiftHistoryProvider GiftHistoryProvider { get; set; } = Substitute.For<ISunriseGiftHistoryProvider>();

            public ISunriseBanHistoryProvider BanHistoryProvider { get; set; } = Substitute.For<ISunriseBanHistoryProvider>();

            public IConfiguration Configuration { get; set; } = Substitute.For<IConfiguration>();

            public IScheduler Scheduler { get; set; } = Substitute.For<IScheduler>();

            public IJobTracker JobTracker { get; set; } = Substitute.For<IJobTracker>();

            public IRequestValidator<SunrisePlayerInventory> PlayerInventoryRequestValidator { get; set; } = Substitute.For<IRequestValidator<SunrisePlayerInventory>>();

            public IRequestValidator<SunriseGroupGift> GroupGiftRequestValidator { get; set; } = Substitute.For<IRequestValidator<SunriseGroupGift>>();

            public IRequestValidator<SunriseBanParameters> BanParametersRequestValidator { get; set; } = Substitute.For<IRequestValidator<SunriseBanParameters>>();

            public SunriseController Build() => new SunriseController(
                                                                      this.SunrisePlayerDetailsProvider,
                                                                      this.SunrisePlayerInventoryProvider,
                                                                      this.KeyVaultProvider,
                                                                      this.GiftHistoryProvider,
                                                                      this.BanHistoryProvider,
                                                                      this.Configuration,
                                                                      this.Scheduler,
                                                                      this.JobTracker,
                                                                      this.PlayerInventoryRequestValidator,
                                                                      this.GroupGiftRequestValidator,
                                                                      this.BanParametersRequestValidator)
            { ControllerContext = this.ControllerContext };
        }
    }
}
