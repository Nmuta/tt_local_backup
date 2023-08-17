using System;

namespace Turn10.LiveOps.StewardTest.Categories
{
    /// <summary>
    ///     Marks this class/method as an Integration Test.
    ///     This test should not be run unless necessary.
    /// </summary>
    [AttributeUsage(AttributeTargets.Assembly | AttributeTargets.Class | AttributeTargets.Method, AllowMultiple = true)]
    public sealed class IntegrationTestRestrictedAttribute : TestAttributeBase
    {
        public IntegrationTestRestrictedAttribute()
            : base("Integration", "Integration -Restricted")
        {
        }
    }
}
