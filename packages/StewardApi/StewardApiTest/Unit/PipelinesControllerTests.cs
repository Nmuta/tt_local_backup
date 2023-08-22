using AutoFixture;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Turn10.LiveOps.StewardApi.Controllers;
using Turn10.LiveOps.StewardApi.Providers.Pipelines;

namespace Turn10.LiveOps.StewardTest.Unit
{
    [TestClass]
    public sealed class PipelinesControllerTests
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
        public void Ctor_WhenProviderFactoryNull_Throws()
        {
            // Arrange.
            var dependencies = new Dependencies { ObligationProvider = null };

            // Act.
            Action act = () => dependencies.Build();

            // Assert.
            act.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "obligationProvider"));
        }

        [TestMethod]
        [UnitTest]
        public void DeletePipeline_WhenPipelineNameNullEmptyWhitespace_Return400()
        {
            // Arrange.
            var controller = new Dependencies().Build();

            // Act.
            var actions = new List<Func<Task>>
            {
                async () => await controller.DeletePipeline(null).ConfigureAwait(false),
                async () => await controller.DeletePipeline(TestConstants.Empty).ConfigureAwait(false),
                async () => await controller.DeletePipeline(TestConstants.WhiteSpace).ConfigureAwait(false)
            };

            // Assert.
            foreach (var action in actions)
            {
                action.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "pipelineName"));
            }
        }

        [TestMethod]
        [UnitTest]
        public async Task DeletePipeline_WhenParamsValid_ReturnsGuid()
        {
            // Arrange.
            var obligationProvider = Substitute.For<IObligationProvider>();
            obligationProvider.DeletePipelineAsync(Arg.Any<string>()).Returns(Fixture.Create<Guid>());
            var controller = new PipelinesController(obligationProvider);

            // Act.
            async Task<IActionResult> Action() => await controller.DeletePipeline(Fixture.Create<string>()).ConfigureAwait(false);

            // Assert.
            var result = await Action().ConfigureAwait(false) as OkObjectResult;
            result.StatusCode.Should().Be(200);
            await obligationProvider.Received(1).DeletePipelineAsync(Arg.Any<string>()).ConfigureAwait(false);
        }

        internal sealed class Dependencies
        {
            public Dependencies()
            {
                this.ObligationProvider.DeletePipelineAsync(Arg.Any<string>()).Returns(Fixture.Create<Guid>());
            }

            public IObligationProvider ObligationProvider { get; set; } = Substitute.For<IObligationProvider>();

            public PipelinesController Build() => new PipelinesController(this.ObligationProvider);
        }
    }
}
