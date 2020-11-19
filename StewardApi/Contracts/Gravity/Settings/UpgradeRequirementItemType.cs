using System.Runtime.Serialization;

namespace Turn10.LiveOps.StewardApi.Contracts.Gravity.Settings
{
    /// <summary>
    ///     Represents the upgrade requirement item type.
    /// </summary>
    [System.CodeDom.Compiler.GeneratedCode("NJsonSchema", "9.13.18.0 (Newtonsoft.Json v11.0.0.0)")]
    public enum UpgradeRequirementItemType
    {
        [EnumMember(Value = @"Car")]
#pragma warning disable CS1591 // Missing XML comment for publicly visible type or member. EMERSONF we won't be documenting these.
        Car = 0,
        [EnumMember(Value = @"Pack")]
        Pack = 1,
        [EnumMember(Value = @"RepairKit")]
        RepairKit = 2,
        [EnumMember(Value = @"ReviveKit")]
        ReviveKit = 3,
        [EnumMember(Value = @"MasteryKit")]
        MasteryKit = 4,
        [EnumMember(Value = @"UpgradeKit")]
        UpgradeKit = 5,
        [EnumMember(Value = @"Currency")]
        Currency = 6,
        [EnumMember(Value = @"EnergyRefill")]
        EnergyRefill = 7,
        [EnumMember(Value = @"Any")]
        Any = 8
    }
}
