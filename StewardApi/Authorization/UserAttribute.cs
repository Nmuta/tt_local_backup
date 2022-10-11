using System.Collections.Generic;
using System.Linq;

namespace Turn10.LiveOps.StewardApi.Authorization
{
    /// <summary>
    ///     Represents the AAD app user roles.
    /// </summary>
#pragma warning disable CS1591 // Missing XML comment for publicly visible type or member
#pragma warning disable SA1600 // Elements should be documented
    public static class UserAttribute
    {
        public const string TestController = "TestController";
        public const string TestAction = "TestAction";
        // TODO: add them all here

        public static IEnumerable<string> AllAttributes()
        {
            return typeof(UserAttribute).GetFields().Select(field => field.Name);
        }
    }
}