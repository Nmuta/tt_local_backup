using System.Collections.Generic;
using System.Text.RegularExpressions;
using Microsoft.OpenApi.Any;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;
using Turn10.LiveOps.StewardApi.Contracts.Apollo;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead;
using Turn10.LiveOps.StewardApi.Contracts.Sunrise;
using Turn10.LiveOps.StewardApi.Contracts.Woodstock;

namespace Turn10.LiveOps.StewardApi.Filters
{
    /// <summary>
    ///     Adds required header parameters to Swagger.
    /// </summary>
    public class AddRequiredHeaderParameter : IOperationFilter
    {
        /// <summary>
        ///     Adds endpointKey header input to Open API parameters.
        /// </summary>
        public void Apply(OpenApiOperation operation, OperationFilterContext context)
        {
            operation.Parameters ??= new List<OpenApiParameter>();

            var path = context.ApiDescription.RelativePath;
            var isV1Path = new Regex(@"(?i)^api\/v1\/*").IsMatch(path);
            var isV2Path = new Regex(@"(?i)^api\/v2\/*").IsMatch(path);
            var isApollo = new Regex(@"(?i)^*\/title\/apollo\/*").IsMatch(path);
            var isSunrise = new Regex(@"(?i)^*\/title\/sunrise\/*").IsMatch(path);
            var isWoodstock = new Regex(@"(?i)^*\/title\/woodstock\/*").IsMatch(path);
            var isSteelhead = new Regex(@"(?i)^*\/title\/steelhead\/*").IsMatch(path);
            var isMultiTitle = new Regex(@"(?i)^*\/title\/multi\/*").IsMatch(path);

            if (isV1Path)
            {
                var defaultKey = string.Empty;
                defaultKey = isSteelhead ? SteelheadEndpoint.V1Default : defaultKey;
                defaultKey = isWoodstock ? WoodstockEndpoint.V1Default : defaultKey;
                defaultKey = isSunrise ? SunriseEndpoint.V1Default : defaultKey;
                defaultKey = isApollo ? ApolloEndpoint.V1Default : defaultKey;

                operation.Parameters.Add(new OpenApiParameter
                {
                    Name = "endpointKey",
                    In = ParameterLocation.Header,
                    Required = false,
                    Schema = new OpenApiSchema()
                    {
                        Default = new OpenApiString(defaultKey),
                    },
                });
            }

            if (isV2Path)
            {
                if (isSteelhead || isMultiTitle)
                {
                    operation.Parameters.Add(new OpenApiParameter
                    {
                        Name = "Endpoint-Steelhead",
                        In = ParameterLocation.Header,
                        Required = false,
                        Schema = new OpenApiSchema()
                        {
                            Default = new OpenApiString(SteelheadEndpoint.V2Default),
                        },
                    });
                }

                if (isWoodstock || isMultiTitle)
                {
                    operation.Parameters.Add(new OpenApiParameter
                    {
                        Name = "Endpoint-Woodstock",
                        In = ParameterLocation.Header,
                        Required = false,
                        Schema = new OpenApiSchema()
                        {
                            Default = new OpenApiString(WoodstockEndpoint.V2Default),
                        },
                    });
                }

                if (isSunrise || isMultiTitle)
                {
                    operation.Parameters.Add(new OpenApiParameter
                    {
                        Name = "Endpoint-Sunrise",
                        In = ParameterLocation.Header,
                        Required = false,
                        Schema = new OpenApiSchema()
                        {
                            Default = new OpenApiString(SunriseEndpoint.V2Default),
                        },
                    });
                }

                if (isApollo || isMultiTitle)
                {
                    operation.Parameters.Add(new OpenApiParameter
                    {
                        Name = "Endpoint-Apollo",
                        In = ParameterLocation.Header,
                        Required = false,
                        Schema = new OpenApiSchema()
                        {
                            Default = new OpenApiString(ApolloEndpoint.V2Default),
                        },
                    });
                }
            }
        }
    }
}
