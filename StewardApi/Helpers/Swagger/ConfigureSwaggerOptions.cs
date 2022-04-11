// based on https://referbruv.com/blog/posts/integrating-aspnet-core-api-versions-with-swagger-ui
using System;
using Microsoft.AspNetCore.Mvc.ApiExplorer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;
using Turn10.LiveOps.StewardApi.Common;
using Turn10.LiveOps.StewardApi.Filters;

namespace Turn10.LiveOps.StewardApi.Helpers.Swagger
{
    /// <summary>
    ///     Configures swagger.
    /// </summary>
    public class ConfigureSwaggerOptions
        : IConfigureNamedOptions<SwaggerGenOptions>
    {
        private readonly IApiVersionDescriptionProvider provider;
        private readonly IConfiguration configuration;

        public ConfigureSwaggerOptions(
            IApiVersionDescriptionProvider provider,
            IConfiguration configuration)
        {
            this.provider = provider;
            this.configuration = configuration;
        }

        public void Configure(SwaggerGenOptions options)
        {
            // add swagger document for every API version discovered
            foreach (var description in this.provider.ApiVersionDescriptions)
            {
                options.SwaggerDoc(
                    description.GroupName,
                    this.CreateVersionInfo(description));
            }
        }

        public void Configure(string name, SwaggerGenOptions options)
        {
            this.Configure(options);

            options.CustomSchemaIds(type => type.ToString());

            options.AddSecurityDefinition("bearer", new OpenApiSecurityScheme
            {
                Type = SecuritySchemeType.OAuth2,
                BearerFormat = "JWT",
                In = ParameterLocation.Header,
                Scheme = "bearer",
                Flows = new OpenApiOAuthFlows
                {
                    Implicit = new OpenApiOAuthFlow
                    {
                        TokenUrl = new Uri($"{this.configuration[ConfigurationKeyConstants.AzureInstance]}/{this.configuration[ConfigurationKeyConstants.AzureTenantId]}/oauth2/v2.0/token"),
                        AuthorizationUrl = new Uri($"{this.configuration[ConfigurationKeyConstants.AzureInstance]}/{this.configuration[ConfigurationKeyConstants.AzureTenantId]}/oauth2/v2.0/authorize"),
                        Scopes = { { $"api://{this.configuration[ConfigurationKeyConstants.AzureClientId]}/api_access", "API Access" } },
                    }
                }
            });

            options.OperationFilter<AddRequiredHeaderParameter>();
            options.OperationFilter<AuthorizationHeaderParameterOperationFilter>();
            options.OperationFilter<SessionIdHeaderParameterOperationFilter>();
            options.OperationFilter<SwaggerTagOperationFilter>();
            options.DocumentFilter<ReorderTagsDocumentFilter>();
        }

        private OpenApiInfo CreateVersionInfo(
                ApiVersionDescription description)
        {
            var info = new OpenApiInfo()
            {
                Title = "Steward API",
                Version = description.ApiVersion.ToString(),
                Contact = new OpenApiContact
                {
                    Email = "t10liveopstools@microsoft.com",
                    Name = "Turn 10 LiveOps Tools"
                },
            };

            if (description.IsDeprecated)
            {
                info.Description += " This API version has been deprecated.";
            }

            return info;
        }
    }
}
