using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoFixture;
using AutoMapper;
using FluentAssertions;
using Forza.WebServices.FMG.Generated;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Gravity;
using Turn10.LiveOps.StewardApi.Providers.Gravity;
using Turn10.LiveOps.StewardApi.Providers.Gravity.ServiceConnections;
using static Forza.WebServices.FMG.Generated.UserService;

namespace Turn10.LiveOps.StewardTest.Unit.Gravity
{
    [TestClass]
    public sealed class GravityPlayerDetailsProviderTests
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
        public void Ctor_WhenGravityServiceNull_Throws()
        {
            // Arrange.
            var dependencies = new Dependencies { GravityService = null };

            // Act.
            Action act = () => dependencies.Build();

            // Assert.
            act.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "gravityService"));
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void Ctor_WhenMapperNull_Throws()
        {
            // Arrange.
            var dependencies = new Dependencies { Mapper = null };

            // Act.
            Action act = () => dependencies.Build();

            // Assert.
            act.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "mapper"));
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void GetPlayerIdentitiesAsync_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var query = Fixture.Create<IdentityQueryBeta>();

            // Act.
            Func<Task<IdentityResultBeta>> action = async () => await provider.GetPlayerIdentityAsync(query).ConfigureAwait(false);

            // Assert.
            action().Result.Should().BeOfType<IdentityResultBeta>();
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void GetPlayerIdentitiesAsync_WithNullQuery_Throws()
        {
            // Arrange.
            var provider = new Dependencies().Build();

            // Act.
            Func<Task<IdentityResultBeta>> action = async () => await provider.GetPlayerIdentityAsync(null).ConfigureAwait(false);

            // Assert.
            action.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "query"));
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void GetPlayerDetailsAsync_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var gamertag = Fixture.Create<string>();
            var xuid = Fixture.Create<ulong>();
            var t10Id = Fixture.Create<string>();

            // Act.
            var actions = new List<Func<Task<GravityPlayerDetails>>>
            {
                async () => await provider.GetPlayerDetailsAsync(xuid).ConfigureAwait(false),
                async () => await provider.GetPlayerDetailsAsync(gamertag).ConfigureAwait(false),
                async () => await provider.GetPlayerDetailsByT10IdAsync(t10Id).ConfigureAwait(false)
            };

            // Assert.
            foreach (var action in actions)
            {
                action().Result.Should().BeOfType<GravityPlayerDetails>();
            }
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void GetPlayerDetailsAsync_WithNullEmptyWhitespaceGamertag_Throws()
        {
            // Arrange.
            var provider = new Dependencies().Build();

            // Act.
            var actions = new List<Func<Task>>
            {
                async () => await provider.GetPlayerDetailsAsync(null).ConfigureAwait(false),
                async () => await provider.GetPlayerDetailsAsync(TestConstants.Empty).ConfigureAwait(false),
                async () => await provider.GetPlayerDetailsAsync(TestConstants.WhiteSpace).ConfigureAwait(false)
            };

            // Assert.
            foreach (var action in actions)
            {
                action.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "gamertag"));
            }
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void GetPlayerDetailsAsync_WithNullEmptyWhitespaceT10Id_Throws()
        {
            // Arrange.
            var provider = new Dependencies().Build();

            // Act.
            var actions = new List<Func<Task>>
            {
                async () => await provider.GetPlayerDetailsByT10IdAsync(null).ConfigureAwait(false),
                async () => await provider.GetPlayerDetailsByT10IdAsync(TestConstants.Empty).ConfigureAwait(false),
                async () => await provider.GetPlayerDetailsByT10IdAsync(TestConstants.WhiteSpace).ConfigureAwait(false)
            };

            // Assert.
            foreach (var action in actions)
            {
                action.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "t10Id"));
            }
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void EnsurePlayerExistsAsync_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var gamertag = Fixture.Create<string>();
            var xuid = Fixture.Create<ulong>();
            var t10Id = Fixture.Create<string>();

            // Act.
            var actions = new List<Func<Task<bool>>>
            {
                async () => await provider.EnsurePlayerExistsAsync(xuid).ConfigureAwait(false),
                async () => await provider.EnsurePlayerExistsAsync(gamertag).ConfigureAwait(false),
                async () => await provider.EnsurePlayerExistsByT10IdAsync(t10Id).ConfigureAwait(false)
            };

            // Assert.
            foreach (var action in actions)
            {
                action().Result.Should().BeTrue();
            }
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void EnsurePlayerExistsAsync_WithNullEmptyWhitespaceGamertag_Throws()
        {
            // Arrange.
            var provider = new Dependencies().Build();

            // Act.
            var actions = new List<Func<Task>>
            {
                async () => await provider.EnsurePlayerExistsAsync(null).ConfigureAwait(false),
                async () => await provider.EnsurePlayerExistsAsync(TestConstants.Empty).ConfigureAwait(false),
                async () => await provider.EnsurePlayerExistsAsync(TestConstants.WhiteSpace).ConfigureAwait(false)
            };

            // Assert.
            foreach (var action in actions)
            {
                action.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "gamertag"));
            }
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void EnsurePlayerExistsAsync_WithNullEmptyWhitespaceT10Id_Throws()
        {
            // Arrange.
            var provider = new Dependencies().Build();

            // Act.
            var actions = new List<Func<Task>>
            {
                async () => await provider.EnsurePlayerExistsByT10IdAsync(null).ConfigureAwait(false),
                async () => await provider.EnsurePlayerExistsByT10IdAsync(TestConstants.Empty).ConfigureAwait(false),
                async () => await provider.EnsurePlayerExistsByT10IdAsync(TestConstants.WhiteSpace).ConfigureAwait(false)
            };

            // Assert.
            foreach (var action in actions)
            {
                action.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "t10Id"));
            }
        }

        private sealed class Dependencies
        {
            public Dependencies()
            {
                this.GravityService.LiveOpsGetUserDetailsByXuidAsync(Arg.Any<ulong>(), Arg.Any<int>()).Returns(Fixture.Create<LiveOpsGetUserDetailsByXuidOutput>());
                this.GravityService.LiveOpsGetUserDetailsByGamerTagAsync(Arg.Any<string>(), Arg.Any<int>()).Returns(Fixture.Create<LiveOpsGetUserDetailsByGamerTagOutput>());
                this.GravityService.LiveOpsGetUserDetailsByT10IdAsync(Arg.Any<string>()).Returns(Fixture.Create<LiveOpsGetUserDetailsByT10IdOutput>());
                this.Mapper.Map<GravityPlayerDetails>(Arg.Any<LiveOpsUserDetails>()).Returns(Fixture.Create<GravityPlayerDetails>());
                this.Mapper.Map<IdentityResultBeta>(Arg.Any<LiveOpsUserDetails>()).Returns(Fixture.Create<IdentityResultBeta>());
            }

            public IGravityService GravityService { get; set; } = Substitute.For<IGravityService>();

            public IMapper Mapper { get; set; } = Substitute.For<IMapper>();

            public GravityPlayerDetailsProvider Build() => new GravityPlayerDetailsProvider(this.GravityService, this.Mapper);
        }
    }
}
