using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Turn10.LiveOps.StewardApi.Helpers;

namespace Turn10.LiveOps.StewardTest.Unit
{
    [TestClass]
    public sealed class StringExtensionTests
    {
        [TestMethod]
        [UnitTest]
        public void Convert_ToDashedSnakeCase_VariousSamples()
        {
            "OneTwoThreeA".ToDashedSnakeCase().Should().Be("one-two-three-a");
            "OTwoThreeB".ToDashedSnakeCase().Should().Be("o-two-three-b");
            "ONETwoThreeC".ToDashedSnakeCase().Should().Be("one-two-three-c");
            "OneTWOThreeD".ToDashedSnakeCase().Should().Be("one-two-three-d");
            "OneTwoThree".ToDashedSnakeCase().Should().Be("one-two-three");
            "oneTwoThree".ToDashedSnakeCase().Should().Be("one-two-three");
        }
    }
}
