#pragma warning disable SA1600 // ElementsMustBeDocumented (POCO mapped from Pegasus)

namespace Turn10.LiveOps.StewardApi.Contracts.Steelhead.WelcomeCenter.DisplayConditions
{
    /// <summary>
    ///     Represents a display condition which displays contingent on previous scene player navigated from.
    /// </summary>
    public class PreviousUiSceneCondition : ConditionSettings
    {
        public string SceneEnum { get; set; }
    }
}
