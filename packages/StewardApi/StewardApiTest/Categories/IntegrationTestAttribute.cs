using System;

namespace Turn10.LiveOps.StewardTest.Categories
{
    /// <summary>
    ///     Marks this class/method as an Integration Test.
    ///     Attribute should  be avoided in favor of more specific tags like
    ///     <see cref="IntegrationTestDailyAttribute"/>,
    ///     <see cref="IntegrationTestReleaseAttribute"/>,
    ///     or <see cref="IntegrationTestDailyOrReleaseAttribute"/>.
    ///     
    /// </summary>
    [AttributeUsage(AttributeTargets.Assembly | AttributeTargets.Class | AttributeTargets.Method, AllowMultiple = true)]
    public sealed class IntegrationTestAttribute : TestAttributeBase
    {
        [Obsolete("Prefer to use something more specific, like IntegrationDaily")]
        public IntegrationTestAttribute()
            : base("Integration")
        {
        }
    }
}
