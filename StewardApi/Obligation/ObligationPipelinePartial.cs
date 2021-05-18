using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Turn10.LiveOps.StewardApi.Obligation
{
    /// <summary>
    ///     A partial deserialization of the Obligation Pipelines GET response
    /// </summary>
    public sealed class ObligationPipelinePartial
    {
        public string Name { get; set; }

        public string Status { get; set; }
    }
}
