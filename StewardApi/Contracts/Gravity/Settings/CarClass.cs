using System.Runtime.Serialization;

namespace Turn10.LiveOps.StewardApi.Contracts.Gravity.Settings
{
    /// <summary>
    ///     Represents a car class.
    /// </summary>
    public enum CarClass
    {
        [EnumMember(Value = @"Generic")]
#pragma warning disable CS1591 // Missing XML comment for publicly visible type or member. EMERSONF we won't be documenting these.
        Generic = 0,
        [EnumMember(Value = @"Muscle")]
        Muscle = 1,
        [EnumMember(Value = @"Sports")]
        Sports = 2,
        [EnumMember(Value = @"Street")]
        Street = 3,
        [EnumMember(Value = @"Super")]
        Super = 4
    }
}
