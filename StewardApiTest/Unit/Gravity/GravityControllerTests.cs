using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoFixture;
using FluentAssertions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using Turn10.LiveOps.StewardApi.Contracts;
using Turn10.LiveOps.StewardApi.Contracts.Gravity;
using Turn10.LiveOps.StewardApi.Controllers;
using Turn10.LiveOps.StewardApi.Logging;
using Turn10.LiveOps.StewardApi.Providers;
using Turn10.LiveOps.StewardApi.Providers.Gravity;
using Turn10.LiveOps.StewardApi.Validation;

namespace Turn10.LiveOps.StewardTest.Unit.Gravity
{
    [TestClass]
    public sealed class GravityControllerTests
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
        public void Ctor_WhenGravityPlayerDetailsProviderNull_Throws()
        {
            // Arrange.
            var dependencies = new Dependencies { GravityPlayerDetailsProvider = null };

            // Act.
            Action act = () => dependencies.Build();

            // Assert.
            act.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "gravityPlayerDetailsProvider"));
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void Ctor_WhenGravityPlayerInventoryProviderNull_Throws()
        {
            // Arrange.
            var dependencies = new Dependencies { GravityPlayerInventoryProvider = null };

            // Act.
            Action act = () => dependencies.Build();

            // Assert.
            act.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "gravityPlayerInventoryProvider"));
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
        public void Ctor_WhenGravitySettingsProviderNull_Throws()
        {
            // Arrange.
            var dependencies = new Dependencies { GravityGameSettingsProvider = null };

            // Act.
            Action act = () => dependencies.Build();

            // Assert.
            act.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "gravityGameSettingsProvider"));
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
            var dependencies = new Dependencies { GiftRequestValidator = null };

            // Act.
            Action act = () => dependencies.Build();

            // Assert.
            act.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "giftRequestValidator"));
        }

        [TestMethod]
        [TestCategory("Unit")]
        public async Task GetPlayerIdentities_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var query = Fixture.Create<IdentityQueryBeta>();

            // Act.
            async Task<IActionResult> Action() => await controller.GetPlayerIdentity(new List<IdentityQueryBeta> { query }).ConfigureAwait(false);

            // Assert.
            Action().Should().BeAssignableTo<Task<IActionResult>>();
            Action().Should().NotBeNull();
            var result = await Action().ConfigureAwait(false) as OkObjectResult;
            var details = result.Value as IList<IdentityResultBeta>;
            details.Should().NotBeNull();
            details.Should().BeOfType<List<IdentityResultBeta>>();
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void GetPlayerIdentities_WithInvalidInputs_DoesNotThrow()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var query = new IdentityQueryBeta { Xuid = default, Gamertag = null, T10Id = null };

            // Act.
            Func<Task<IActionResult>> action = async () => await controller.GetPlayerIdentity(new List<IdentityQueryBeta> { query }).ConfigureAwait(false);

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
                async () => await controller.GetPlayerDetailsByT10Id(t10Id).ConfigureAwait(false)
            };

            // Assert.
            foreach (var action in actions)
            {
                action().Should().BeAssignableTo<Task<IActionResult>>();
                action().Should().NotBeNull();
                var result = await action().ConfigureAwait(false) as OkObjectResult;
                var details = result.Value as GravityPlayerDetails;
                details.Should().NotBeNull();
                details.Should().BeOfType<GravityPlayerDetails>();
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
        public void GetPlayerDetailsByT10Id_WithNullEmptyWhiteSpaceT10Id_Throws()
        {
            // Arrange.
            var controller = new Dependencies().Build();

            // Act.
            var actions = new List<Func<Task<IActionResult>>>
            {
                async () => await controller.GetPlayerDetailsByT10Id(null).ConfigureAwait(false),
                async () => await controller.GetPlayerDetailsByT10Id(TestConstants.Empty).ConfigureAwait(false),
                async () => await controller.GetPlayerDetailsByT10Id(TestConstants.WhiteSpace).ConfigureAwait(false),
            };

            // Assert.
            foreach (var action in actions)
            {
                action.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "t10Id"));
            }
        }

        [TestMethod]
        [TestCategory("Unit")]
        public async Task GetPlayerInventory_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var profileId = Fixture.Create<string>();
            var xuid = Fixture.Create<ulong>();
            var t10Id = Fixture.Create<string>();

            // Act.
            var actions = new List<Func<Task<IActionResult>>>
            {
                async () => await controller.GetPlayerInventory(xuid).ConfigureAwait(false),
                async () => await controller.GetPlayerInventory(t10Id).ConfigureAwait(false),
                async () => await controller.GetPlayerInventory(xuid, profileId).ConfigureAwait(false),
                async () => await controller.GetPlayerInventory(t10Id, profileId).ConfigureAwait(false)
            };

            // Assert.
            foreach (var action in actions)
            {
                action().Should().BeAssignableTo<Task<IActionResult>>();
                action().Should().NotBeNull();
                var result = await action().ConfigureAwait(false) as OkObjectResult;
                var details = result.Value as GravityPlayerInventoryBeta;
                details.Should().NotBeNull();
                details.Should().BeOfType<GravityPlayerInventoryBeta>();
            }
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void GetPlayerInventory_WithNullEmptyWhitespaceT10Id_Throws()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var profileId = Fixture.Create<string>();

            // Act.
            var actions = new List<Func<Task<IActionResult>>>
            {
                async () => await controller.GetPlayerInventory(null).ConfigureAwait(false),
                async () => await controller.GetPlayerInventory(TestConstants.Empty).ConfigureAwait(false),
                async () => await controller.GetPlayerInventory(TestConstants.WhiteSpace).ConfigureAwait(false),
                async () => await controller.GetPlayerInventory(null, profileId).ConfigureAwait(false),
                async () => await controller.GetPlayerInventory(TestConstants.Empty, profileId).ConfigureAwait(false),
                async () => await controller.GetPlayerInventory(TestConstants.WhiteSpace, profileId).ConfigureAwait(false)
            };

            // Assert.
            foreach (var action in actions)
            {
                action.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "t10Id"));
            }
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void GetPlayerInventory_WithNullEmptyWhitespaceProfileId_Throws()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var t10Id = Fixture.Create<string>();
            var xuid = Fixture.Create<ulong>();

            // Act.
            var actions = new List<Func<Task<IActionResult>>>
            {
                async () => await controller.GetPlayerInventory(xuid, null).ConfigureAwait(false),
                async () => await controller.GetPlayerInventory(xuid, TestConstants.Empty).ConfigureAwait(false),
                async () => await controller.GetPlayerInventory(xuid, TestConstants.WhiteSpace).ConfigureAwait(false),
                async () => await controller.GetPlayerInventory(t10Id, null).ConfigureAwait(false),
                async () => await controller.GetPlayerInventory(t10Id, TestConstants.Empty).ConfigureAwait(false),
                async () => await controller.GetPlayerInventory(t10Id, TestConstants.WhiteSpace).ConfigureAwait(false)
            };

            // Assert.
            foreach (var action in actions)
            {
                action.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "profileId"));
            }
        }

        [TestMethod]
        [TestCategory("Unit")]
        public async Task UpdatePlayerInventory_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var t10Id = Fixture.Create<string>();
            var gift = Fixture.Create<GravityGift>();

            gift.Inventory.CreditRewards = new List<MasterInventoryItem> { new MasterInventoryItem { Id = 1, } };
            gift.Inventory.Cars = new List<MasterInventoryItem> { new MasterInventoryItem { Id = 1, } };
            gift.Inventory.EnergyRefills = new List<MasterInventoryItem> { new MasterInventoryItem { Id = 1, } };
            gift.Inventory.MasteryKits = new List<MasterInventoryItem> { new MasterInventoryItem { Id = 1, } };
            gift.Inventory.RepairKits = new List<MasterInventoryItem> { new MasterInventoryItem { Id = 1, } };
            gift.Inventory.UpgradeKits = new List<MasterInventoryItem> { new MasterInventoryItem { Id = 1, } };

            // Act.
            var actions = new List<Func<Task<IActionResult>>>
            {
                async () => await controller.UpdatePlayerInventoryByT10Id(t10Id, gift).ConfigureAwait(false)
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
        public void UpdatePlayerInventory_WithNullPlayerInventory_Throws()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var t10Id = Fixture.Create<string>();
            var gift = Fixture.Create<GravityGift>();

            // Act.
            var actions = new List<Func<Task<IActionResult>>>
            {
                async () => await controller.UpdatePlayerInventoryByT10Id(t10Id, null).ConfigureAwait(false)
            };

            // Assert.
            foreach (var action in actions)
            {
                action.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "gift"));
            }
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void UpdatePlayerInventory_WithNullEmptyWhitespaceT10Id_ReturnsCorrectType()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            string t10IdNull = null;
            var t10IdEmpty = TestConstants.Empty;
            var t10IdWhitespace = TestConstants.WhiteSpace;
            var gift = Fixture.Create<GravityGift>();


            // Act.
            var actions = new List<Func<Task<IActionResult>>>
            {
                async () => await controller.UpdatePlayerInventoryByT10Id(t10IdNull, gift).ConfigureAwait(false),
                async () => await controller.UpdatePlayerInventoryByT10Id(t10IdEmpty, gift).ConfigureAwait(false),
                async () => await controller.UpdatePlayerInventoryByT10Id(t10IdWhitespace, gift).ConfigureAwait(false)
            };

            // Assert.
            foreach (var action in actions)
            {
                action.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "t10Id"));
            }
        }

        [TestMethod]
        [TestCategory("Unit")]
        public async Task GetGameSettings_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var Id = Fixture.Create<Guid>();

            // Act.
            async Task<IActionResult> Action() => await controller.GetMasterInventoryList(Id.ToString()).ConfigureAwait(false);

            // Assert.
            Action().Should().BeAssignableTo<Task<IActionResult>>();
            Action().Should().NotBeNull();
            var result = await Action().ConfigureAwait(false) as OkObjectResult;
            var masterInventory = result.Value as GravityMasterInventory;
            masterInventory.Should().NotBeNull();
            masterInventory.Should().BeOfType<GravityMasterInventory>();
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void GetGameSettings_WithNullEmptyWhitespaceId_Throws()
        {
            // Arrange.
            var controller = new Dependencies().Build();

            // Act.
            var actions = new List<Func<Task<IActionResult>>>
            {
                async () => await controller.GetMasterInventoryList(null).ConfigureAwait(false),
                async () => await controller.GetMasterInventoryList(TestConstants.Empty).ConfigureAwait(false),
                async () => await controller.GetMasterInventoryList(TestConstants.WhiteSpace).ConfigureAwait(false)
            };

            // Assert.
            foreach (var action in actions)
            {
                action.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "gameSettingsId"));
            }
        }

        [TestMethod]
        [TestCategory("Unit")]
        public async Task GetGiftHistory_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var t10Id = Fixture.Create<string>();

            // Act.
            async Task<IActionResult> Action() => await controller.GetGiftHistoriesAsync(t10Id).ConfigureAwait(false);

            // Assert.
            Action().Should().BeAssignableTo<Task<IActionResult>>();
            Action().Should().NotBeNull();
            var result = await Action().ConfigureAwait(false) as OkObjectResult;
            var details = result.Value as IList<GravityGiftHistory>;
            details.Should().NotBeNull();
            details.Should().BeOfType<List<GravityGiftHistory>>();
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void GetGiftHistory_WithNullEmptyWhitespaceT10Id_Throws()
        {
            // Arrange.
            var controller = new Dependencies().Build();

            // Act.
            var actions = new List<Func<Task<IActionResult>>>
            {
                async () => await controller.GetGiftHistoriesAsync(null).ConfigureAwait(false),
                async () => await controller.GetGiftHistoriesAsync(TestConstants.Empty).ConfigureAwait(false),
                async () => await controller.GetGiftHistoriesAsync(TestConstants.WhiteSpace).ConfigureAwait(false)
            };

            // Assert.
            foreach (var action in actions)
            {
                action.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "t10Id"));
            }
        }

        private sealed class Dependencies
        {
            private readonly ControllerContext ControllerContext;

            public Dependencies()
            {
                var httpContext = new DefaultHttpContext();
                httpContext.Request.Path = TestConstants.TestRequestPath;

                var claims = new List<Claim> { new Claim(ClaimTypes.Email, "requesting-agent-email") };
                var claimsIdentities = new List<ClaimsIdentity> { new ClaimsIdentity(claims) };
                httpContext.User = new ClaimsPrincipal(claimsIdentities);

                this.ControllerContext = new ControllerContext { HttpContext = httpContext };


                var validMasterInventory = Fixture.Create<GravityMasterInventory>();
                validMasterInventory.CreditRewards = new List<MasterInventoryItem> { new MasterInventoryItem { Id = 1, } };
                validMasterInventory.Cars = new List<MasterInventoryItem> { new MasterInventoryItem { Id = 1, } };
                validMasterInventory.EnergyRefills = new List<MasterInventoryItem> { new MasterInventoryItem { Id = 1, } };
                validMasterInventory.MasteryKits = new List<MasterInventoryItem> { new MasterInventoryItem { Id = 1, } };
                validMasterInventory.RepairKits = new List<MasterInventoryItem> { new MasterInventoryItem { Id = 1, } };
                validMasterInventory.UpgradeKits = new List<MasterInventoryItem> { new MasterInventoryItem { Id = 1, } };

                this.GravityGameSettingsProvider.GetGameSettingsAsync(Arg.Any<Guid>()).Returns(validMasterInventory);

                this.GravityPlayerDetailsProvider.GetPlayerIdentityAsync(Arg.Any<IdentityQueryBeta>()).Returns(Fixture.Create<IdentityResultBeta>());
                this.GravityPlayerDetailsProvider.GetPlayerDetailsAsync(Arg.Any<ulong>()).Returns(Fixture.Create<GravityPlayerDetails>());
                this.GravityPlayerDetailsProvider.GetPlayerDetailsAsync(Arg.Any<string>()).Returns(Fixture.Create<GravityPlayerDetails>());
                this.GravityPlayerDetailsProvider.GetPlayerDetailsByT10IdAsync(Arg.Any<string>()).Returns(Fixture.Create<GravityPlayerDetails>());
                this.GravityPlayerDetailsProvider.EnsurePlayerExistsAsync(Arg.Any<ulong>()).Returns(true);
                this.GravityPlayerDetailsProvider.EnsurePlayerExistsByT10IdAsync(Arg.Any<string>()).Returns(true);
                this.GravityPlayerInventoryProvider.GetPlayerInventoryAsync(Arg.Any<ulong>()).Returns(Fixture.Create<GravityPlayerInventoryBeta>());
                this.GravityPlayerInventoryProvider.GetPlayerInventoryAsync(Arg.Any<ulong>(), Arg.Any<string>()).Returns(Fixture.Create<GravityPlayerInventoryBeta>());
                this.GravityPlayerInventoryProvider.GetPlayerInventoryAsync(Arg.Any<string>()).Returns(Fixture.Create<GravityPlayerInventoryBeta>());
                this.GravityPlayerInventoryProvider.GetPlayerInventoryAsync(Arg.Any<string>(), Arg.Any<string>()).Returns(Fixture.Create<GravityPlayerInventoryBeta>());
                this.GravityPlayerInventoryProvider.UpdatePlayerInventoryAsync(Arg.Any<string>(), Arg.Any<Guid>(), Arg.Any<GravityGift>(), Arg.Any<string>()).Returns(Fixture.Create<GiftResponse<string>>()); ;
                this.GiftHistoryProvider.GetGiftHistoriesAsync(Arg.Any<string>(), Arg.Any<string>(), Arg.Any<GiftIdentityAntecedent>()).Returns(Fixture.Create<IList<GravityGiftHistory>>());
            }

            public ILoggingService LoggingService { get; set; } = Substitute.For<ILoggingService>();

            public IGravityPlayerDetailsProvider GravityPlayerDetailsProvider { get; set; } = Substitute.For<IGravityPlayerDetailsProvider>();

            public IGravityPlayerInventoryProvider GravityPlayerInventoryProvider { get; set; } = Substitute.For<IGravityPlayerInventoryProvider>();

            public IGravityGiftHistoryProvider GiftHistoryProvider { get; set; } = Substitute.For<IGravityGiftHistoryProvider>();

            public IGravityGameSettingsProvider GravityGameSettingsProvider { get; set; } = Substitute.For<IGravityGameSettingsProvider>();

            public IScheduler Scheduler { get; set; } = Substitute.For<IScheduler>();

            public IJobTracker JobTracker { get; set; } = Substitute.For<IJobTracker>();

            public IRequestValidator<GravityGift> GiftRequestValidator { get; set; } = Substitute.For<IRequestValidator<GravityGift>>();

            public GravityController Build() => new GravityController(
                this.LoggingService,
                this.GravityPlayerDetailsProvider,
                this.GravityPlayerInventoryProvider,
                this.GiftHistoryProvider,
                this.GravityGameSettingsProvider,
                this.Scheduler,
                this.JobTracker,
                this.GiftRequestValidator)
            { ControllerContext = this.ControllerContext };
        }
    }
}
