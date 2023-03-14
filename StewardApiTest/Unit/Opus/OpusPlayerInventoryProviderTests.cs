using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoFixture;
using AutoMapper;
using FluentAssertions;
using Forza.WebServices.FH3.Generated;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using Turn10.LiveOps.StewardApi.Contracts.Opus;
using Turn10.LiveOps.StewardApi.Helpers;
using Turn10.LiveOps.StewardApi.Providers.Opus;
using Turn10.LiveOps.StewardApi.Providers.Opus.ServiceConnections;
using static Forza.WebServices.FH3.Generated.OnlineProfileService;

namespace Turn10.LiveOps.StewardTest.Unit.Opus
{
    [TestClass]
    public sealed class OpusPlayerInventoryProviderTests
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
        public async Task GetPlayerInventoryAsync_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var xuid = Fixture.Create<ulong>();
            var profileId = Fixture.Create<int>();

            // Act.
            var actions = new List<Func<Task<OpusPlayerInventory>>>
            {
                async () => await provider.GetPlayerInventoryAsync(xuid).ConfigureAwait(false),
                async () => await provider.GetPlayerInventoryAsync(profileId).ConfigureAwait(false)
            };

            // Assert.
            foreach (var action in actions)
            {
                var result = await action().ConfigureAwait(false);
                result.Should().BeOfType<OpusPlayerInventory>();
            }
        }

        [TestMethod]
        [TestCategory("Unit")]
        public async Task GetInventoryProfilesAsync_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var xuid = Fixture.Create<ulong>();

            // Act.
            async Task<IList<OpusInventoryProfile>> Action() => await provider.GetInventoryProfilesAsync(xuid).ConfigureAwait(false);

            // Assert.
            var result = await Action().ConfigureAwait(false);
            result.Should().BeOfType<List<OpusInventoryProfile>>();
        }

        private sealed class Dependencies
        {
            public Dependencies()
            {
                this.OpusService.GetAdminUserInventoryAsync(Arg.Any<ulong>()).Returns(Fixture.Create<GetAdminUserInventoryOutput>());
                this.OpusService.GetAdminUserInventoryByProfileIdAsync(Arg.Any<int>()).Returns(Fixture.Create<GetAdminUserInventoryByProfileIdOutput>());
                this.OpusService.GetAdminUserProfilesAsync(Arg.Any<ulong>(), Arg.Any<uint>()).Returns(Fixture.Create<GetAdminUserProfilesOutput>());
                this.Mapper.SafeMap<OpusPlayerInventory>(Arg.Any<AdminForzaUserInventorySummary>()).Returns(Fixture.Create<OpusPlayerInventory>());
                this.Mapper.SafeMap<IList<OpusInventoryProfile>>(Arg.Any<AdminForzaProfile[]>()).Returns(Fixture.Create<IList<OpusInventoryProfile>>());
            }

            public IOpusService OpusService { get; set; } = Substitute.For<IOpusService>();

            public IMapper Mapper { get; set; } = Substitute.For<IMapper>();

            public OpusPlayerInventoryProvider Build() => new OpusPlayerInventoryProvider(this.OpusService, this.Mapper);
        }
    }
}
