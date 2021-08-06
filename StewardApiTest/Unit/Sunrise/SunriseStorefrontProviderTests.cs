using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoFixture;
using AutoMapper;
using FluentAssertions;
using Forza.LiveOps.FH4.Generated;
using Microsoft.Extensions.Configuration;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using NSubstitute.ReturnsExtensions;
using Turn10.Data.Kusto;
using Turn10.LiveOps.StewardApi.Common;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Data;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Contracts.Sunrise;
using Turn10.LiveOps.StewardApi.Providers.Data;
using Turn10.LiveOps.StewardApi.Providers.Sunrise;
using Turn10.LiveOps.StewardApi.Providers.Sunrise.ServiceConnections;

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
        public void SearchUGCItemsAsync_WithValidParameters_DoesNotThrow()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var ugcType = Fixture.Create<UGCType>();
            var filters = Fixture.Create<UGCFilters>();

            // Act.
            Func<Task<IList<UGCItem>>> act = async () => await provider.SearchUGCItems(ugcType, filters).ConfigureAwait(false);

            // Assert.
            act.Should().NotThrow();
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void SearchUGCItemsAsync_WithUnknownUgcType_Throws()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var filters = Fixture.Create<UGCFilters>();

            // Act.
            var actions = new List<Func<Task>>
            {
                async () => await provider.SearchUGCItems(UGCType.Unknown, filters).ConfigureAwait(false),
            };

            // Assert.
            foreach (var action in actions)
            {
                action.Should().Throw<InvalidArgumentsStewardException>().WithMessage("Invalid UGC item type to search: Unknown");
            }
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void SearchUGCItemsAsync_WithNullUgcFilters_Throws()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var ugcType = Fixture.Create<UGCType>();

            // Act.
            var actions = new List<Func<Task>>
            {
                async () => await provider.SearchUGCItems(ugcType, null).ConfigureAwait(false),
            };

            // Assert.
            foreach (var action in actions)
            {
                action.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "filters"));
            }
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void GetUGCLiveryAsync_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var liveryId = Fixture.Create<Guid>();

            // Act.
            Func<Task<UGCItem>> act = async () => await provider.GetUGCLivery(liveryId).ConfigureAwait(false);

            // Assert.
            act().Result.Should().BeOfType<UGCItem>();
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void GetUGCPhotoAsync_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var photoId = Fixture.Create<Guid>();

            // Act.
            Func<Task<UGCItem>> act = async () => await provider.GetUGCPhoto(photoId).ConfigureAwait(false);

            // Assert.
            act().Result.Should().BeOfType<UGCItem>();
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void SetUGCFeaturedStatusAsync_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var contentId = Fixture.Create<Guid>();
            var featured = Fixture.Create<bool>();

            // Act.
            Func<Task> act = async () => await provider.SetUGCFeaturedStatus(contentId, featured, null).ConfigureAwait(false);

            // Assert.
            act.Should().NotThrow();
        }

        private sealed class Dependencies
        {
            public Dependencies()
            {
                this.SunriseService.GetPlayerLiveries(Arg.Any<ForzaUGCSearchRequest>()).Returns(Fixture.Create<StorefrontManagementService.SearchUGCLiveriesOutput>());
                this.SunriseService.GetPlayerPhotos(Arg.Any<ForzaUGCSearchRequest>()).Returns(Fixture.Create<StorefrontManagementService.SearchUGCPhotosOutput>());
                this.SunriseService.GetPlayerLivery(Arg.Any<Guid>()).Returns(Fixture.Create<StorefrontManagementService.GetUGCLiveryOutput>());
                this.SunriseService.GetPlayerPhoto(Arg.Any<Guid>()).Returns(Fixture.Create<StorefrontManagementService.GetUGCPhotoOutput>());
                this.Mapper.Map<IList<UGCItem>>(Arg.Any<ForzaPhotoData[]>()).Returns(Fixture.Create<IList<UGCItem>>());
                this.Mapper.Map<IList<UGCItem>>(Arg.Any<ForzaLiveryData[]>()).Returns(Fixture.Create<IList<UGCItem>>());
                this.Mapper.Map<UGCItem>(Arg.Any<ForzaPhotoData>()).Returns(Fixture.Create<UGCItem>());
                this.Mapper.Map<UGCItem>(Arg.Any<ForzaLiveryData>()).Returns(Fixture.Create<UGCItem>());
            }

            public ISunriseService SunriseService { get; set; } = Substitute.For<ISunriseService>();

            public IMapper Mapper { get; set; } = Substitute.For<IMapper>();

            public SunriseStorefrontProvider Build() => new SunriseStorefrontProvider(this.SunriseService, this.Mapper);
        }
    }
}
