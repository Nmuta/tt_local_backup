using System;

namespace Turn10.LiveOps.StewardApi.Contracts.Steelhead.WelcomeCenter
{
    /// <summary>
    ///     Signal whether a property belongs
    ///     to the xml root namespace.
    /// </summary>
    [AttributeUsage(AttributeTargets.Property | AttributeTargets.Field | AttributeTargets.Class, Inherited = false, AllowMultiple = false)]
    public sealed class PegEditAttribute : Attribute
    {
    }
}
