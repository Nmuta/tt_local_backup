using System.Reflection;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Providers;

namespace Turn10.LiveOps.StewardApi.Contracts.Woodstock
{
    /// <summary>
    ///     Represents a Pegasus environment for use by Woodstock Pegasus Service.
    /// </summary>
    public sealed class WoodstockPegasusEnvironment
    {
        /// <summary>
        ///     Gets Woodstock 'prod' Pegasus environment.
        /// </summary>
        public static string Prod => "prod";

        /// <summary>
        ///     Gets Woodstock 'dev' Pegasus environment.
        /// </summary>
        public static string Dev => "dev";

        /// <summary>
        ///     Converts endpoint key into endpoint.
        /// </summary>
        public static string RetrieveEnvironment(string environment)
        {
            // If nothing is provided, assume Prod as default.
            if (string.IsNullOrWhiteSpace(environment))
            {
                return Prod;
            }

            var property = typeof(WoodstockPegasusEnvironment).GetProperty(environment, BindingFlags.Public | BindingFlags.Static | BindingFlags.Instance | BindingFlags.IgnoreCase);
            if (property == null)
            {
                throw new PegasusStewardException($"Failed to recognize environment: {environment} for title: {TitleConstants.WoodstockCodeName}.");
            }

            var value = property.GetValue(null, null);

            return (string)value;
        }
    }
}