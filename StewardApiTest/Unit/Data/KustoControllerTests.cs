using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoFixture;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Newtonsoft.Json.Linq;
using NSubstitute;
using Turn10.LiveOps.StewardApi.Contracts.Data;
using Turn10.LiveOps.StewardApi.Controllers;
using Turn10.LiveOps.StewardApi.Providers.Data;

namespace Turn10.LiveOps.StewardTest.Unit.Data
{
    [TestClass]
    public sealed class KustoControllerTests
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
        public void Ctor_WhenKustoProviderNull_Throws()
        {
            // Arrange.
            var dependencies = new Dependencies { KustoProvider = null };

            // Act.
            Action act = () => dependencies.Build();

            // Assert.
            act.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "kustoProvider"));
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void Ctor_WhenKustoQueryProviderNull_Throws()
        {
            // Arrange.
            var dependencies = new Dependencies { KustoQueryProvider = null };

            // Act.
            Action act = () => dependencies.Build();

            // Assert.
            act.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "kustoQueryProvider"));
        }

        [TestMethod]
        [TestCategory("Unit")]
        public async Task RunQuery_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var query = $"database('{Fixture.Create<string>()}'). {Fixture.Create<string>()}";

            // Act.
            async Task<IActionResult> Action() => await controller.RunQuery(query).ConfigureAwait(false);

            // Assert.
            Action().Should().BeAssignableTo<Task<IActionResult>>();
            Action().Should().NotBeNull();
            var result = await Action().ConfigureAwait(false) as OkObjectResult;
            var details = result.Value as IList<JObject>;
            details.Should().NotBeNull();
            details.Should().BeOfType<List<JObject>>();
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void RunQuery_WithNullEmtpyWhitespaceQuery_Throws()
        {
            // Arrange.
            var controller = new Dependencies().Build();

            // Act.
            var actions = new List<Func<Task<IActionResult>>>
            {
                async () => await controller.RunQuery(null).ConfigureAwait(false),
                async () => await controller.RunQuery(TestConstants.Empty).ConfigureAwait(false),
                async () => await controller.RunQuery(TestConstants.WhiteSpace).ConfigureAwait(false)
            };

            // Assert.
            foreach (var action in actions)
            {
                action.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "query"));
            }
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void RunQuery_WithBadlyFormedQuery_Throws()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var query = Fixture.Create<string>();

            Func<Task<IActionResult>> action = async () => await controller.RunQuery(query).ConfigureAwait(false);

            // Assert.
            action.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "database"));
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void SaveQuery_WithValidParameters_DoesNotThrow()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var query = Fixture.Create<KustoQuery>();

            // Act.
            Func<Task<IActionResult>> action = async () => await controller.SaveQueries(new List<KustoQuery>{query}).ConfigureAwait(false);

            // Assert.
            action.Should().NotThrow();
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void SaveQuery_WithNullQueries_Throws()
        {
            // Arrange.
            var controller = new Dependencies().Build();

            // Act.
            Func<Task<IActionResult>> action = async () => await controller.SaveQueries(null).ConfigureAwait(false);

            // Assert.
            action.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "queries"));
        }


        [TestMethod]
        [TestCategory("Unit")]
        public async Task RetrieveQueries_ReturnsCorrectType()
        {
            // Arrange.
            var controller = new Dependencies().Build();

            // Act.
            async Task<IActionResult> Action() => await controller.RetrieveQueries().ConfigureAwait(false);

            // Assert.
            Action().Should().BeAssignableTo<Task<IActionResult>>();
            Action().Should().NotBeNull();
            var result = await Action().ConfigureAwait(false) as OkObjectResult;
            var details = result.Value as IList<KustoQuery>;
            details.Should().NotBeNull();
            details.Should().BeOfType<List<KustoQuery>>();
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void DeleteQuery_WithValidParameters_DoesNotThrow()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var name = Fixture.Create<string>();

            // Act.
            Func<Task<IActionResult>> action = async () => await controller.DeleteQuery(name).ConfigureAwait(false);

            // Assert.
            action.Should().NotThrow();
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void DeleteQuery_WithNullEmptyWhitespaceQueryId_DoesNotThrow()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var name = Fixture.Create<string>();

            // Act.
            // Act.
            var actions = new List<Func<Task<IActionResult>>>
            {
                async () => await controller.DeleteQuery(null).ConfigureAwait(false),
                async () => await controller.DeleteQuery(TestConstants.Empty).ConfigureAwait(false),
                async () => await controller.DeleteQuery(TestConstants.WhiteSpace).ConfigureAwait(false)
            };

            // Assert.
            foreach (var action in actions)
            {
                action.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "queryId"));
            }
        }

        internal sealed class Dependencies
        {
            public Dependencies()
            {
                this.KustoQueryProvider.GetKustoQueriesAsync().Returns(Fixture.Create<IList<KustoQuery>>());
                this.KustoProvider.RunKustoQuery(Arg.Any<string>(), Arg.Any<string>()).Returns(Fixture.Create<IList<JObject>>());
            }

            public IKustoProvider KustoProvider { get; set; } = Substitute.For<IKustoProvider>();

            public IKustoQueryProvider KustoQueryProvider { get; set; } = Substitute.For<IKustoQueryProvider>();

            public KustoController Build() => new KustoController(this.KustoProvider, this.KustoQueryProvider);
        }
    }
}
