using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoFixture;
using AutoMapper;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Woodstock;
using Turn10.LiveOps.StewardApi.Helpers;
using Turn10.LiveOps.StewardApi.Logging;
using Turn10.LiveOps.StewardApi.Providers.Woodstock;
using Turn10.LiveOps.StewardApi.Providers.Woodstock.ServiceConnections;

namespace Turn10.LiveOps.StewardTest.Unit.Woodstock.ProviderTests
{
    [TestClass]
    public sealed class WoodstockItemsProviderTests
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
        public void Ctor_WhenWoodstockPegasusServiceIsNull_Throws()
        {
            // Arrange.
            var dependencies = new Dependencies { PegasusService = null };

            // Act.
            Action act = () => dependencies.Build();

            // Assert.
            act.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "pegasusService"));
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void Ctor_WhenLoggingServiceIsNull_Throws()
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
        public void Ctor_WhenMapperIsNull_Throws()
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
        public async Task GetMasterInventoryAsync_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var provider = new Dependencies().Build();

            // Act.
            async Task<WoodstockMasterInventory> Action() => await provider.GetMasterInventoryAsync().ConfigureAwait(false);

            // Assert.
            var result = await Action().ConfigureAwait(false);
            result.Should().BeOfType<WoodstockMasterInventory>();
        }

        [TestMethod]
        [TestCategory("Unit")]
        public async Task GetCarsAsync_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var provider = new Dependencies().Build();

            // Act.
            async Task<IEnumerable<SimpleCar>> Action() => await provider.GetCarsAsync<SimpleCar>().ConfigureAwait(false);

            // Assert.
            var result = await Action().ConfigureAwait(false);
            result.First().Should().BeOfType<SimpleCar>();
        }

        private sealed class Dependencies
        {
            public Dependencies()
            {
                this.PegasusService.GetCarsAsync().Returns(Fixture.Create<IEnumerable<WoodstockLiveOpsContent.DataCar>>());
                this.PegasusService.GetCarHornsAsync().Returns(Fixture.Create<IEnumerable<WoodstockLiveOpsContent.CarHorn>>());
                this.PegasusService.GetVanityItemsAsync().Returns(Fixture.Create<IEnumerable<WoodstockLiveOpsContent.VanityItem>>());
                this.PegasusService.GetEmotesAsync().Returns(Fixture.Create<IEnumerable<WoodstockLiveOpsContent.EmoteData>>());
                this.PegasusService.GetQuickChatLinesAsync().Returns(Fixture.Create<IEnumerable<WoodstockLiveOpsContent.QuickChat>>());

                this.Mapper.SafeMap<IEnumerable<SimpleCar>>(Arg.Any<IEnumerable<WoodstockLiveOpsContent.DataCar>>()).Returns(Fixture.Create<IEnumerable<SimpleCar>>());
                this.Mapper.SafeMap<IEnumerable<MasterInventoryItem>>(Arg.Any<IEnumerable<WoodstockLiveOpsContent.DataCar>>()).Returns(Fixture.Create<IEnumerable<MasterInventoryItem>>());
                this.Mapper.SafeMap<IEnumerable<MasterInventoryItem>>(Arg.Any<IEnumerable<WoodstockLiveOpsContent.CarHorn>>()).Returns(Fixture.Create<IEnumerable<MasterInventoryItem>>());
                this.Mapper.SafeMap<IEnumerable<MasterInventoryItem>>(Arg.Any<IEnumerable<WoodstockLiveOpsContent.VanityItem>>()).Returns(Fixture.Create<IEnumerable<MasterInventoryItem>>());
                this.Mapper.SafeMap<IEnumerable<MasterInventoryItem>>(Arg.Any<IEnumerable<WoodstockLiveOpsContent.EmoteData>>()).Returns(Fixture.Create<IEnumerable<MasterInventoryItem>>());
                this.Mapper.SafeMap<IEnumerable<MasterInventoryItem>>(Arg.Any<IEnumerable<WoodstockLiveOpsContent.QuickChat>>()).Returns(Fixture.Create<IEnumerable<MasterInventoryItem>>());
            }
            
            public IWoodstockPegasusService PegasusService { get; set; } = Substitute.For<IWoodstockPegasusService>();

            public ILoggingService LoggingService { get; set; } = Substitute.For<ILoggingService>();

            public IMapper Mapper { get; set; } = Substitute.For<IMapper>();

            public WoodstockItemsProvider Build() => new WoodstockItemsProvider(
                this.PegasusService,
                this.LoggingService,
                this.Mapper);
        }
    }
}
