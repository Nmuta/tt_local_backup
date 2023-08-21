using System;

namespace Turn10.LiveOps.StewardTest.Categories
{
    /// <summary>
    ///     Marks this class/method as an Integration Test.
    ///     The test may be run before a release.
    /// </summary>
    [AttributeUsage(AttributeTargets.Assembly | AttributeTargets.Class | AttributeTargets.Method, AllowMultiple = true)]
    public sealed class IntegrationTestReleaseAttribute : TestAttributeBase
    {
        public IntegrationTestReleaseAttribute()
            : base("Integration", "Integration-Release")
        {
        }
    }
}
