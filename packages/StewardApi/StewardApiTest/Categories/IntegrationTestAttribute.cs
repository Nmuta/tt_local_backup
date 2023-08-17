using System;

namespace Turn10.LiveOps.StewardTest.Categories
{
    /// <summary>
    ///     Marks this class/method as a Unit Test.
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
