using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Data;

namespace Turn10.LiveOps.StewardApi.Filters
{
    /// <summary>
    ///     Attribute used to control automatic action logging in Steward.
    /// </summary>
    public sealed class ManualActionLoggingAttribute : AutoActionLoggingAttribute
    {
        /// <summary>
        ///     Initializes a new instance of the <see cref="ManualActionLoggingAttribute"/> class.
        /// </summary>
        public ManualActionLoggingAttribute(TitleCodeName title, StewardAction action, StewardSubject subject)
            : base(title, action, subject, false)
        {
        }
    }
}
