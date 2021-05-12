using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoFixture;
using AutoMapper;
using FluentAssertions;
using Forza.WebServices.FMG.Generated;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using Turn10.LiveOps.StewardApi.Contracts.Gravity;
using Turn10.LiveOps.StewardApi.Providers.Gravity;
using Turn10.LiveOps.StewardApi.Providers.Gravity.ServiceConnections;
using static Forza.WebServices.FMG.Generated.UserService;

namespace Turn10.LiveOps.StewardTest.Unit.Gravity
{
    [TestClass]
    public sealed class GravityPlayerInventoryProviderTests
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
        public void GetPlayerInventoryAsync_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var profileId = Fixture.Create<string>();
            var xuid = Fixture.Create<ulong>();
            var t10Id = Fixture.Create<string>();

            // Act.
            var actions = new List<Func<Task<GravityPlayerInventory>>>
            {
                async () => await provider.GetPlayerInventoryAsync(xuid).ConfigureAwait(false),
                async () => await provider.GetPlayerInventoryAsync(xuid, profileId).ConfigureAwait(false),
                async () => await provider.GetPlayerInventoryAsync(t10Id).ConfigureAwait(false),
                async () => await provider.GetPlayerInventoryAsync(t10Id, profileId).ConfigureAwait(false)
            };

            // Assert.
            foreach (var action in actions)
            {
                action().Result.Should().BeOfType<GravityPlayerInventory>();
            }
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void GetPlayerInventoryAsync_WithNullEmptyWhitespaceT10Id_Throws()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var profileId = Fixture.Create<string>();

            // Act.
            var actions = new List<Func<Task>>
            {
                async () => await provider.GetPlayerInventoryAsync(null).ConfigureAwait(false),
                async () => await provider.GetPlayerInventoryAsync(TestConstants.Empty).ConfigureAwait(false),
                async () => await provider.GetPlayerInventoryAsync(TestConstants.WhiteSpace).ConfigureAwait(false),
                async () => await provider.GetPlayerInventoryAsync(null, profileId).ConfigureAwait(false),
                async () => await provider.GetPlayerInventoryAsync(TestConstants.Empty, profileId).ConfigureAwait(false),
                async () => await provider.GetPlayerInventoryAsync(TestConstants.WhiteSpace, profileId).ConfigureAwait(false)
            };

            // Assert.
            foreach (var action in actions)
            {
                action.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "t10Id"));
            }
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void GetPlayerInventoryAsync_WithNullEmptyWhitespaceProfileId_Throws()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var t10Id = Fixture.Create<string>();
            var xuid = Fixture.Create<ulong>();

            // Act.
            var actions = new List<Func<Task>>
            {
                async () => await provider.GetPlayerInventoryAsync(xuid, null).ConfigureAwait(false),
                async () => await provider.GetPlayerInventoryAsync(xuid, TestConstants.Empty).ConfigureAwait(false),
                async () => await provider.GetPlayerInventoryAsync(xuid, TestConstants.WhiteSpace).ConfigureAwait(false),
                async () => await provider.GetPlayerInventoryAsync(t10Id, null).ConfigureAwait(false),
                async () => await provider.GetPlayerInventoryAsync(t10Id, TestConstants.Empty).ConfigureAwait(false),
                async () => await provider.GetPlayerInventoryAsync(t10Id, TestConstants.WhiteSpace).ConfigureAwait(false)
            };

            // Assert.
            foreach (var action in actions)
            {
                action.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "profileId"));
            }
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void UpdatePlayerInventoryAsync_WithValidParameters_DoesNotThrow()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var t10Id = Fixture.Create<string>();
            var useAdminCurrencyLimit = Fixture.Create<bool>();
            var gameSettingsId = Fixture.Create<Guid>();
            var gift = Fixture.Create<GravityGift>();
            var requestingAgent = Fixture.Create<string>();

            // Act.
            var actions = new List<Func<Task>>
            {
                async () => await provider.UpdatePlayerInventoryAsync(t10Id, gameSettingsId, gift, requestingAgent, useAdminCurrencyLimit).ConfigureAwait(false)
            };

            // Assert.
            foreach (var action in actions)
            {
                action.Should().NotThrow();
            }
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void UpdatePlayerInventoryAsync_WithNullEmptyWhitespaceT10Id_Throws()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var gift = Fixture.Create<GravityGift>();
            var gameSettingsId = Fixture.Create<Guid>();
            var requestingAgent = Fixture.Create<string>();
            var useAdminCurrencyLimit = Fixture.Create<bool>();

            // Act.
            var actions = new List<Func<Task>>
            {
                async () => await provider.UpdatePlayerInventoryAsync(null, gameSettingsId, gift, requestingAgent, useAdminCurrencyLimit).ConfigureAwait(false),
                async () => await provider.UpdatePlayerInventoryAsync(TestConstants.Empty, gameSettingsId, gift, requestingAgent, useAdminCurrencyLimit).ConfigureAwait(false),
                async () => await provider.UpdatePlayerInventoryAsync(TestConstants.WhiteSpace, gameSettingsId, gift, requestingAgent, useAdminCurrencyLimit).ConfigureAwait(false)
            };
            // Assert.
            foreach (var action in actions)
            {
                action.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "t10Id"));
            }
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void UpdatePlayerInventoryAsync_WithNullEmptyWhitespaceRequestingAgent_Throws()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var gift = Fixture.Create<GravityGift>();
            var gameSettingsId = Fixture.Create<Guid>();
            var t10Id = Fixture.Create<string>();
            var useAdminCurrencyLimit = Fixture.Create<bool>();

            // Act.
            var actions = new List<Func<Task>>
            {
                async () => await provider.UpdatePlayerInventoryAsync(t10Id, gameSettingsId, gift, null, useAdminCurrencyLimit).ConfigureAwait(false),
                async () => await provider.UpdatePlayerInventoryAsync(t10Id, gameSettingsId, gift, TestConstants.Empty, useAdminCurrencyLimit).ConfigureAwait(false),
                async () => await provider.UpdatePlayerInventoryAsync(t10Id, gameSettingsId, gift, TestConstants.WhiteSpace, useAdminCurrencyLimit).ConfigureAwait(false)
            };
            // Assert.
            foreach (var action in actions)
            {
                action.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "requestingAgent"));
            }
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void UpdatePlayerInventoryAsync_WithNullPlayerInventory_Throws()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var useAdminCurrencyLimit = Fixture.Create<bool>();
            var t10Id = Fixture.Create<string>();
            var gameSettingsId = Fixture.Create<Guid>();
            var requestingAgent = Fixture.Create<string>();

            // Act.
            var actions = new List<Func<Task>>
            {
                async () => await provider.UpdatePlayerInventoryAsync(t10Id, gameSettingsId, null, requestingAgent, useAdminCurrencyLimit).ConfigureAwait(false)
            };
            // Assert.
            foreach (var action in actions)
            {
                action.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "gift"));
            }
        }

        private sealed class Dependencies
        {
            public Dependencies()
            {
                this.GravityService.LiveOpsGetUserDetailsByXuidAsync(Arg.Any<ulong>(), Arg.Any<int>()).Returns(Fixture.Create<LiveOpsGetUserDetailsByXuidOutput>());
                this.GravityService.LiveOpsGetUserDetailsByT10IdAsync(Arg.Any<string>()).Returns(Fixture.Create<LiveOpsGetUserDetailsByT10IdOutput>());
                this.GravityService.LiveOpsGetUserInventoryByT10IdAsync(Arg.Any<string>()).Returns(Fixture.Create<UserInventoryService.LiveOpsGetUserInventoryByT10IdOutput>());
                this.GravityService.LiveOpsGetInventoryByProfileIdAsync(Arg.Any<string>(), Arg.Any<string>()).Returns(Fixture.Create<UserInventoryService.LiveOpsGetInventoryByProfileIdOutput>());
                this.Mapper.Map<GravityPlayerInventory>(Arg.Any<LiveOpsUserInventory>()).Returns(Fixture.Create<GravityPlayerInventory>());
            }

            public IGravityService GravityService { get; set; } = Substitute.For<IGravityService>();
            
            public IMapper Mapper { get; set; } = Substitute.For<IMapper>();

            public IGravityGiftHistoryProvider GiftHistoryProvider { get; set; } = Substitute.For<IGravityGiftHistoryProvider>();

            public GravityPlayerInventoryProvider Build() => new GravityPlayerInventoryProvider(this.GravityService, this.Mapper, this.GiftHistoryProvider);
        }
    }
}
