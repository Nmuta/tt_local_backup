using AutoFixture;
using AutoMapper;
using FluentAssertions;
using Forza.WebServices.FM7.Generated;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Turn10.LiveOps.StewardApi.Contracts.Apollo;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Helpers;
using Turn10.LiveOps.StewardApi.Providers.Apollo;
using Turn10.LiveOps.StewardApi.Providers.Apollo.ServiceConnections;
using Turn10.UGC.Contracts;

namespace Turn10.LiveOps.StewardTest.Unit.Apollo
{
    [TestClass]
    public sealed class ApolloStorefrontProviderTests
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
        public void Ctor_WhenApolloServiceIsNull_Throws()
        {
            // Arrange.
            var dependencies = new Dependencies { ApolloService = null };

            // Act.
            Action act = () => dependencies.Build();

            // Assert.
            act.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "apolloService"));
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
            var liveryId = Fixture.Create<string>();
            var endpointKey = Fixture.Create<string>();

            // Act.
            async Task<ApolloUgcLiveryItem> Action() => await provider.GetUgcLiveryAsync(liveryId, endpointKey).ConfigureAwait(false);

            // Assert.
            var result = await Action().ConfigureAwait(false);
            result.Should().BeOfType<ApolloUgcLiveryItem>();
        }

        private sealed class Dependencies
        {
            public Dependencies()
            {
                this.ApolloService.SearchUgcContentAsync(Arg.Any<ForzaUGCSearchV2Request>(), Arg.Any<ForzaUGCContentType>(), Arg.Any<string>()).Returns(Fixture.Create<StorefrontManagementService.SearchUGCV2Output>());
                this.ApolloService.GetPlayerLiveryAsync(Arg.Any<string>(), Arg.Any<string>()).Returns(Fixture.Create<StorefrontManagementService.GetUGCLiveryOutput>());
                this.Mapper.SafeMap<IList<HideableUgc>>(Arg.Any<List<ForzaStorefrontFile>>()).Returns(Fixture.Create<IList<HideableUgc>>());
                var ugcItem = Fixture.Create<ApolloUgcLiveryItem>();
                ugcItem.GameTitle = (int)GameTitle.FM7;
                this.Mapper.SafeMap<ApolloUgcLiveryItem>(Arg.Any<ForzaLiveryData>()).Returns(ugcItem);
            }

            public IApolloService ApolloService { get; set; } = Substitute.For<IApolloService>();

            public IMapper Mapper { get; set; } = Substitute.For<IMapper>();

            public ApolloStorefrontProvider Build() => new ApolloStorefrontProvider(this.ApolloService, this.Mapper);
        }
    }
}
