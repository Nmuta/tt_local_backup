using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Contracts.Forte;

namespace Turn10.LiveOps.StewardApi.Controllers.V2.Forte
{
    /// <summary>Base class for Forte V2 Controllers.</summary>
    public class V2ForteControllerBase : V2ControllerBase
    {
        /// <summary>Initializes a new instance of the <see cref="V2ForteControllerBase"/> class.</summary>
        protected V2ForteControllerBase()
        {
        }

        /// <summary>Gets the Forte PlayFab environment from the endpoint set in headers.</summary>
        /// <remarks>For now returns the only Forte PlayFab Environment that exists.</remarks>
        protected FortePlayFabEnvironment PlayFabEnvironment
        {
            get
            {
                return FortePlayFabEnvironment.Dev;
            }
        }
    }
}
