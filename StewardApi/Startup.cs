using System;
using System.Collections.Generic;
using System.Net;
using System.Reflection;
using AutoMapper;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Identity.Web;
using Microsoft.OpenApi.Models;
using Newtonsoft.Json;
using Turn10.Data.Azure;
using Turn10.Data.Common;
using Turn10.Data.Kusto;
using Turn10.Data.SecretProvider;
using Turn10.LiveOps.StewardApi.Common;
using Turn10.LiveOps.StewardApi.Contracts.Apollo;
using Turn10.LiveOps.StewardApi.Contracts.Gravity;
using Turn10.LiveOps.StewardApi.Contracts.Sunrise;
using Turn10.LiveOps.StewardApi.Filters;
using Turn10.LiveOps.StewardApi.Helpers.JsonConverters;
using Turn10.LiveOps.StewardApi.Logging;
using Turn10.LiveOps.StewardApi.Middleware;
using Turn10.LiveOps.StewardApi.Obligation;
using Turn10.LiveOps.StewardApi.ProfileMappers;
using Turn10.LiveOps.StewardApi.Providers;
using Turn10.LiveOps.StewardApi.Providers.Apollo;
using Turn10.LiveOps.StewardApi.Providers.Data;
using Turn10.LiveOps.StewardApi.Providers.Gravity;
using Turn10.LiveOps.StewardApi.Providers.Opus;
using Turn10.LiveOps.StewardApi.Providers.Sunrise;
using Turn10.LiveOps.StewardApi.Validation;
using Turn10.Services.Diagnostics;
using Turn10.Services.Diagnostics.Geneva;
using Turn10.Services.WebApi.Core;
using static Turn10.LiveOps.StewardApi.Common.ApplicationSettings;

namespace Turn10.LiveOps.StewardApi
{
    /// <summary>
    ///     Entry point for the app.
    /// </summary>
    [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Maintainability", "CA1506:AvoidExcessiveClassCoupling", Justification = "This can't be avoided.")]
    public sealed class Startup
    {
        private readonly IConfiguration configuration;

        /// <summary>
        ///     Initializes a new instance of the <see cref="Startup"/> class.
        /// </summary>
        public Startup(IConfiguration configuration)
        {
            this.configuration = configuration;
        }

        /// <summary>
        ///     Configures the services.
        /// </summary>
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddMvc(options => options.Filters.Add(new
                ServiceExceptionFilter()));
            services.AddMemoryCache();
            services.AddMicrosoftIdentityWebApiAuthentication(this.configuration);
            services.Configure<OpenIdConnectOptions>(OpenIdConnectDefaults.AuthenticationScheme, options =>
            {
                // Use the groups claim for populating roles
                options.TokenValidationParameters.RoleClaimType = "roles";
                options.TokenValidationParameters.NameClaimType = "name";
            });

            services.Configure<IISServerOptions>(options =>
            {
                options.AllowSynchronousIO = true;
            });

            services.AddAuthorization(options =>
            {
                options.AddPolicy(AuthorizationPolicy.AssignmentToLiveOpsAdminRoleRequired, policy => policy.RequireRole(AppRole.LiveOpsAdmin));
                options.AddPolicy(AuthorizationPolicy.AssignmentToLiveOpsAgentRoleRequired, policy => policy.RequireRole(AppRole.LiveOpsAgent));
            });

            services.AddControllers().AddNewtonsoftJson(options =>
            {
                options.SerializerSettings.Converters = new List<JsonConverter> { new TimeSpanConverter() };
            });

            services.AddApplicationInsightsTelemetry();

            services.AddSwaggerGen(options =>
            {
                options.SwaggerDoc("v1", new OpenApiInfo
                {
                    Title = "Turn 10 Steward API",
                    Version = this.GetType().Assembly.GetCustomAttribute<AssemblyInformationalVersionAttribute>().InformationalVersion,
                    Description = "Turn 10 Steward",
                    Contact = new OpenApiContact
                    {
                        Email = "t10liveopstools@microsoft.com",
                        Name = "Turn 10 LiveOps Tools"
                    }
                });

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
                            Scopes = { { $"api://{this.configuration[ConfigurationKeyConstants.AzureClientId]}/api_access", "API Access" } }
                        }
                    }
                });

                options.OperationFilter<AuthorizationHeaderParameterOperationFilter>();
                options.OperationFilter<SessionIdHeaderParameterOperationFilter>();
            });

            services.AddCors(options =>
            {
                options.AddPolicy("CorsPolicy", builder => builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
            });

            services.AddSingleton<IKeyVaultClientFactory, KeyVaultClientFactory>();
            services.AddSingleton<IKeyVaultProvider, KeyVaultProvider>();
            services.AddSingleton<IObligationAuthoringClient, ObligationAuthoringClient>();
            services.AddSingleton<IObligationProvider, ObligationProvider>();
            // Prepare LogSink
            var ifxLogSink = new IfxLogSink(
                this.configuration[ConfigurationKeyConstants.GenevaTenantId],
                this.configuration[ConfigurationKeyConstants.GenevaRoleId],
                GetRoleInstanceName());
            services.AddSingleton(new LogManager(new List<ILogSink> { ifxLogSink }));

            // Prepare Metrics Sink
            var ifxMetricsSink = new IfxMetricsSink(
                this.configuration[ConfigurationKeyConstants.GenevaMdmAccount],
                this.configuration[ConfigurationKeyConstants.GenevaMdmNamespace],
                GetRoleInstanceName());
            services.AddSingleton(new MetricsManager(new List<IMetricsSink> { ifxMetricsSink }));

            var keyVaultProvider = new KeyVaultProvider(new KeyVaultClientFactory());

            var mappingConfiguration = new MapperConfiguration(mc =>
            {
                mc.AddProfile(new OpusProfileMapper());
                mc.AddProfile(new SunriseProfileMapper());
                mc.AddProfile(new GravityProfileMapper());
                mc.AddProfile(new ApolloProfileMapper());
                mc.AddProfile(new DataProfileMapper());
                mc.AllowNullCollections = true;
            });

            var mapper = mappingConfiguration.CreateMapper();
            services.AddSingleton(mapper);

            services.AddSingleton<IKeyVaultProvider, KeyVaultProvider>();

            services.AddSingleton(this.configuration);

            services.AddSingleton<IStsClient, StsClientWrapper>();

            services.AddSingleton<ILoggingService, LoggingService>();

            services.AddSingleton<IGravityUserService, GravityUserServiceWrapper>();
            services.AddSingleton<IGravityGameSettingsService, GravityGameSettingsServiceWrapper>();
            services.AddSingleton<IGravityUserInventoryService, GravityUserInventoryServiceWrapper>();
            services.AddSingleton<IGravityPlayerDetailsProvider, GravityPlayerDetailsProvider>();
            services.AddSingleton<IGravityGameSettingsProvider, GravityGameSettingsProvider>();
            services.AddSingleton<IGravityPlayerInventoryProvider, GravityPlayerInventoryProvider>();
            services.AddSingleton<IRequestValidator<GravityMasterInventory>, GravityMasterInventoryRequestValidator>();
            services.AddSingleton<IRequestValidator<GravityGift>, GravityGiftRequestValidator>();
            services.AddSingleton<IGravityGiftHistoryProvider, GravityGiftHistoryProvider>();

            services.AddSingleton<ISunriseUserService, SunriseUserServiceWrapper>();
            services.AddSingleton<ISunriseEnforcementService, SunriseEnforcementServiceWrapper>();
            services.AddSingleton<ISunriseUserInventoryService, SunriseUserInventoryServiceWrapper>();
            services.AddSingleton<ISunriseGiftingService, SunriseGiftingServiceWrapper>();
            services.AddSingleton<ISunriseNotificationsService, SunriseNotificationsServiceWrapper>();
            services.AddSingleton<ISunrisePlayerDetailsProvider, SunrisePlayerDetailsProvider>();
            services.AddSingleton<ISunrisePlayerInventoryProvider, SunrisePlayerInventoryProvider>();
            services.AddSingleton<IRequestValidator<SunriseMasterInventory>, SunriseMasterInventoryRequestValidator>();
            services.AddSingleton<IRequestValidator<SunriseBanParametersInput>, SunriseBanParametersRequestValidator>();
            services.AddSingleton<IRequestValidator<SunriseUserFlagsInput>, SunriseUserFlagsRequestValidator>();
            services.AddSingleton<IRequestValidator<SunriseGift>, SunriseGiftRequestValidator>();
            services.AddSingleton<IRequestValidator<SunriseGroupGift>, SunriseGroupGiftRequestValidator>();
            services.AddSingleton<ISunriseGiftHistoryProvider, SunriseGiftHistoryProvider>();
            services.AddSingleton<ISunriseBanHistoryProvider, SunriseBanHistoryProvider>();

            services.AddSingleton<IApolloUserService, ApolloUserServiceWrapper>();
            services.AddSingleton<IApolloGroupingService, ApolloGroupingServiceWrapper>();
            services.AddSingleton<IApolloUserInventoryService, ApolloUserInventoryServiceWrapper>();
            services.AddSingleton<IApolloGiftingService, ApolloGiftingServiceWrapper>();
            services.AddSingleton<IApolloPlayerDetailsProvider, ApolloPlayerDetailsProvider>();
            services.AddSingleton<IApolloPlayerInventoryProvider, ApolloPlayerInventoryProvider>();
            services.AddSingleton<IApolloBanHistoryProvider, ApolloBanHistoryProvider>();
            services.AddSingleton<IRequestValidator<ApolloBanParametersInput>, ApolloBanParametersRequestValidator>();
            services.AddSingleton<IRequestValidator<ApolloMasterInventory>, ApolloMasterInventoryRequestValidator>();
            services.AddSingleton<IRequestValidator<ApolloUserFlagsInput>, ApolloUserFlagsRequestValidator>();
            services.AddSingleton<IRequestValidator<ApolloGift>, ApolloGiftRequestValidator>();
            services.AddSingleton<IRequestValidator<ApolloGroupGift>, ApolloGroupGiftRequestValidator>();
            services.AddSingleton<IApolloGiftHistoryProvider, ApolloGiftHistoryProvider>();

            services.AddSingleton<IOpusUserService, OpusUserServiceWrapper>();
            services.AddSingleton<IOpusOnlineProfileService, OpusOnlineProfileServiceWrapper>();
            services.AddSingleton<IOpusPlayerDetailsProvider, OpusPlayerDetailsProvider>();
            services.AddSingleton<IOpusPlayerInventoryProvider, OpusPlayerInventoryProvider>();

            var kustoClientSecret = keyVaultProvider.GetSecretAsync(this.configuration[ConfigurationKeyConstants.KeyVaultUrl], this.configuration[ConfigurationKeyConstants.KustoClientSecretName]).GetAwaiter().GetResult();

            var kustoLoggerConfiguration = new KustoConfiguration();

            this.configuration.Bind("KustoLoggerConfiguration", kustoLoggerConfiguration);
            kustoLoggerConfiguration.ClientSecret = kustoClientSecret;
            var kustoStreamingLogger = new KustoStreamingLogger(new KustoFactory(kustoLoggerConfiguration));
            services.AddSingleton<IKustoStreamingLogger>(kustoStreamingLogger);

            // TODO: This is not how to do DI. I'll come back later and fix all of this (emersonf).
            var kustoConfiguration = new KustoConfiguration();
            this.configuration.Bind("KustoConfiguration", kustoConfiguration);
            kustoConfiguration.ClientSecret = kustoClientSecret;
            var kustoProvider = new KustoProvider(new KustoFactory(kustoConfiguration), new LocalCacheStore(), this.configuration);
            services.AddSingleton<IKustoProvider>(kustoProvider);

            services.AddSingleton<IScheduler, TaskExecutionScheduler>();
            services.AddSingleton<IRefreshableCacheStore, LocalCacheStore>();

            services.AddSingleton<IKeyVaultClientFactory, KeyVaultClientFactory>();

            services.AddSingleton<ITableStorageClientFactory, TableStorageClientFactory>();

            var blobConnectionString = keyVaultProvider.GetSecretAsync(this.configuration[ConfigurationKeyConstants.KeyVaultUrl], this.configuration[ConfigurationKeyConstants.BlobConnectionSecretName]).GetAwaiter().GetResult();

            var blobRepo = new BlobRepository(new CloudBlobProxy(blobConnectionString));

            services.AddSingleton<IBlobRepository>(blobRepo);

            services.AddSingleton<IJobTracker, JobTracker>();
            services.AddSingleton<IKustoQueryProvider, KustoQueryProvider>();
        }

        /// <summary>
        ///     Configures the app.
        /// </summary>
        public void Configure(IApplicationBuilder applicationBuilder, IWebHostEnvironment webHostEnvironment)
        {
            if (webHostEnvironment.IsDevelopment())
            {
                applicationBuilder.UseDeveloperExceptionPage();
            }

            applicationBuilder.UseCors("CorsPolicy");
            applicationBuilder.UseSwagger();
            applicationBuilder.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "My API V1");
                c.OAuthClientId(this.configuration[ConfigurationKeyConstants.AzureClientId]);
                c.OAuthScopeSeparator(" ");
            });

            applicationBuilder.UseHttpsRedirection();
            applicationBuilder.UseAuthentication();
            applicationBuilder.UseRouting();
            applicationBuilder.UseAuthorization();
            applicationBuilder.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });

            applicationBuilder.UseMiddleware<JournalMiddleware>();
            applicationBuilder.UseMiddleware<RequestDiagnosticsMiddleware>();
        }

        private static string GetRoleInstanceName()
        {
            var addresses = Dns.GetHostAddresses(Environment.MachineName);
            foreach (var address in addresses)
            {
                if (address.AddressFamily != System.Net.Sockets.AddressFamily.InterNetwork) { continue; }

                return address.ToString();
            }

            return null;
        }
    }
}
