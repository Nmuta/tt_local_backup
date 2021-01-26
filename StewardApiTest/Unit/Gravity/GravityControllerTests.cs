using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoFixture;
using FluentAssertions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using Turn10.LiveOps.StewardApi.Contracts;
using Turn10.LiveOps.StewardApi.Contracts.Gravity;
using Turn10.LiveOps.StewardApi.Contracts.Gravity.Settings;
using Turn10.LiveOps.StewardApi.Controllers;
using Turn10.LiveOps.StewardApi.Providers;
using Turn10.LiveOps.StewardApi.Providers.Gravity;
using Turn10.LiveOps.StewardApi.Providers.Gravity.Settings;
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
            var dependencies = new Dependencies { GravitySettingsProvider = null };

            // Act.
            Action act = () => dependencies.Build();

            // Assert.
            act.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "gravitySettingsProvider"));
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
        public async Task GetPlayerIdentities_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var query = Fixture.Create<IdentityQueryBeta>();

            // Act.
            Func<Task<IActionResult>> action = async () => await controller.GetPlayerIdentity(new List<IdentityQueryBeta> { query }).ConfigureAwait(false);

            // Assert.
            action().Should().BeAssignableTo<Task<IActionResult>>();
            action().Should().NotBeNull();
            var result = await action().ConfigureAwait(false) as OkObjectResult;
            var details = result.Value as IList<IdentityResultBeta>;
            details.Should().NotBeNull();
            details.Should().BeOfType<List<IdentityResultBeta>>();
        }

        [TestMethod]
        [TestCategory("Unit")]
        public async Task GetPlayerIdentites_WithInvalidInputs_DoesNotThrow()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var query = new IdentityQueryBeta { Xuid = default, Gamertag = null, T10Id = null};

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
        public async Task GetPlayerDetailsByT10Id_WithNullEmptyWhiteSpaceT10Id_Throws()
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
                action().Should().BeAssignableTo<Task<IActionResult>>();
                var result = await action().ConfigureAwait(false) as BadRequestObjectResult;
                result.StatusCode.Should().Be(400);
                (result.Value as ArgumentNullException).Message.Should().Be(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "t10Id"));
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
                var details = result.Value as GravityPlayerInventory;
                details.Should().NotBeNull();
                details.Should().BeOfType<GravityPlayerInventory>();
            }
        }

        [TestMethod]
        [TestCategory("Unit")]
        public async Task GetPlayerInventory_WithNullEmptyWhitespaceT10Id_Throws()
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
                action().Should().BeAssignableTo<Task<IActionResult>>();
                var result = await action().ConfigureAwait(false) as BadRequestObjectResult;
                result.StatusCode.Should().Be(400);
                (result.Value as ArgumentNullException).Message.Should().Be(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "t10Id"));
            }
        }

        [TestMethod]
        [TestCategory("Unit")]
        public async Task GetPlayerInventory_WithNullEmptyWhitespaceProfileId_Throws()
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
                action().Should().BeAssignableTo<Task<IActionResult>>();
                var result = await action().ConfigureAwait(false) as BadRequestObjectResult;
                result.StatusCode.Should().Be(400);
                (result.Value as ArgumentNullException).Message.Should().Be(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "profileId"));
            }
        }

        [TestMethod]
        [TestCategory("Unit")]
        public async Task UpdatePlayerInventory_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var playerInventory = Fixture.Create<GravityPlayerInventory>();
            var requestingAgent = Fixture.Create<string>();

            // Act.
            var actions = new List<Func<Task<IActionResult>>>
            {
                async () => await controller.UpdatePlayerInventoryByXuid(playerInventory, requestingAgent).ConfigureAwait(false),
                async () => await controller.UpdatePlayerInventoryByT10Id(playerInventory, requestingAgent).ConfigureAwait(false)
            };

            // Assert.
            foreach (var action in actions)
            {
                action().Should().BeAssignableTo<Task<IActionResult>>();
                action().Should().NotBeNull();
                var result = await action().ConfigureAwait(false) as CreatedResult;
                var details = result.Value as GravityPlayerInventory;
                details.Should().NotBeNull();
                details.Should().BeOfType<GravityPlayerInventory>();
                result.Location.Should().Be(TestConstants.TestRequestPath);
            }
        }

        [TestMethod]
        [TestCategory("Unit")]
        public async Task UpdatePlayerInventory_WithNullPlayerInventory_Throws()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var requestingAgent = Fixture.Create<string>();

            // Act.
            var actions = new List<Func<Task<IActionResult>>>
            {
                async () => await controller.UpdatePlayerInventoryByXuid(null, requestingAgent).ConfigureAwait(false),
                async () => await controller.UpdatePlayerInventoryByT10Id(null, requestingAgent).ConfigureAwait(false)
            };

            // Assert.
            foreach (var action in actions)
            {
                action().Should().BeAssignableTo<Task<IActionResult>>();
                action().Should().NotBeNull();
                var result = await action().ConfigureAwait(false) as BadRequestObjectResult;
                result.StatusCode.Should().Be(400);
                (result.Value as ArgumentNullException).Message.Should().Be(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "playerInventory"));
            }
        }

        [TestMethod]
        [TestCategory("Unit")]
        public async Task UpdatePlayerInventory_WithNullEmptyWhitespaceRequestingAgent_Throws()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var playerInventory = Fixture.Create<GravityPlayerInventory>();

            // Act.
            var actions = new List<Func<Task<IActionResult>>>
            {
                async () => await controller.UpdatePlayerInventoryByXuid(playerInventory, null).ConfigureAwait(false),
                async () => await controller.UpdatePlayerInventoryByXuid(playerInventory, TestConstants.Empty).ConfigureAwait(false),
                async () => await controller.UpdatePlayerInventoryByXuid(playerInventory, TestConstants.WhiteSpace).ConfigureAwait(false),
                async () => await controller.UpdatePlayerInventoryByT10Id(playerInventory, null).ConfigureAwait(false),
                async () => await controller.UpdatePlayerInventoryByT10Id(playerInventory, TestConstants.Empty).ConfigureAwait(false),
                async () => await controller.UpdatePlayerInventoryByT10Id(playerInventory, TestConstants.WhiteSpace).ConfigureAwait(false)
            };

            // Assert.
            foreach (var action in actions)
            {
                action().Should().BeAssignableTo<Task<IActionResult>>();
                action().Should().NotBeNull();
                var result = await action().ConfigureAwait(false) as BadRequestObjectResult;
                result.StatusCode.Should().Be(400);
                (result.Value as ArgumentNullException).Message.Should().Be(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "requestingAgent"));
            }
        }

        [TestMethod]
        [TestCategory("Unit")]
        public async Task UpdatePlayerInventory_WithNullEmptyWhitespaceT10Id_ReturnsCorrectType()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var playerInventoryNull = Fixture.Create<GravityPlayerInventory>();
            playerInventoryNull.T10Id = null;
            var playerInventoryEmpty = Fixture.Create<GravityPlayerInventory>();
            playerInventoryEmpty.T10Id = TestConstants.Empty;
            var playerInventoryWhitespace = Fixture.Create<GravityPlayerInventory>();
            playerInventoryWhitespace.T10Id = TestConstants.WhiteSpace;
            var requestingAgent = Fixture.Create<string>();

            // Act.
            var actions = new List<Func<Task<IActionResult>>>
            {
                async () => await controller.UpdatePlayerInventoryByT10Id(playerInventoryNull, requestingAgent).ConfigureAwait(false),
                async () => await controller.UpdatePlayerInventoryByT10Id(playerInventoryEmpty, requestingAgent).ConfigureAwait(false),
                async () => await controller.UpdatePlayerInventoryByT10Id(playerInventoryWhitespace, requestingAgent).ConfigureAwait(false)
            };

            // Assert.
            foreach (var action in actions)
            {
                action().Should().BeAssignableTo<Task<IActionResult>>();
                action().Should().NotBeNull();
                var result = await action().ConfigureAwait(false) as BadRequestObjectResult;
                result.StatusCode.Should().Be(400);
                (result.Value as ArgumentNullException).Message.Should().Be(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "T10Id"));
            }
        }

        [TestMethod]
        [TestCategory("Unit")]
        public async Task GetGameSettings_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var Id = Fixture.Create<string>();

            // Act.
            Func<Task<IActionResult>> action = async () => await controller.GetGameSettings(Id).ConfigureAwait(false);

            // Assert.
            action().Should().BeAssignableTo<Task<IActionResult>>();
            action().Should().NotBeNull();
            var result = await action().ConfigureAwait(false) as OkObjectResult;
            var details = result.Value as GameSettings;
            details.Should().NotBeNull();
            details.Should().BeOfType<GameSettings>();
        }

        [TestMethod]
        [TestCategory("Unit")]
        public async Task GetGameSettings_WithNullEmptyWhitespaceId_ReturnsCorrectType()
        {
            // Arrange.
            var controller = new Dependencies().Build();

            // Act.
            var actions = new List<Func<Task<IActionResult>>>
            {
                async () => await controller.GetGameSettings(null).ConfigureAwait(false),
                async () => await controller.GetGameSettings(TestConstants.Empty).ConfigureAwait(false),
                async () => await controller.GetGameSettings(TestConstants.WhiteSpace).ConfigureAwait(false)
            };

            // Assert.
            foreach (var action in actions)
            {
                action().Should().BeAssignableTo<Task<IActionResult>>();
                action().Should().NotBeNull();
                var result = await action().ConfigureAwait(false) as BadRequestObjectResult;
                result.StatusCode.Should().Be(400);
                (result.Value as ArgumentNullException).Message.Should().Be(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "gameSettingsId"));
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
            Func<Task<IActionResult>> action = async () => await controller.GetGiftHistoriesAsync(t10Id).ConfigureAwait(false);

            // Assert.
            action().Should().BeAssignableTo<Task<IActionResult>>();
            action().Should().NotBeNull();
            var result = await action().ConfigureAwait(false) as OkObjectResult;
            var details = result.Value as IList<GravityGiftHistory>;
            details.Should().NotBeNull();
            details.Should().BeOfType<List<GravityGiftHistory>>();
        }

        [TestMethod]
        [TestCategory("Unit")]
        public async Task GetGiftHistory_WithNullEmptyWhitespaceT10Id_Throws()
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
                action().Should().BeAssignableTo<Task<IActionResult>>();
                var result = await action().ConfigureAwait(false) as BadRequestObjectResult;
                result.StatusCode.Should().Be(400);
                (result.Value as ArgumentNullException).Message.Should().Be(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "t10Id"));
            }
        }

        private sealed class Dependencies
        {
            private readonly ControllerContext ControllerContext;

            public Dependencies()
            {
                var httpContext = new DefaultHttpContext();
                httpContext.Request.Path = TestConstants.TestRequestPath;
                this.ControllerContext = new ControllerContext { HttpContext = httpContext };

                this.GravityPlayerDetailsProvider.GetPlayerIdentityAsync(Arg.Any<IdentityQueryBeta>()).Returns(Fixture.Create<IdentityResultBeta>());
                this.GravityPlayerDetailsProvider.GetPlayerDetailsAsync(Arg.Any<ulong>()).Returns(Fixture.Create<GravityPlayerDetails>());
                this.GravityPlayerDetailsProvider.GetPlayerDetailsAsync(Arg.Any<string>()).Returns(Fixture.Create<GravityPlayerDetails>());
                this.GravityPlayerDetailsProvider.GetPlayerDetailsByT10IdAsync(Arg.Any<string>()).Returns(Fixture.Create<GravityPlayerDetails>());
                this.GravityPlayerDetailsProvider.EnsurePlayerExistsAsync(Arg.Any<ulong>()).Returns(true);
                this.GravityPlayerDetailsProvider.EnsurePlayerExistsByT10IdAsync(Arg.Any<string>()).Returns(true);
                this.GravityPlayerInventoryProvider.GetPlayerInventoryAsync(Arg.Any<ulong>()).Returns(Fixture.Create<GravityPlayerInventory>());
                this.GravityPlayerInventoryProvider.GetPlayerInventoryAsync(Arg.Any<ulong>(), Arg.Any<string>()).Returns(Fixture.Create<GravityPlayerInventory>());
                this.GravityPlayerInventoryProvider.GetPlayerInventoryAsync(Arg.Any<string>()).Returns(Fixture.Create<GravityPlayerInventory>());
                this.GravityPlayerInventoryProvider.GetPlayerInventoryAsync(Arg.Any<string>(), Arg.Any<string>()).Returns(Fixture.Create<GravityPlayerInventory>());
                this.GravitySettingsProvider.GetGameSettingAsync(Arg.Any<Guid>()).Returns(Fixture.Create<GameSettings>());
                this.GiftHistoryProvider.GetGiftHistoriesAsync(Arg.Any<string>(), Arg.Any<string>(), Arg.Any<GiftHistoryAntecedent>()).Returns(Fixture.Create<IList<GravityGiftHistory>>());
            }

            public IGravityPlayerDetailsProvider GravityPlayerDetailsProvider { get; set; } = Substitute.For<IGravityPlayerDetailsProvider>();

            public IGravityPlayerInventoryProvider GravityPlayerInventoryProvider { get; set; } = Substitute.For<IGravityPlayerInventoryProvider>();

            public IGravityGiftHistoryProvider GiftHistoryProvider { get; set; } = Substitute.For<IGravityGiftHistoryProvider>();

            public ISettingsProvider GravitySettingsProvider { get; set; } = Substitute.For<ISettingsProvider>();

            public IScheduler Scheduler { get; set; } = Substitute.For<IScheduler>();

            public IJobTracker JobTracker { get; set; } = Substitute.For<IJobTracker>();

            public IRequestValidator<GravityPlayerInventory> PlayerInventoryRequestValidator { get; set; } = Substitute.For<IRequestValidator<GravityPlayerInventory>>();

            public GravityController Build() => new GravityController(
                                                                      this.GravityPlayerDetailsProvider,
                                                                      this.GravityPlayerInventoryProvider,
                                                                      this.GiftHistoryProvider,
                                                                      this.GravitySettingsProvider,
                                                                      this.Scheduler,
                                                                      this.JobTracker,
                                                                      this.PlayerInventoryRequestValidator)
            { ControllerContext = this.ControllerContext };
        }
    }
}
