﻿using AutoFixture;
using AutoMapper;
using FluentAssertions;
using Forza.LiveOps.FH4.Generated;
using Forza.WebServices.FH4.Generated;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Helpers;
using Turn10.LiveOps.StewardApi.Providers.Sunrise;
using Turn10.LiveOps.StewardApi.Providers.Sunrise.ServiceConnections;
using Turn10.UGC.Contracts;

namespace Turn10.LiveOps.StewardTest.Unit.Sunrise
{
    [TestClass]
    public sealed class SunriseStorefrontProviderTests
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
        public void Ctor_WhenSunriseServiceIsNull_Throws()
        {
            // Arrange.
            var dependencies = new Dependencies { SunriseService = null };

            // Act.
            Action act = () => dependencies.Build();

            // Assert.
            act.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "sunriseService"));
        }

        [TestMethod]
        [UnitTest]
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
        [UnitTest]
        public void SearchUgcItemsAsync_WithValidParameters_DoesNotThrow()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var filters = Fixture.Create<UgcFilters>();
            var endpointKey = Fixture.Create<string>();

            // Act.
            var actions = new List<Func<Task>>
            {
                async () => await provider.SearchUgcContentAsync(UgcType.Livery, filters, endpointKey).ConfigureAwait(false),
                async () => await provider.SearchUgcContentAsync(UgcType.Photo, filters, endpointKey).ConfigureAwait(false),
                async () => await provider.SearchUgcContentAsync(UgcType.Tune, filters, endpointKey).ConfigureAwait(false),
            };

            // Assert.
            foreach (var action in actions)
            {
                action.Should().NotThrow();
            }
        }

        [TestMethod]
        [UnitTest]
        public void SearchUgcItemsAsync_WithUnknownUgcType_Throws()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var filters = Fixture.Create<UgcFilters>();
            var endpointKey = Fixture.Create<string>();

            // Act.
            var actions = new List<Func<Task>>
            {
                async () => await provider.SearchUgcContentAsync(UgcType.Unknown, filters, endpointKey).ConfigureAwait(false),
            };

            // Assert.
            foreach (var action in actions)
            {
                action.Should().Throw<InvalidArgumentsStewardException>().WithMessage("Invalid UGC item type to search: Unknown");
            }
        }

        [TestMethod]
        [UnitTest]
        public void SearchUgcItemsAsync_WithNullUgcFilters_Throws()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var endpointKey = Fixture.Create<string>();

            // Act.
            var actions = new List<Func<Task>>
            {
                async () => await provider.SearchUgcContentAsync(UgcType.Livery, null, endpointKey).ConfigureAwait(false),
                async () => await provider.SearchUgcContentAsync(UgcType.Photo, null, endpointKey).ConfigureAwait(false),
                async () => await provider.SearchUgcContentAsync(UgcType.Tune, null, endpointKey).ConfigureAwait(false),
            };

            // Assert.
            foreach (var action in actions)
            {
                action.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "filters"));
            }
        }

        [TestMethod]
        [UnitTest]
        public async Task GetUGCLiveryAsync_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var liveryId = Fixture.Create<Guid>();
            var endpointKey = Fixture.Create<string>();

            // Act.
            async Task<UgcLiveryItem> Action() => await provider.GetUgcLiveryAsync(liveryId, endpointKey).ConfigureAwait(false);

            // Assert.
            var result = await Action().ConfigureAwait(false);
            result.Should().BeOfType<UgcLiveryItem>();
        }

        [TestMethod]
        [UnitTest]
        public async Task GetUGCPhotoAsync_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var photoId = Fixture.Create<Guid>();
            var endpointKey = Fixture.Create<string>();

            // Act.
            async Task<UgcItem> Action() => await provider.GetUgcPhotoAsync(photoId, endpointKey).ConfigureAwait(false);

            // Assert.
            var result = await Action().ConfigureAwait(false);
            result.Should().BeOfType<UgcItem>();
        }

        [TestMethod]
        [UnitTest]
        public async Task GetUGCTuneAsync_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var tuneId = Fixture.Create<Guid>();
            var endpointKey = Fixture.Create<string>();

            async Task<UgcItem> Action() => await provider.GetUgcTuneAsync(tuneId, endpointKey).ConfigureAwait(false);

            // Assert.
            var result = await Action().ConfigureAwait(false);
            result.Should().BeOfType<UgcItem>();
        }

        [TestMethod]
        [UnitTest]
        public void SetUGCFeaturedStatusAsync_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var contentId = Fixture.Create<Guid>();
            var featured = Fixture.Create<bool>();
            var endpointKey = Fixture.Create<string>();

            // Act.
            Func<Task> act = async () => await provider.SetUgcFeaturedStatusAsync(contentId, featured, null, null, endpointKey).ConfigureAwait(false);

            // Assert.
            act.Should().NotThrow();
        }

        [TestMethod]
        [UnitTest]
        public void GetHiddenUGCForUser_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var xuid = Fixture.Create<ulong>();
            var endpoint = Fixture.Create<string>();

            // Act.
            Func<Task> act = async () => await provider.GetHiddenUgcForUserAsync(xuid, endpoint).ConfigureAwait(false);

            // Assert.
            act.Should().NotThrow();
        }

        [TestMethod]
        [UnitTest]
        public void HideUgc_WithValidInputs_DoesNotThrow()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var ugcId = Fixture.Create<Guid>();
            var endpoint = Fixture.Create<string>();

            // Act.
            Func<Task> action = async () => await provider.HideUgcAsync(ugcId, endpoint).ConfigureAwait(false);

            // Assert.
            action.Should().NotThrow();
        }

        [TestMethod]
        [UnitTest]
        public void UnhideUgc_WithValidInputs_DoesNotThrow()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var xuid = Fixture.Create<ulong>();
            var ugcId = Fixture.Create<Guid>();
            var fileType = Fixture.Create<Forza.UserGeneratedContent.FH4.Generated.FileType>();
            var endpoint = Fixture.Create<string>();

            // Act.
            Func<Task> action = async () => await provider.UnhideUgcAsync(xuid, ugcId, fileType, endpoint).ConfigureAwait(false);

            // Assert.
            action.Should().NotThrow();
        }

        private sealed class Dependencies
        {
            public Dependencies()
            {
                this.SunriseService.SearchUgcContentAsync(Arg.Any<ForzaUGCSearchRequest>(), Arg.Any<ForzaUGCContentType>(), Arg.Any<string>()).Returns(Fixture.Create<StorefrontManagementService.SearchUGCOutput>());
                this.SunriseService.GetPlayerLiveryAsync(Arg.Any<Guid>(), Arg.Any<string>()).Returns(Fixture.Create<StorefrontManagementService.GetUGCLiveryOutput>());
                this.SunriseService.GetPlayerPhotoAsync(Arg.Any<Guid>(), Arg.Any<string>()).Returns(Fixture.Create<StorefrontManagementService.GetUGCPhotoOutput>());
                this.SunriseService.GetPlayerTuneAsync(Arg.Any<Guid>(), Arg.Any<string>()).Returns(Fixture.Create<StorefrontManagementService.GetUGCTuneOutput>());
                this.SunriseService.GetPlayerUgcObjectAsync(Arg.Any<Guid>(), Arg.Any<string>()).Returns(Fixture.Create<StorefrontManagementService.GetUGCObjectOutput>());
                this.SunriseService.GetHiddenUgcForUserAsync(Arg.Any<int>(), Arg.Any<ulong>(), Arg.Any<Forza.UserGeneratedContent.FH4.Generated.FileType>(), Arg.Any<string>()).Returns(Fixture.Create<StorefrontService.GetHiddenUGCForUserOutput>());
                this.Mapper.SafeMap<IList<HideableUgc>>(Arg.Any<List<ForzaStorefrontFile>>()).Returns(Fixture.Create<IList<HideableUgc>>());
                var ugcItem = Fixture.Create<UgcItem>();
                var ugcLiveryItem = Fixture.Create<UgcLiveryItem>();
                ugcItem.GameTitle = (int)GameTitle.FH4;
                ugcLiveryItem.GameTitle = (int)GameTitle.FH4;
                this.Mapper.SafeMap<UgcItem>(Arg.Any<ForzaUGCData>()).Returns(ugcItem);
                this.Mapper.SafeMap<UgcItem>(Arg.Any<ForzaPhotoData>()).Returns(ugcItem);
                this.Mapper.SafeMap<UgcLiveryItem>(Arg.Any<ForzaLiveryData>()).Returns(ugcLiveryItem);
                this.Mapper.SafeMap<UgcItem>(Arg.Any<ForzaTuneData>()).Returns(ugcItem);
            }

            public ISunriseService SunriseService { get; set; } = Substitute.For<ISunriseService>();

            public IMapper Mapper { get; set; } = Substitute.For<IMapper>();

            public SunriseStorefrontProvider Build() => new SunriseStorefrontProvider(this.SunriseService, this.Mapper);
        }
    }
}
