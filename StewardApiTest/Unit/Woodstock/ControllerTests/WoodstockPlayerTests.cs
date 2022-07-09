using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoFixture;
using AutoMapper;
using FluentAssertions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using NSubstitute.ExceptionExtensions;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Controllers;
using Turn10.LiveOps.StewardApi.Controllers.v2.Woodstock;
using Turn10.LiveOps.StewardApi.Controllers.v2.Woodstock.Ugc;
using Turn10.LiveOps.StewardApi.ProfileMappers;
using Turn10.LiveOps.StewardApi.Providers.Woodstock;
using Turn10.Services.LiveOps.FH5_main.Generated;

namespace Turn10.LiveOps.StewardTest.Unit.Woodstock.ControllerTests
{
    [TestClass]
    public sealed class WoodstockPlayerTests
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
        public void Ctor_WhenPlayerDetailsProviderNull_Throws()
        {
            // Arrange.
            var dependencies = new Dependencies { playerDetailsProvider = null };

            // Act.
            Action act = () => dependencies.Build();

            // Assert.
            act.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "playerDetailsProvider"));
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void Ctor_WhenMapperNull_Throws()
        {
            // Arrange.
            var dependencies = new Dependencies { mapper = null };

            // Act.
            Action act = () => dependencies.Build();

            // Assert.
            act.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "mapper"));
        }

        [TestMethod]
        [TestCategory("Unit")]
        public async Task GetUserReportWeight_ShouldReturnValidValue()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var xuid = Fixture.Create<ulong>();

            // Act.
            async Task<IActionResult> action() => await controller.GetUserReportWeight(xuid).ConfigureAwait(false);

            // Assert.
            action().Should().BeAssignableTo<Task<IActionResult>>();
            action().Should().NotBeNull();
            var result = await action().ConfigureAwait(false) as OkObjectResult;
            result.Value.ShouldNotBeNull();
        }

        [TestMethod]
        [TestCategory("Unit")]
        public async Task SetUserReportWeight_ShouldNotThrow()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var xuid = Fixture.Create<ulong>();
            var reportWeight = 4;

            // Act.
            Func<Task> action = async () => await controller.SetUserReportWeight(xuid, reportWeight).ConfigureAwait(false);

            // Assert.
            action.Should().NotThrow();
        }

        [TestMethod]
        [TestCategory("Unit")]
        public async Task GetHasPlayedRecord_ShouldReturnValidValue()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var xuid = Fixture.Create<ulong>();
            var profileId = Fixture.Create<Guid>();

            // Act.
            async Task<IActionResult> action() => await controller.GetHasPlayedRecord(xuid, profileId.ToString()).ConfigureAwait(false);

            // Assert.
            action().Should().BeAssignableTo<Task<IActionResult>>();
            action().Should().NotBeNull();
            var result = await action().ConfigureAwait(false) as OkObjectResult;
            result.Value.ShouldNotBeNull();
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void GetHasPlayedRecord_WithNullProfileId_ShouldThrow()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var xuid = Fixture.Create<ulong>();

            // Act.
            Func<Task<IActionResult>> action = async () => await controller.GetHasPlayedRecord(xuid, null).ConfigureAwait(false);

            // Assert.
            action.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "externalProfileId"));
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void GetHasPlayedRecord_WithNonGuidProfileId_ShouldThrow()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var xuid = Fixture.Create<ulong>();
            var profileId = "abcde";

            // Act.
            Func<Task<IActionResult>> action = async () => await controller.GetHasPlayedRecord(xuid, profileId).ConfigureAwait(false);

            // Assert.
            action.Should().Throw<InvalidArgumentsStewardException>().WithMessage($"External Profile ID provided is not a valid Guid: {profileId}");
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void ResendLoyaltyRewards_DoesNotThrow()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var xuid = Fixture.Create<ulong>();
            var profileId = Fixture.Create<Guid>();
            var titles = new string[] { "FM5" };

            // Act.
            Func<Task<IActionResult>> action = async () => await controller.ResendLoyaltyRewards(xuid, profileId.ToString(), titles).ConfigureAwait(false);

            // Assert.
            action.Should().NotThrow();
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void ResendLoyaltyRewards_WithNullProfileId_ShouldThrow()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var xuid = Fixture.Create<ulong>();
            var profileId = Fixture.Create<Guid>();
            var titles = new string[] { "FM5" };

            // Act.
            Func<Task<IActionResult>> action = async () => await controller.ResendLoyaltyRewards(xuid, null, titles).ConfigureAwait(false);

            // Assert.
            action.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "externalProfileId"));
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void ResendLoyaltyRewards_WithNonGuidProfileId_ShouldThrow()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var xuid = Fixture.Create<ulong>();
            var profileId = "abcde";
            var titles = new string[] { "FM5" };

            // Act.
            Func<Task<IActionResult>> action = async () => await controller.ResendLoyaltyRewards(xuid, profileId, titles).ConfigureAwait(false);

            // Assert.
            action.Should().Throw<InvalidArgumentsStewardException>().WithMessage($"External Profile ID provided is not a valid Guid: {profileId}");
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void ResendLoyaltyRewards_WithNullTitles_ShouldThrow()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var xuid = Fixture.Create<ulong>();
            var profileId = Fixture.Create<Guid>();

            // Act.
            Func<Task<IActionResult>> action = async () => await controller.ResendLoyaltyRewards(xuid, profileId.ToString(), null).ConfigureAwait(false);

            // Assert.
            action.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "gameTitles"));
        }

        private sealed class Dependencies
        {
            private readonly ControllerContext ControllerContext;

            public Dependencies()
            {
                var httpContext = new DefaultHttpContext();
                httpContext.Request.Path = TestConstants.TestRequestPath;
                httpContext.Request.Host = new HostString(TestConstants.TestRequestHost);
                httpContext.Request.Scheme = TestConstants.TestRequestScheme;

                var claims = new List<Claim> { new Claim("http://schemas.microsoft.com/identity/claims/objectidentifier", "unit-test-azure-object-id") };
                var claimsIdentities = new List<ClaimsIdentity> { new ClaimsIdentity(claims) };
                httpContext.User = new ClaimsPrincipal(claimsIdentities);

                this.ControllerContext = new ControllerContext { HttpContext = httpContext };

                this.playerDetailsProvider.GetUserReportWeightAsync(Arg.Any<ulong>(), Arg.Any<string>()).Returns(Fixture.Create<int>());
                this.playerDetailsProvider.SetUserReportWeightAsync(Arg.Any<ulong>(), Arg.Any<int>(), Arg.Any<string>()).Returns(Fixture.Create<Task>());
                this.playerDetailsProvider.GetHasPlayedRecordAsync(Arg.Any<ulong>(), Arg.Any<Guid>(), Arg.Any<string>()).Returns(Fixture.Create<IList<HasPlayedRecord>>());
            }
            public IWoodstockPlayerDetailsProvider playerDetailsProvider { get; set; } = Substitute.For<IWoodstockPlayerDetailsProvider>();

            public IMapper mapper { get; set; } = Substitute.ForPartsOf<Mapper>(new MapperConfiguration(mc =>
            {
                mc.AddProfile(new WoodstockProfileMapper());
                mc.AllowNullCollections = true;
            }));

            public WoodstockPlayer Build() => new WoodstockPlayer(
                this.playerDetailsProvider,
                this.mapper)
            { ControllerContext = this.ControllerContext };
        }
    }
}
