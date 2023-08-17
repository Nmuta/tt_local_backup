using System;

namespace Turn10.LiveOps.StewardTest.Categories
{
    /// <summary>
    ///     Marks this class/method as an Integration Test.
    ///     The test may be run daily.
    /// </summary>
    [AttributeUsage(AttributeTargets.Assembly | AttributeTargets.Class | AttributeTargets.Method, AllowMultiple = true)]
    public sealed class IntegrationTestDailyAttribute : TestAttributeBase
    {
        public IntegrationTestDailyAttribute()
            : base("Integration", "Integration-Daily")
        {
        }
    }
}
