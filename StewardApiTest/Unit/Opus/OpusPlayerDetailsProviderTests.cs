using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoFixture;
using AutoMapper;
using FluentAssertions;
using Forza.WebServices.FH3.Generated;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using Turn10.LiveOps.StewardApi.Contracts;
using Turn10.LiveOps.StewardApi.Contracts.Opus;
using Turn10.LiveOps.StewardApi.Providers.Opus;
using static Forza.WebServices.FH3.Generated.UserService;

namespace Turn10.LiveOps.StewardTest.Unit.Opus
{
    [TestClass]
    public sealed class OpusPlayerDetailsProviderTests
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
        public void Ctor_WhenOpusUserServiceNull_Throws()
        {
            // Arrange.
            var dependencies = new Dependencies { OpusUserService = null };

            // Act.
            Action act = () => dependencies.Build();

            // Assert.
            act.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "opusUserService"));
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
            var query = Fixture.Create<IdentityQueryAlpha>();

            // Act.
            Func<Task<IdentityResultAlpha>> action = async () => await provider.GetPlayerIdentityAsync(query).ConfigureAwait(false);

            // Assert.
            action().Result.Should().BeOfType<IdentityResultAlpha>();
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void GetPlayerIdentitiesAsync_WithNullQuery_Throws()
        {
            // Arrange.
            var provider = new Dependencies().Build();

            // Act.
            Func<Task<IdentityResultAlpha>> action = async () => await provider.GetPlayerIdentityAsync(null).ConfigureAwait(false);

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

            // Act.
            var actions = new List<Func<Task<OpusPlayerDetails>>>
            {
                async () => await provider.GetPlayerDetailsAsync(xuid).ConfigureAwait(false),
                async () => await provider.GetPlayerDetailsAsync(gamertag).ConfigureAwait(false)
            };

            // Assert.
            foreach (var action in actions)
            {
                action().Result.Should().BeOfType<OpusPlayerDetails>();
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
        public void EnsurePlayerExistsAsync_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var xuid = Fixture.Create<ulong>();

            // Act.
            Func<Task<bool>> act = async () => await provider.EnsurePlayerExistsAsync(xuid).ConfigureAwait(false);

            // Assert.
            act().Result.Should().BeTrue();
        }

        private sealed class Dependencies
        {
            public Dependencies()
            {
                this.OpusUserService.GetUserMasterDataByGamerTagAsync(Arg.Any<string>()).Returns(Fixture.Create<GetUserMasterDataByGamerTagOutput>());
                this.OpusUserService.GetUserMasterDataByXuidAsync(Arg.Any<ulong>()).Returns(Fixture.Create<GetUserMasterDataByXuidOutput>());
                this.Mapper.Map<OpusPlayerDetails>(Arg.Any<UserMaster>()).Returns(Fixture.Create<OpusPlayerDetails>());
                this.Mapper.Map<IdentityResultAlpha>(Arg.Any<OpusPlayerDetails>()).Returns(Fixture.Create<IdentityResultAlpha>());
            }

            public IOpusUserService OpusUserService { get; set; } = Substitute.For<IOpusUserService>();

            public IMapper Mapper { get; set; } = Substitute.For<IMapper>();

            public OpusPlayerDetailsProvider Build() => new OpusPlayerDetailsProvider(this.OpusUserService, this.Mapper);
        }
    }
}
