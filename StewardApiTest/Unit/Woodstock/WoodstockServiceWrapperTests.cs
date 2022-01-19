using System;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using Turn10.LiveOps.StewardApi.Common;
using Turn10.LiveOps.StewardApi.Providers.Woodstock.ServiceConnections;

namespace Turn10.LiveOps.StewardTest.Unit.Woodstock
{
    [TestClass]
    public sealed class WoodstockServiceWrapperTests
    {
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
        public void Ctor_WhenWoodstockServiceFactoryNull_Throws()
        {
            // Arrange.
            var dependencies = new Dependencies { WoodstockServiceFactory = null };

            // Act.
            Action act = () => dependencies.Build();

            // Assert.
            act.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "woodstockServiceFactory"));
        }

        private sealed class Dependencies
        {
            public IWoodstockServiceFactory WoodstockServiceFactory { get; set; } = Substitute.For<IWoodstockServiceFactory>();

            public WoodstockServiceWrapper Build() => new WoodstockServiceWrapper(this.WoodstockServiceFactory);
        }
    }
}
