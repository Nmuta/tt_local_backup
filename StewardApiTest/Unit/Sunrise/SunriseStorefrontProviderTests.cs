using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoFixture;
using AutoMapper;
using FluentAssertions;
using Forza.LiveOps.FH4.Generated;
using Forza.WebServices.FH4.Generated;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
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
        public void SearchUgcItemsAsync_WithValidParameters_DoesNotThrow()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var ugcType = UGCType.Livery;
            var filters = Fixture.Create<UGCFilters>();
            var endpointKey = Fixture.Create<string>();

            // Act.
            var actions = new List<Func<Task>>
            {
                async () => await provider.SearchUgcContentAsync(UGCType.Livery, filters, endpointKey).ConfigureAwait(false),
                async () => await provider.SearchUgcContentAsync(UGCType.Photo, filters, endpointKey).ConfigureAwait(false),
                async () => await provider.SearchUgcContentAsync(UGCType.Tune, filters, endpointKey).ConfigureAwait(false),
            };

            // Assert.
            foreach (var action in actions)
            {
                action.Should().NotThrow();
            }
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void SearchUgcItemsAsync_WithUnknownUgcType_Throws()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var filters = Fixture.Create<UGCFilters>();
            var endpointKey = Fixture.Create<string>();

            // Act.
            var actions = new List<Func<Task>>
            {
                async () => await provider.SearchUgcContentAsync(UGCType.Unknown, filters, endpointKey).ConfigureAwait(false),
            };

            // Assert.
            foreach (var action in actions)
            {
                action.Should().Throw<InvalidArgumentsStewardException>().WithMessage("Invalid UGC item type to search: Unknown");
            }
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void SearchUgcItemsAsync_WithNullUgcFilters_Throws()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var endpointKey = Fixture.Create<string>();

            // Act.
            var actions = new List<Func<Task>>
            {
                async () => await provider.SearchUgcContentAsync(UGCType.Livery, null, endpointKey).ConfigureAwait(false),
                async () => await provider.SearchUgcContentAsync(UGCType.Photo, null, endpointKey).ConfigureAwait(false),
                async () => await provider.SearchUgcContentAsync(UGCType.Tune, null, endpointKey).ConfigureAwait(false),
            };

            // Assert.
            foreach (var action in actions)
            {
                action.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "filters"));
            }
        }

        [TestMethod]
        [TestCategory("Unit")]
        public async Task GetUGCLiveryAsync_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var liveryId = Fixture.Create<Guid>();
            var endpointKey = Fixture.Create<string>();

            // Act.
            async Task<UgcItem> Action() => await provider.GetUGCLiveryAsync(liveryId, endpointKey).ConfigureAwait(false);

            // Assert.
            var result = await Action().ConfigureAwait(false);
            result.Should().BeOfType<UgcItem>();
        }

        [TestMethod]
        [TestCategory("Unit")]
        public async Task GetUGCPhotoAsync_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var photoId = Fixture.Create<Guid>();
            var endpointKey = Fixture.Create<string>();

            // Act.
            async Task<UgcItem> Action() => await provider.GetUGCPhotoAsync(photoId, endpointKey).ConfigureAwait(false);

            // Assert.
            var result = await Action().ConfigureAwait(false);
            result.Should().BeOfType<UgcItem>();
        }

        [TestMethod]
        [TestCategory("Unit")]
        public async Task GetUGCTuneAsync_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var tuneId = Fixture.Create<Guid>();
            var endpointKey = Fixture.Create<string>();

            async Task<UgcItem> Action() => await provider.GetUGCTuneAsync(tuneId, endpointKey).ConfigureAwait(false);

            // Assert.
            var result = await Action().ConfigureAwait(false);
            result.Should().BeOfType<UgcItem>();
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void SetUGCFeaturedStatusAsync_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var contentId = Fixture.Create<Guid>();
            var featured = Fixture.Create<bool>();
            var endpointKey = Fixture.Create<string>();

            // Act.
            Func<Task> act = async () => await provider.SetUGCFeaturedStatusAsync(contentId, featured, null, endpointKey).ConfigureAwait(false);

            // Assert.
            act.Should().NotThrow();
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void GetHiddenUGCForUser_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var xuid = Fixture.Create<ulong>();
            var endpoint = Fixture.Create<string>();

            // Act.
            Func<Task> act = async () => await provider.GetHiddenUGCForUserAsync(xuid, endpoint).ConfigureAwait(false);

            // Assert.
            act.Should().NotThrow();
        }

        private sealed class Dependencies
        {
            public Dependencies()
            {
                this.SunriseService.SearchUgcContentAsync(Arg.Any<ForzaUGCSearchRequest>(), Arg.Any<ForzaUGCContentType>(), Arg.Any<string>()).Returns(Fixture.Create<StorefrontManagementService.SearchUGCOutput>());
                this.SunriseService.GetPlayerLiveryAsync(Arg.Any<Guid>(), Arg.Any<string>()).Returns(Fixture.Create<StorefrontManagementService.GetUGCLiveryOutput>());
                this.SunriseService.GetPlayerPhotoAsync(Arg.Any<Guid>(), Arg.Any<string>()).Returns(Fixture.Create<StorefrontManagementService.GetUGCPhotoOutput>());
                this.SunriseService.GetPlayerTuneAsync(Arg.Any<Guid>(), Arg.Any<string>()).Returns(Fixture.Create<StorefrontManagementService.GetUGCTuneOutput>());
                this.SunriseService.GetHiddenUgcForUserAsync(Arg.Any<int>(), Arg.Any<ulong>(), Arg.Any<Forza.UserGeneratedContent.FH4.Generated.FileType>(), Arg.Any<string>()).Returns(Fixture.Create<StorefrontService.GetHiddenUGCForUserOutput>());
                this.Mapper.Map<IList<UgcItem>>(Arg.Any<ForzaPhotoData[]>()).Returns(Fixture.Create<IList<UgcItem>>());
                this.Mapper.Map<IList<UgcItem>>(Arg.Any<ForzaLiveryData[]>()).Returns(Fixture.Create<IList<UgcItem>>());
                this.Mapper.Map<IList<UgcItem>>(Arg.Any<ForzaTuneData[]>()).Returns(Fixture.Create<IList<UgcItem>>());
                this.Mapper.Map<IList<HideableUgc>>(Arg.Any<List<ForzaStorefrontFile>>()).Returns(Fixture.Create<IList<HideableUgc>>());
                var ugcItem = Fixture.Create<UgcItem>();
                ugcItem.GameTitle = (int)GameTitle.FH4;
                this.Mapper.Map<UgcItem>(Arg.Any<ForzaPhotoData>()).Returns(ugcItem);
                this.Mapper.Map<UgcItem>(Arg.Any<ForzaLiveryData>()).Returns(ugcItem);
                this.Mapper.Map<UgcItem>(Arg.Any<ForzaTuneData>()).Returns(ugcItem);
            }

            public ISunriseService SunriseService { get; set; } = Substitute.For<ISunriseService>();
            
            public IMapper Mapper { get; set; } = Substitute.For<IMapper>();

            public SunriseStorefrontProvider Build() => new SunriseStorefrontProvider(this.SunriseService, this.Mapper);
        }
    }
}
