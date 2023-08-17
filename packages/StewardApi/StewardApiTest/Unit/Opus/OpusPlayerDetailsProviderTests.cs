using AutoFixture;
using AutoMapper;
using FluentAssertions;
using Forza.WebServices.FH3.Generated;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Opus;
using Turn10.LiveOps.StewardApi.Helpers;
using Turn10.LiveOps.StewardApi.Providers.Opus;
using Turn10.LiveOps.StewardApi.Providers.Opus.ServiceConnections;
using static Forza.WebServices.FH3.Generated.UserService;

namespace Turn10.LiveOps.StewardTest.Unit.Opus
{
    [TestClass]
    public sealed class OpusPlayerDetailsProviderTests
    {
        private static readonly Fixture Fixture = new Fixture();

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
        public void Ctor_WhenOpusServiceNull_Throws()
        {
            // Arrange.
            var dependencies = new Dependencies { OpusService = null };

            // Act.
            Action act = () => dependencies.Build();

            // Assert.
            act.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "opusService"));
        }

        [TestMethod]
        [UnitTest]
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
        [UnitTest]
        public async Task GetPlayerIdentitiesAsync_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var query = Fixture.Create<IdentityQueryAlpha>();

            // Act.
            async Task<IdentityResultAlpha> Action() => await provider.GetPlayerIdentityAsync(query).ConfigureAwait(false);

            // Assert.
            var result = await Action().ConfigureAwait(false);
            result.Should().BeOfType<IdentityResultAlpha>();
        }

        [TestMethod]
        [UnitTest]
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
        [UnitTest]
        public async Task GetPlayerDetailsAsync_WithValidParameters_ReturnsCorrectType()
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
                var result = await action().ConfigureAwait(false);
                result.Should().BeOfType<OpusPlayerDetails>();
            }
        }

        [TestMethod]
        [UnitTest]
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
        [UnitTest]
        public async Task DoesPlayerExistAsync_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var xuid = Fixture.Create<ulong>();

            // Act.
            async Task<bool> Action() => await provider.DoesPlayerExistAsync(xuid).ConfigureAwait(false);

            // Assert.
            var result = await Action().ConfigureAwait(false);
            result.Should().BeTrue();
        }

        private sealed class Dependencies
        {
            public Dependencies()
            {
                this.OpusService.GetUserMasterDataByGamerTagAsync(Arg.Any<string>()).Returns(Fixture.Create<GetUserMasterDataByGamerTagOutput>());
                this.OpusService.GetUserMasterDataByXuidAsync(Arg.Any<ulong>()).Returns(Fixture.Create<GetUserMasterDataByXuidOutput>());
                this.Mapper.SafeMap<OpusPlayerDetails>(Arg.Any<UserMaster>()).Returns(Fixture.Create<OpusPlayerDetails>());
                this.Mapper.SafeMap<IdentityResultAlpha>(Arg.Any<OpusPlayerDetails>()).Returns(Fixture.Create<IdentityResultAlpha>());
            }

            public IOpusService OpusService { get; set; } = Substitute.For<IOpusService>();

            public IMapper Mapper { get; set; } = Substitute.For<IMapper>();

            public OpusPlayerDetailsProvider Build() => new OpusPlayerDetailsProvider(this.OpusService, this.Mapper);
        }
    }
}
