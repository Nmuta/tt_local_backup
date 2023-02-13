using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoFixture;
using AutoMapper;
using FluentAssertions;
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
using Turn10.LiveOps.StewardApi.Contracts.Steelhead;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead.RacersCup;
using Turn10.LiveOps.StewardApi.Controllers;
using Turn10.LiveOps.StewardApi.Logging;
using Turn10.LiveOps.StewardApi.ProfileMappers;
using Turn10.LiveOps.StewardApi.Providers;
using Turn10.LiveOps.StewardApi.Providers.Data;
using Turn10.LiveOps.StewardApi.Providers.Steelhead;
using Turn10.LiveOps.StewardApi.Validation;

namespace Turn10.LiveOps.StewardTest.Unit.Steelhead
{
    [TestClass]
    public sealed class SteelheadControllerTests
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
        public void Ctor_WhenSteelheadPlayerDetailsProviderNull_Throws()
        {
            // Arrange.
            var dependencies = new Dependencies { SteelheadPlayerDetailsProvider = null };

            // Act.
            Action act = () => dependencies.Build();

            // Assert.
            act.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "steelheadPlayerDetailsProvider"));
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void Ctor_WhenSteelheadPlayerInventoryProviderNull_Throws()
        {
            // Arrange.
            var dependencies = new Dependencies { SteelheadPlayerInventoryProvider = null };

            // Act.
            Action act = () => dependencies.Build();

            // Assert.
            act.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "steelheadPlayerInventoryProvider"));
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void Ctor_WhenSteelheadServiceManagementProviderNull_Throws()
        {
            // Arrange.
            var dependencies = new Dependencies { SteelheadServiceManagementProvider = null };

            // Act.
            Action act = () => dependencies.Build();

            // Assert.
            act.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "steelheadServiceManagementProvider"));
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void Ctor_WhenSteelheadNotificationProviderNull_Throws()
        {
            // Arrange.
            var dependencies = new Dependencies { SteelheadNotificationProvider = null };

            // Act.
            Action act = () => dependencies.Build();

            // Assert.
            act.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "steelheadNotificationProvider"));
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
        [TestCategory("Unit")]
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
                var details = result.Value as SteelheadPlayerDetails;
                details.Should().NotBeNull();
                details.Should().BeOfType<SteelheadPlayerDetails>();
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
            controller.Request.Headers.Add("endpointKey", "Steelhead|Studio");
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
            controller.Request.Headers.Add("endpointKey", "Opus|Development");
            var gamertag = Fixture.Create<string>();

            // Act.
            var actions = new List<Func<Task<IActionResult>>>
            {
                async () => await controller.GetPlayerDetails(gamertag).ConfigureAwait(false),
            };

            foreach (var action in actions)
            {
                action.Should().Throw<BadHeaderStewardException>().WithMessage(string.Format(TestConstants.BadHeaderStewardExceptionBadTitleMessagePartial, "Opus", "Steelhead"));
            }
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void GetPlayerDetails_InvalidKeyEndpointKeyHeader_Throws()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            controller.Request.Headers.Add("endpointKey", "Steelhead|Tiger");
            var gamertag = Fixture.Create<string>();

            // Act.
            var actions = new List<Func<Task<IActionResult>>>
            {
                async () => await controller.GetPlayerDetails(gamertag).ConfigureAwait(false),
            };

            foreach (var action in actions)
            {
                action.Should().Throw<BadHeaderStewardException>().WithMessage(string.Format(TestConstants.BadHeaderStewardExceptionBadEndpointKeyMessagePartial, "Tiger", "Steelhead"));
            }
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void GetPlayerDetails_NoEndpointKeyEndpointKeyHeader_Throws()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            controller.Request.Headers.Add("endpointKey", "Steelhead|");
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
            controller.Request.Headers.Add("endpointKey", "|Development");
            var gamertag = Fixture.Create<string>();

            // Act.
            var actions = new List<Func<Task<IActionResult>>>
            {
                async () => await controller.GetPlayerDetails(gamertag).ConfigureAwait(false),
            };

            foreach (var action in actions)
            {
                action.Should().Throw<BadHeaderStewardException>().WithMessage(string.Format(TestConstants.BadHeaderStewardExceptionBadTitleMessagePartial, "", "Steelhead"));
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
            const int startIndex = -1;
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
            const int maxResults = -1;

            // Act.
            Func<Task<IActionResult>> action = async () => await controller.GetSharedConsoleUsers(xuid, startIndex, maxResults).ConfigureAwait(false);

            // Assert.

            action.Should().Throw<ArgumentOutOfRangeException>().WithMessage(string.Format(TestConstants.ArgumentOutOfRangeExceptionMessagePartial, nameof(maxResults), 0, maxResults));
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
            var details = result.Value as IList<SteelheadInventoryProfile>;
            details.Should().NotBeNull();
            details.Should().BeOfType<List<SteelheadInventoryProfile>>();
        }

        [TestMethod]
        [TestCategory("Unit")]
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
        [TestCategory("Unit")]
        public async Task UpdatePlayerInventories_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var groupGift = Fixture.Create<SteelheadGroupGift>();
            groupGift.Inventory.Cars = new List<MasterInventoryItem> { new MasterInventoryItem { Id = 1, Quantity = 1 } };
            groupGift.Inventory.VanityItems = new List<MasterInventoryItem> { new MasterInventoryItem { Id = 1, Quantity = 1 } };


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
            Func<Task<IActionResult>> action = async () => await controller.UpdateGroupInventories(null).ConfigureAwait(false);

            // Assert.
            action.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "groupGift"));
        }

        [TestMethod]
        [TestCategory("Unit")]
        public async Task UpdatePlayerInventories_WithValidParameters_UseBackgroundProcessing_ReturnsCorrectType()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var groupGift = Fixture.Create<SteelheadGroupGift>();
            groupGift.Inventory.Cars = new List<MasterInventoryItem> { new MasterInventoryItem { Id = 1, Quantity = 1 } };
            groupGift.Inventory.VanityItems = new List<MasterInventoryItem> { new MasterInventoryItem { Id = 1, Quantity = 1 } };

            // Act.
            async Task<IActionResult> Action() => await controller.UpdateGroupInventoriesUseBackgroundProcessing(groupGift).ConfigureAwait(false);

            // Assert.
            // To reset the context and prevent header key collision, rebuild the Dependencies.
            var result = await Action().ConfigureAwait(false);
            result.Should().BeOfType<CreatedResult>();
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void UpdatePlayerInventories_WithNullGroupGift_UseBackgroundProcessing_Throws()
        {
            // Arrange.
            var controller = new Dependencies().Build();

            // Act.
            Func<Task<IActionResult>> action = async () => await controller.UpdateGroupInventories(null).ConfigureAwait(false);

            // Assert.
            action.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "groupGift"));
        }

        [TestMethod]
        [TestCategory("Unit")]
        public async Task UpdateGroupInventories_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var groupId = Fixture.Create<int>();
            var gift = Fixture.Create<SteelheadGift>();
            gift.Inventory.Cars = new List<MasterInventoryItem> { new MasterInventoryItem { Id = 1, Quantity = 1 } };
            gift.Inventory.VanityItems = new List<MasterInventoryItem> { new MasterInventoryItem { Id = 1, Quantity = 1 } };

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
            var startDate = Fixture.Create<DateTimeOffset>();
            var endDate = startDate.AddDays(10);

            // Act.
            async Task<IActionResult> Action() => await controller.GetGiftHistoriesAsync(xuid, startDate, endDate).ConfigureAwait(false);

            // Assert.
            Action().Should().BeAssignableTo<Task<IActionResult>>();
            Action().Should().NotBeNull();
            var result = await Action().ConfigureAwait(false) as OkObjectResult;
            var details = result.Value as IList<SteelheadGiftHistory>;
            details.Should().NotBeNull();
            details.Should().BeOfType<List<SteelheadGiftHistory>>();
        }

        [TestMethod]
        [TestCategory("Unit")]
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
            var details = result.Value as IList<SteelheadGiftHistory>;
            details.Should().NotBeNull();
            details.Should().BeOfType<List<SteelheadGiftHistory>>();
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
            communityMessage.StartTimeUtc = DateTime.UtcNow.AddMinutes(1);
            communityMessage.ExpireTimeUtc = DateTime.UtcNow.AddMinutes(5);

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
                async () => await controller.SendGroupNotifications(groupId, null).ConfigureAwait(false)
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
                async () => await controller.SendGroupNotifications(groupId, new LspGroupCommunityMessage{Message = TestConstants.WhiteSpace, StartTimeUtc = sendDate, ExpireTimeUtc = endDate, DeviceType = deviceType}).ConfigureAwait(false)
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
            var sendDate = DateTime.UtcNow.AddMinutes(1);
            var endDate = DateTime.UtcNow.AddMinutes(5);
            const DeviceType deviceType = DeviceType.All;

            // Act.
            var actions = new List<Func<Task>>
            {
                async () => await controller.SendPlayerNotifications(new BulkCommunityMessage{Xuids = new List<ulong>(), Message = tooLong, StartTimeUtc = sendDate, ExpireTimeUtc = endDate}).ConfigureAwait(false),
                async () => await controller.SendGroupNotifications(groupId, new LspGroupCommunityMessage{Message = tooLong, StartTimeUtc = sendDate, ExpireTimeUtc = endDate, DeviceType = deviceType}).ConfigureAwait(false),
            };

            // Assert.
            foreach (var action in actions)
            {
                action.Should().Throw<InvalidArgumentsStewardException>().WithMessage(string.Format(TestConstants.ArgumentTooLongExceptionMessagePartial, "Message", "512"));
            }
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void SendPlayerNotifications_WithExpirationBeforeNow_Throws()
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
        [TestCategory("Unit")]
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
        [TestCategory("Unit")]
        public async Task EditNotification_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var notificationId = Fixture.Create<Guid>();
            var xuid = Fixture.Create<ulong>();
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
        [TestCategory("Unit")]
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
        [TestCategory("Unit")]
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
        [TestCategory("Unit")]
        public void EditNotification_WithNullEmptyWhitespaceMessage_Throws()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var notificationId = Fixture.Create<Guid>();
            var xuid = Fixture.Create<ulong>();
            var sendDate = DateTime.UtcNow.AddMinutes(1);
            var endDate = DateTime.UtcNow.AddMinutes(-5);
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
        [TestCategory("Unit")]
        public void EditPlayerNotifications_WithTooLongMessage_Throws()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var notificationId = Fixture.Create<Guid>();
            var xuid = Fixture.Create<ulong>();
            var tooLong = new string('*', 520);
            var sendDate = DateTime.UtcNow.AddMinutes(1);
            var endDate = DateTime.UtcNow.AddMinutes(-5);
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
        [TestCategory("Unit")]
        public async Task DeleteNotification_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var notificationId = Fixture.Create<Guid>();
            var xuid = Fixture.Create<ulong>();

            // Act.
            async Task<IActionResult> Action() => await controller.DeletePlayerNotification(notificationId, xuid).ConfigureAwait(false);

            // Assert.
            Action().Should().BeAssignableTo<Task<IActionResult>>();
            Action().Should().NotBeNull();
            var result = await Action().ConfigureAwait(false);
            result.Should().BeOfType<OkResult>();
        }

        [TestMethod]
        [TestCategory("Unit")]
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

        [TestMethod]
        [TestCategory("Unit")]
        public async Task GetCmsRacersCupSchedule_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var xuid = Fixture.Create<ulong>();
            var environment = Fixture.Create<string>();
            var slotId = Fixture.Create<string>();
            var snapshotId = Fixture.Create<string>();
            var startTime = DateTime.UtcNow.AddMinutes(1);
            var daysForward = Fixture.Create<int>();

            // Act.
            var actions = new List<Func<Task<IActionResult>>>
            {
                async () => await controller.GetCmsRacersCupSchedule(environment, slotId, snapshotId, startTime, daysForward).ConfigureAwait(false),
                async () => await controller.GetCmsRacersCupScheduleForUser(xuid, startTime, daysForward).ConfigureAwait(false),
            };

            // Assert.
            foreach (var action in actions)
            {
                action().Should().BeAssignableTo<Task<IActionResult>>();
                action().Should().NotBeNull();
                var result = await action().ConfigureAwait(false) as OkObjectResult;
                var details = result.Value as RacersCupSchedule;
                details.Should().NotBeNull();
                details.Should().BeOfType<RacersCupSchedule>();
            }
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void GetCmsRacersCupSchedule_WithStartTimeInPast_Throws()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var xuid = Fixture.Create<ulong>();
            var environment = Fixture.Create<string>();
            var slotId = Fixture.Create<string>();
            var snapshotId = Fixture.Create<string>();
            var startTime = DateTime.UtcNow.AddMinutes(-1);
            var daysForward = Fixture.Create<int>();

            // Act.
            var actions = new List<Func<Task<IActionResult>>>
            {
                async () => await controller.GetCmsRacersCupSchedule(environment, slotId, snapshotId, startTime, daysForward).ConfigureAwait(false),
                async () => await controller.GetCmsRacersCupScheduleForUser(xuid, startTime, daysForward).ConfigureAwait(false),
            };

            // Assert.
            foreach (var action in actions)
            {
                action.Should().Throw<BadRequestStewardException>().WithMessage("Start time provided must not be in the past.");
            }
        }

        private static List<SteelheadBanParametersInput> GenerateBanParameters()
        {
            var newParams = new SteelheadBanParametersInput
            {
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
            };

            return new List<SteelheadBanParametersInput> { newParams };
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

                this.KustoProvider.GetMasterInventoryListAsync(Arg.Any<string>()).Returns(new List<MasterInventoryItem> { new MasterInventoryItem { Id = 1, Quantity = 1 } });
                this.SteelheadPlayerDetailsProvider.GetPlayerIdentitiesAsync(Arg.Any<IList<IdentityQueryAlpha>>(), Arg.Any<string>()).Returns(Fixture.Create<IList<IdentityResultAlpha>>());
                this.SteelheadPlayerDetailsProvider.GetPlayerDetailsAsync(Arg.Any<ulong>(), Arg.Any<string>()).Returns(Fixture.Create<SteelheadPlayerDetails>());
                this.SteelheadPlayerDetailsProvider.GetPlayerDetailsAsync(Arg.Any<string>(), Arg.Any<string>()).Returns(Fixture.Create<SteelheadPlayerDetails>());
                this.SteelheadPlayerDetailsProvider.GetConsolesAsync(Arg.Any<ulong>(), Arg.Any<int>(), Arg.Any<string>()).Returns(Fixture.Create<IList<ConsoleDetails>>());
                this.SteelheadPlayerDetailsProvider.GetSharedConsoleUsersAsync(Arg.Any<ulong>(), Arg.Any<int>(), Arg.Any<int>(), Arg.Any<string>()).Returns(Fixture.Create<IList<SharedConsoleUser>>());
                this.SteelheadPlayerDetailsProvider.DoesPlayerExistAsync(Arg.Any<ulong>(), Arg.Any<string>()).Returns(true);
                this.SteelheadPlayerDetailsProvider.DoesPlayerExistAsync(Arg.Any<string>(), Arg.Any<string>()).Returns(true);
                this.SteelheadPlayerDetailsProvider.BanUsersAsync(Arg.Any<IList<SteelheadBanParameters>>(), Arg.Any<string>(), Arg.Any<string>()).Returns(Fixture.Create<IList<BanResult>>());
                this.SteelheadPlayerDetailsProvider.GetUserBanSummariesAsync(Arg.Any<IList<ulong>>(), Arg.Any<string>()).Returns(Fixture.Create<IList<BanSummary>>());
                this.SteelheadPlayerDetailsProvider.GetUserBanHistoryAsync(Arg.Any<ulong>(), Arg.Any<string>()).Returns(Fixture.Create<IList<LiveOpsBanHistory>>());
                this.SteelheadPlayerDetailsProvider.GetCmsRacersCupScheduleForUserAsync(Arg.Any<ulong>(), Arg.Any<DateTime>(), Arg.Any<int>(), Arg.Any<string>()).Returns(Fixture.Create<RacersCupSchedule>());
                this.SteelheadNotificationProvider.GetPlayerNotificationsAsync(Arg.Any<ulong>(), Arg.Any<int>(), Arg.Any<string>()).Returns(Fixture.Create<IList<Notification>>());
                this.SteelheadNotificationProvider.GetGroupNotificationsAsync(Arg.Any<int>(), Arg.Any<int>(), Arg.Any<string>()).Returns(Fixture.Create<IList<UserGroupNotification>>());
                this.SteelheadNotificationProvider.SendNotificationsAsync(Arg.Any<IList<ulong>>(), Arg.Any<string>(), Arg.Any<DateTime>(), Arg.Any<string>()).Returns(Fixture.Create<IList<MessageSendResult<ulong>>>());
                this.SteelheadNotificationProvider.SendGroupNotificationAsync(Arg.Any<int>(), Arg.Any<string>(), Arg.Any<DateTime>(), Arg.Any<DeviceType>(), Arg.Any<string>(), Arg.Any<string>()).Returns(Fixture.Create<MessageSendResult<int>>());
                this.SteelheadPlayerInventoryProvider.GetInventoryProfilesAsync(Arg.Any<ulong>(), Arg.Any<string>()).Returns(Fixture.Create<IList<SteelheadInventoryProfile>>());
                this.SteelheadServiceManagementProvider.GetLspGroupsAsync(Arg.Any<string>()).Returns(new List<LspGroup> { new LspGroup { Id = TestConstants.InvalidProfileId, Name = "UnitTesting" } });
                this.SteelheadServiceManagementProvider.GetCmsRacersCupScheduleAsync(Arg.Any<string>(), Arg.Any<string>(), Arg.Any<string>(), Arg.Any<DateTime>(), Arg.Any<int>(), Arg.Any<string>()).Returns(Fixture.Create<RacersCupSchedule>());
                this.SteelheadPlayerInventoryProvider.UpdateGroupInventoriesAsync(Arg.Any<int>(), Arg.Any<SteelheadGift>(), Arg.Any<string>(), Arg.Any<bool>(), Arg.Any<string>()).Returns(Fixture.Create<GiftResponse<int>>()); ;
                this.SteelheadPlayerInventoryProvider.UpdatePlayerInventoriesAsync(Arg.Any<SteelheadGroupGift>(), Arg.Any<string>(), Arg.Any<bool>(), Arg.Any<string>()).Returns(Fixture.Create<IList<GiftResponse<ulong>>>());
                this.JobTracker.CreateNewJobAsync(Arg.Any<string>(), Arg.Any<string>(), Arg.Any<string>(), Arg.Any<HttpResponse>()).Returns(Fixture.Create<string>());
                this.KeyVaultProvider.GetSecretAsync(Arg.Any<string>(), Arg.Any<string>()).Returns(TestConstants.GetSecretResult);
                this.GiftHistoryProvider.GetGiftHistoriesAsync(Arg.Any<string>(), Arg.Any<string>(), Arg.Any<GiftIdentityAntecedent>(), Arg.Any<string>(), Arg.Any<DateTimeOffset>(), Arg.Any<DateTimeOffset>()).Returns(Fixture.Create<IList<SteelheadGiftHistory>>());
            }

            public IActionLogger ActionLogger { get; set; } = Substitute.For<IActionLogger>();

            public ILoggingService LoggingService { get; set; } = Substitute.For<ILoggingService>();

            public IKustoProvider KustoProvider { get; set; } = Substitute.For<IKustoProvider>();

            public ISteelheadPlayerDetailsProvider SteelheadPlayerDetailsProvider { get; set; } = Substitute.For<ISteelheadPlayerDetailsProvider>();

            public ISteelheadPlayerInventoryProvider SteelheadPlayerInventoryProvider { get; set; } = Substitute.For<ISteelheadPlayerInventoryProvider>();

            public ISteelheadServiceManagementProvider SteelheadServiceManagementProvider { get; set; } = Substitute.For<ISteelheadServiceManagementProvider>();

            public ISteelheadNotificationProvider SteelheadNotificationProvider { get; set; } = Substitute.For<ISteelheadNotificationProvider>();

            public IKeyVaultProvider KeyVaultProvider { get; set; } = Substitute.For<IKeyVaultProvider>();

            public ISteelheadGiftHistoryProvider GiftHistoryProvider { get; set; } = Substitute.For<ISteelheadGiftHistoryProvider>();

            public ISteelheadBanHistoryProvider BanHistoryProvider { get; set; } = Substitute.For<ISteelheadBanHistoryProvider>();

            public INotificationHistoryProvider NotificationHistoryProvider { get; set; } =
                Substitute.For<INotificationHistoryProvider>();

            public IConfiguration Configuration { get; set; } = Substitute.For<IConfiguration>();

            public IScheduler Scheduler { get; set; } = Substitute.For<IScheduler>();

            public IJobTracker JobTracker { get; set; } = Substitute.For<IJobTracker>();

            public IMapper Mapper { get; set; } = Substitute.ForPartsOf<Mapper>(new MapperConfiguration(mc =>
            {
                mc.AddProfile(new SteelheadProfileMapper());
                mc.AllowNullCollections = true;
            }));

            public IRequestValidator<SteelheadMasterInventory> MasterInventoryRequestValidator { get; set; } = Substitute.For<IRequestValidator<SteelheadMasterInventory>>();

            public IRequestValidator<SteelheadGift> GiftRequestValidator { get; set; } = Substitute.For<IRequestValidator<SteelheadGift>>();

            public IRequestValidator<SteelheadGroupGift> GroupGiftRequestValidator { get; set; } = Substitute.For<IRequestValidator<SteelheadGroupGift>>();

            public IRequestValidator<SteelheadBanParametersInput> BanParametersRequestValidator { get; set; } = Substitute.For<IRequestValidator<SteelheadBanParametersInput>>();

            public SteelheadController Build() => new SteelheadController(
                new MemoryCache(new MemoryCacheOptions()),
                this.ActionLogger,
                this.LoggingService,
                this.KustoProvider,
                this.SteelheadPlayerDetailsProvider,
                this.SteelheadPlayerInventoryProvider,
                this.SteelheadServiceManagementProvider,
                this.SteelheadNotificationProvider,
                this.KeyVaultProvider,
                this.GiftHistoryProvider,
                this.BanHistoryProvider,
                this.NotificationHistoryProvider,
                this.Configuration,
                this.Scheduler,
                this.JobTracker,
                this.Mapper,
                this.MasterInventoryRequestValidator,
                this.GiftRequestValidator,
                this.GroupGiftRequestValidator,
                this.BanParametersRequestValidator)
            { ControllerContext = this.ControllerContext };
        }
    }
}
