using AutoFixture;
using AutoMapper;
using FluentAssertions;
using Forza.LiveOps.Steelhead_master.Generated;
using Forza.UserInventory.Steelhead_master.Generated;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using System;
using System.Collections.Generic;
using Turn10.LiveOps.StewardApi.Contracts;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead;
using Turn10.LiveOps.StewardApi.Providers.Steelhead;
using Turn10.LiveOps.StewardApi.Providers.Steelhead.ServiceConnections;
using static Forza.LiveOps.Steelhead_master.Generated.UserInventoryService;

namespace Turn10.LiveOps.StewardTest.Unit.Steelhead
{
    [TestClass]
    public sealed class SteelheadPlayerInventoryProviderTests
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
        public void Ctor_WhenSunriseUserInventoryServiceNull_Throws()
        {
            // Arrange.
            var dependencies = new Dependencies { SteelheadUserInventoryService = null };

            // Act.
            Action act = () => dependencies.Build();

            // Assert.
            act.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "steelheadUserInventoryService"));
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void Ctor_WhenSunriseGiftingServiceNull_Throws()
        {
            // Arrange.
            var dependencies = new Dependencies { SteelheadGiftingService = null };

            // Act.
            Action act = () => dependencies.Build();

            // Assert.
            act.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "steelheadGiftingService"));
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
        public void Ctor_WhenGiftHistoryProviderStoreNull_Throws()
        {
            // Arrange.
            var dependencies = new Dependencies { GiftHistoryProvider = null };

            // Act.
            Action act = () => dependencies.Build();

            // Assert.
            act.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "giftHistoryProvider"));
        }

        private sealed class Dependencies
        {
            public Dependencies()
            {
                this.SteelheadUserInventoryService.GetAdminUserInventoryAsync(Arg.Any<ulong>()).Returns(Fixture.Create<GetAdminUserInventoryOutput>());
                this.SteelheadUserInventoryService.GetAdminUserInventoryByProfileIdAsync(Arg.Any<int>()).Returns(Fixture.Create<GetAdminUserInventoryByProfileIdOutput>());
                this.SteelheadUserInventoryService.GetAdminUserProfilesAsync(Arg.Any<ulong>(), Arg.Any<uint>()).Returns(Fixture.Create<GetAdminUserProfilesOutput>());
                this.Mapper.Map<SteelheadMasterInventory>(Arg.Any<AdminForzaUserInventorySummary>()).Returns(Fixture.Create<SteelheadMasterInventory>());
                this.Mapper.Map<IList<SteelheadInventoryProfile>>(Arg.Any<AdminForzaProfile[]>()).Returns(Fixture.Create<IList<SteelheadInventoryProfile>>());
                this.Mapper.Map<IList<LspGroup>>(Arg.Any<ForzaUserGroup[]>()).Returns(Fixture.Create<IList<LspGroup>>());
                this.Mapper.Map<SteelheadGift>(Arg.Any<SteelheadGroupGift>()).Returns(Fixture.Create<SteelheadGift>());
            }

            public ISteelheadUserInventoryService SteelheadUserInventoryService { get; set; } = Substitute.For<ISteelheadUserInventoryService>();

            public ISteelheadGiftingService SteelheadGiftingService { get; set; } = Substitute.For<ISteelheadGiftingService>();

            public IMapper Mapper { get; set; } = Substitute.For<IMapper>();

            public ISteelheadGiftHistoryProvider GiftHistoryProvider { get; set; } = Substitute.For<ISteelheadGiftHistoryProvider>();

            public SteelheadPlayerInventoryProvider Build() => new SteelheadPlayerInventoryProvider(
                                                                                            this.SteelheadUserInventoryService,
                                                                                            this.SteelheadGiftingService,
                                                                                            this.Mapper,
                                                                                            this.GiftHistoryProvider);
        }
    }
}
