﻿using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoFixture;
using AutoMapper;
using FluentAssertions;
using Forza.WebServices.FMG.Generated;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Contracts.Gravity;
using Turn10.LiveOps.StewardApi.Providers.Gravity;
using static Forza.WebServices.FMG.Generated.GameSettingsService;
using static Forza.WebServices.FMG.Generated.UserService;

namespace Turn10.LiveOps.StewardTest.Unit.Gravity
{
    [TestClass]
    public sealed class GravityGameSettingsProviderTests
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
        public void Ctor_WhenGravityUserServiceNull_Throws()
        {
            // Arrange.
            var dependencies = new Dependencies { GravityGameSettingsService = null };

            // Act.
            Action act = () => dependencies.Build();

            // Assert.
            act.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "gravityGameSettingsService"));
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
        public void Ctor_WhenRefreshableCacheStoreNull_Throws()
        {
            // Arrange.
            var dependencies = new Dependencies { RefreshableCacheStore = null };

            // Act.
            Action act = () => dependencies.Build();

            // Assert.
            act.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "refreshableCacheStore"));
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void GetGameSettingsAsync_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var gameSettingsId = Fixture.Create<Guid>();

            // Act.
            var actions = new List<Func<Task<GravityMasterInventory>>>
            {
                async () => await provider.GetGameSettingsAsync(gameSettingsId).ConfigureAwait(false),
            };

            // Assert.
            foreach (var action in actions)
            {
                action().Result.Should().BeOfType<GravityMasterInventory>();
            }
        }

        private sealed class Dependencies
        {
            public Dependencies()
            {
                this.GravityGameSettingsService.GetGameSettingsAsync(Arg.Any<Guid>()).Returns(Fixture.Create<LiveOpsGetGameSettingsOutput>());
                this.RefreshableCacheStore.GetItem<LiveOpsGetGameSettingsOutput>(Arg.Any<string>()).Returns(Fixture.Create<LiveOpsGetGameSettingsOutput>());
                this.Mapper.Map<GravityMasterInventory>(Arg.Any<LiveOpsGetGameSettingsOutput>()).Returns(Fixture.Create<GravityMasterInventory>());
            }

            public IGravityGameSettingsService GravityGameSettingsService { get; set; } = Substitute.For<IGravityGameSettingsService>();

            public IMapper Mapper { get; set; } = Substitute.For<IMapper>();

            public IRefreshableCacheStore RefreshableCacheStore { get; set; } = Substitute.For<IRefreshableCacheStore>();

            public GravityGameSettingsProvider Build() => new GravityGameSettingsProvider(this.GravityGameSettingsService, this.Mapper, this.RefreshableCacheStore);
        }
    }
}
