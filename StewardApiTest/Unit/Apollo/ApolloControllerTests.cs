using System;
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
using Turn10.LiveOps.StewardApi.Contracts.Apollo;
using Turn10.LiveOps.StewardApi.Contracts.Data;
using Turn10.LiveOps.StewardApi.Controllers;
using Turn10.LiveOps.StewardApi.Providers;
using Turn10.LiveOps.StewardApi.Providers.Apollo;
using Turn10.LiveOps.StewardApi.Validation;

namespace Turn10.LiveOps.StewardTest.Unit.Apollo
{
    [TestClass]
    public sealed class ApolloControllerTests
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
        public void Ctor_WhenApolloPlayerDetailsProviderNull_Throws()
        {
            // Arrange.
            var dependencies = new Dependencies { ApolloPlayerDetailsProvider = null };

            // Act.
            Action act = () => dependencies.Build();

            // Assert.
            act.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "apolloPlayerDetailsProvider"));
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void Ctor_WhenApolloPlayerInventoryProviderNull_Throws()
        {
            // Arrange.
            var dependencies = new Dependencies { ApolloPlayerInventoryProvider = null };

            // Act.
            Action act = () => dependencies.Build();

            // Assert.
            act.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "apolloPlayerInventoryProvider"));
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
            Func<Task<IActionResult>> action = async () => await controller.GetPlayerIdentity(new List<IdentityQueryAlpha> { query }).ConfigureAwait(false);

            // Assert.
            action().Should().BeAssignableTo<Task<IActionResult>>();
            action().Should().NotBeNull();
            var result = await action().ConfigureAwait(false) as OkObjectResult;
            var details = result.Value as IList<IdentityResultAlpha>;
            details.Should().NotBeNull();
            details.Should().BeOfType<List<IdentityResultAlpha>>();
        }

        [TestMethod]
        [TestCategory("Unit")]
        public async Task GetPlayerIdentites_WithInvalidInputs_DoesNotThrow()
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
        [TestCategory("Unit")]
        public async Task GetPlayerDetails_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var gamertag = Fixture.Create<string>();
            var xuid = Fixture.Create<ulong>();

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
                var details = result.Value as ApolloPlayerDetails;
                details.Should().NotBeNull();
                details.Should().BeOfType<ApolloPlayerDetails>();
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
                async () => await controller.GetPlayerDetails(TestConstants.WhiteSpace).ConfigureAwait(false)
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
            var banParameters = this.GenerateBanParameters();
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
        public void BanPlayers_WithValidParameters_UseBackgroundProcessing_DoesNotThrow()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var banParameters = this.GenerateBanParameters();
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
            var details = result.Value as IList<ApolloBanSummary>;
            details.Should().NotBeNull();
            details.Should().BeOfType<List<ApolloBanSummary>>();
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
            var details = result.Value as IList<ApolloConsoleDetails>;
            details.Should().NotBeNull();
            details.Should().BeOfType<List<ApolloConsoleDetails>>();
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
            (result.Value as ArgumentOutOfRangeException).Message.Should().Be(string.Format(CultureInfo.InvariantCulture, TestConstants.ArgumentOutOfRangeExceptionMessagePartial, nameof(maxResults), 0, maxResults));
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
            var details = result.Value as IList<ApolloSharedConsoleUser>;
            details.Should().NotBeNull();
            details.Should().BeOfType<List<ApolloSharedConsoleUser>>();
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
            (result.Value as ArgumentOutOfRangeException).Message.Should().Be(string.Format(CultureInfo.InvariantCulture, TestConstants.ArgumentOutOfRangeExceptionMessagePartial, nameof(startIndex), -1, startIndex));
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
            (result.Value as ArgumentOutOfRangeException).Message.Should().Be(string.Format(CultureInfo.InvariantCulture, TestConstants.ArgumentOutOfRangeExceptionMessagePartial, nameof(maxResults), 0, maxResults));
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
            var details = result.Value as ApolloUserFlags;
            details.Should().NotBeNull();
            details.Should().BeOfType<ApolloUserFlags>();
        }

        [TestMethod]
        [TestCategory("Unit")]
        public async Task SetUserFlags_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var xuid = Fixture.Create<ulong>();
            var userFlags = Fixture.Create<ApolloUserFlags>();

            // Act.
            Func<Task<IActionResult>> action = async () => await controller.SetUserFlags(xuid, userFlags).ConfigureAwait(false);

            // Assert.
            action().Should().BeAssignableTo<Task<IActionResult>>();
            action().Should().NotBeNull();
            var result = await action().ConfigureAwait(false) as OkObjectResult;
            var details = result.Value as ApolloUserFlags;
            details.Should().NotBeNull();
            details.Should().BeOfType<ApolloUserFlags>();
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
        public async Task GetPlayerInventory_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var profileId = Fixture.Create<int>();
            var xuid = Fixture.Create<ulong>();

            // Act.
            var actions = new List<Func<Task<IActionResult>>>
            {
                async () => await controller.GetPlayerInventory(xuid).ConfigureAwait(false),
                async () => await controller.GetPlayerInventory(profileId).ConfigureAwait(false)
            };

            // Assert.
            foreach (var action in actions)
            {
                action().Should().BeAssignableTo<Task<IActionResult>>();
                action().Should().NotBeNull();
                var result = await action().ConfigureAwait(false) as OkObjectResult;
                var details = result.Value as ApolloPlayerInventory;
                details.Should().NotBeNull();
                details.Should().BeOfType<ApolloPlayerInventory>();
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
            async Task<IActionResult> act() => await controller.GetPlayerInventoryProfiles(xuid).ConfigureAwait(false);

            // Assert.
            act().Should().BeAssignableTo<Task<IActionResult>>();
            act().Should().NotBeNull();
            var result = await act().ConfigureAwait(false) as OkObjectResult;
            var details = result.Value as IList<ApolloInventoryProfile>;
            details.Should().NotBeNull();
            details.Should().BeOfType<List<ApolloInventoryProfile>>();
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
            var details = result.Value as IList<ApolloLspGroup>;
            details.Should().NotBeNull();
            details.Should().BeOfType<List<ApolloLspGroup>>();
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
            var playerInventory = Fixture.Create<ApolloPlayerInventory>();
            var useBackgroundProcessing = false;
            var requestingAgent = Fixture.Create<string>();

            // Act.
            Func<Task<IActionResult>> action = async () => await controller.UpdatePlayerInventory(playerInventory, useBackgroundProcessing, requestingAgent).ConfigureAwait(false);

            // Assert.
            action().Should().BeAssignableTo<Task<IActionResult>>();
            action().Should().NotBeNull();
            var result = await action().ConfigureAwait(false) as CreatedResult;
            var details = result.Value as ApolloPlayerInventory;
            details.Should().NotBeNull();
            details.Should().BeOfType<ApolloPlayerInventory>();
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
            var playerInventory = Fixture.Create<ApolloPlayerInventory>();
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
        public void UpdatePlayerInventory_WithValidParameters_UseBackgroundProcessing_ReturnsCorrectType()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var playerInventory = Fixture.Create<ApolloPlayerInventory>();
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
            var playerInventory = Fixture.Create<ApolloPlayerInventory>();
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
            var groupGift = Fixture.Create<ApolloGroupGift>();
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
                var details = result.Value as ApolloPlayerInventory;
                details.Should().NotBeNull();
                details.Should().BeOfType<ApolloPlayerInventory>();
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
            var groupGift = Fixture.Create<ApolloGroupGift>();
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
        public void UpdatePlayerInventories_WithValidParameters_UseBackgroundProcessing_ReturnsCorrectType()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var groupGift = Fixture.Create<ApolloGroupGift>();
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
            var groupGift = Fixture.Create<ApolloGroupGift>();
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
            var playerInventory = Fixture.Create<ApolloPlayerInventory>();
            var adminAuth = TestConstants.GetSecretResult;
            var requestingAgent = Fixture.Create<string>();

            // Act.
            Func<Task<IActionResult>> action = async () => await controller.UpdateGroupInventories(groupId, playerInventory, adminAuth, requestingAgent).ConfigureAwait(false);

            // Assert.
            action().Should().BeAssignableTo<Task<IActionResult>>();
            action().Should().NotBeNull();
            var result = await action().ConfigureAwait(false) as CreatedResult;
            var details = result.Value as ApolloPlayerInventory;
            details.Should().NotBeNull();
            details.Should().BeOfType<ApolloPlayerInventory>();
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
            var playerInventory = Fixture.Create<ApolloPlayerInventory>();
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
            var playerInventory = Fixture.Create<ApolloPlayerInventory>();
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
            var playerInventory = Fixture.Create<ApolloPlayerInventory>();

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
            var details = result.Value as IList<ApolloGiftHistory>;
            details.Should().NotBeNull();
            details.Should().BeOfType<List<ApolloGiftHistory>>();
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
            var details = result.Value as IList<ApolloGiftHistory>;
            details.Should().NotBeNull();
            details.Should().BeOfType<List<ApolloGiftHistory>>();
        }

        private List<ApolloBanParameters> GenerateBanParameters()
        {
            var newParams = new ApolloBanParameters
            {
                Xuid = 111,
                Gamertag = "gamerT1",
                FeatureArea = "Matchmaking",
                Reason = "Disgusting license plate.",
                StartTimeUtc = DateTime.UtcNow,
                ExpireTimeUtc = DateTime.UtcNow.AddSeconds(1),
                BanAllConsoles = false,
                BanAllPcs = false,
                DeleteLeaderboardEntries = false,
                SendReasonNotification = false
            };

            return new List<ApolloBanParameters> { newParams };
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

                this.ApolloPlayerDetailsProvider.GetPlayerIdentityAsync(Arg.Any<IdentityQueryAlpha>()).Returns(Fixture.Create<IdentityResultAlpha>());
                this.ApolloPlayerDetailsProvider.GetPlayerDetailsAsync(Arg.Any<string>()).Returns(Fixture.Create<ApolloPlayerDetails>());
                this.ApolloPlayerDetailsProvider.GetPlayerDetailsAsync(Arg.Any<ulong>()).Returns(Fixture.Create<ApolloPlayerDetails>());
                this.ApolloPlayerDetailsProvider.EnsurePlayerExistsAsync(Arg.Any<ulong>()).Returns(true);
                this.ApolloPlayerDetailsProvider.GetUserBanHistoryAsync(Arg.Any<ulong>()).Returns(Fixture.Create<IList<LiveOpsBanHistory>>());
                this.ApolloPlayerDetailsProvider.GetUserBanSummariesAsync(Arg.Any<IList<ulong>>()).Returns(Fixture.Create<IList<ApolloBanSummary>>());
                this.ApolloPlayerDetailsProvider.GetConsolesAsync(Arg.Any<ulong>(), Arg.Any<int>()).Returns(Fixture.Create<IList<ApolloConsoleDetails>>());
                this.ApolloPlayerDetailsProvider.GetSharedConsoleUsersAsync(Arg.Any<ulong>(), Arg.Any<int>(), Arg.Any<int>()).Returns(Fixture.Create<IList<ApolloSharedConsoleUser>>());
                this.ApolloPlayerDetailsProvider.GetUserFlagsAsync(Arg.Any<ulong>()).Returns(Fixture.Create<ApolloUserFlags>());
                this.ApolloPlayerDetailsProvider.EnsurePlayerExistsAsync(Arg.Any<ulong>()).Returns(true);
                this.ApolloPlayerDetailsProvider.EnsurePlayerExistsAsync(Arg.Any<string>()).Returns(true);
                this.ApolloPlayerInventoryProvider.GetPlayerInventoryAsync(Arg.Any<ulong>()).Returns(Fixture.Create<ApolloPlayerInventory>());
                this.ApolloPlayerInventoryProvider.GetPlayerInventoryAsync(Arg.Any<int>()).Returns(Fixture.Create<ApolloPlayerInventory>());
                this.ApolloPlayerInventoryProvider.GetInventoryProfilesAsync(Arg.Any<ulong>()).Returns(Fixture.Create<IList<ApolloInventoryProfile>>());
                this.ApolloPlayerDetailsProvider.GetLspGroupsAsync(Arg.Any<int>(), Arg.Any<int>()).Returns(Fixture.Create<IList<ApolloLspGroup>>());
                this.GiftHistoryProvider.GetGiftHistoriesAsync(Arg.Any<string>(), Arg.Any<string>(), Arg.Any<GiftHistoryAntecedent>()).Returns(Fixture.Create<IList<ApolloGiftHistory>>());
                this.KeyVaultProvider.GetSecretAsync(Arg.Any<string>(), Arg.Any<string>()).Returns(TestConstants.GetSecretResult);
            }

            public IApolloPlayerDetailsProvider ApolloPlayerDetailsProvider { get; set; } = Substitute.For<IApolloPlayerDetailsProvider>();

            public IApolloPlayerInventoryProvider ApolloPlayerInventoryProvider { get; set; } = Substitute.For<IApolloPlayerInventoryProvider>();

            public IKeyVaultProvider KeyVaultProvider { get; set; } = Substitute.For<IKeyVaultProvider>();

            public IApolloGiftHistoryProvider GiftHistoryProvider { get; set; } = Substitute.For<IApolloGiftHistoryProvider>();

            public IApolloBanHistoryProvider BanHistoryProvider { get; set; } = Substitute.For<IApolloBanHistoryProvider>();

            public IConfiguration Configuration { get; set; } = Substitute.For<IConfiguration>();

            public IScheduler Scheduler { get; set; } = Substitute.For<IScheduler>();

            public IJobTracker JobTracker { get; set; } = Substitute.For<IJobTracker>();

            public IRequestValidator<ApolloBanParameters> BanParametersRequestValidator { get; set; } = Substitute.For<IRequestValidator<ApolloBanParameters>>();

            public IRequestValidator<ApolloPlayerInventory> PlayerInventoryRequestValidator { get; set; } = Substitute.For<IRequestValidator<ApolloPlayerInventory>>();

            public IRequestValidator<ApolloGroupGift> GroupGiftRequestValidator { get; set; } = Substitute.For<IRequestValidator<ApolloGroupGift>>();

            public ApolloController Build() => new ApolloController(
                                                                    this.ApolloPlayerDetailsProvider,
                                                                    this.ApolloPlayerInventoryProvider,
                                                                    this.KeyVaultProvider,
                                                                    this.GiftHistoryProvider,
                                                                    this.BanHistoryProvider,
                                                                    this.Configuration,
                                                                    this.Scheduler,
                                                                    this.JobTracker,
                                                                    this.BanParametersRequestValidator,
                                                                    this.PlayerInventoryRequestValidator,
                                                                    this.GroupGiftRequestValidator)
                { ControllerContext = this.ControllerContext };
        }
    }
}
