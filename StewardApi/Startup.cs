using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Net;
using AutoMapper;
using Microsoft.ApplicationInsights.AspNetCore.Extensions;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.ApiExplorer;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Identity.Web;
using Newtonsoft.Json;
using Turn10.Data.Azure;
using Turn10.Data.Common;
using Turn10.Data.Kusto;
using Turn10.Data.SecretProvider;
using Turn10.LiveOps.StewardApi.Common;
using Turn10.LiveOps.StewardApi.Contracts.Apollo;
using Turn10.LiveOps.StewardApi.Contracts.Data;
using Turn10.LiveOps.StewardApi.Contracts.Gravity;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead;
using Turn10.LiveOps.StewardApi.Contracts.Sunrise;
using Turn10.LiveOps.StewardApi.Contracts.Woodstock;
using Turn10.LiveOps.StewardApi.Filters;
using Turn10.LiveOps.StewardApi.Helpers.JsonConverters;
using Turn10.LiveOps.StewardApi.Helpers.Swagger;
using Turn10.LiveOps.StewardApi.Hubs;
using Turn10.LiveOps.StewardApi.Logging;
using Turn10.LiveOps.StewardApi.Middleware;
using Turn10.LiveOps.StewardApi.Obligation;
using Turn10.LiveOps.StewardApi.ProfileMappers;
using Turn10.LiveOps.StewardApi.Providers;
using Turn10.LiveOps.StewardApi.Providers.Apollo;
using Turn10.LiveOps.StewardApi.Providers.Apollo.ServiceConnections;
using Turn10.LiveOps.StewardApi.Providers.Data;
using Turn10.LiveOps.StewardApi.Providers.Gravity;
using Turn10.LiveOps.StewardApi.Providers.Gravity.ServiceConnections;
using Turn10.LiveOps.StewardApi.Providers.Opus;
using Turn10.LiveOps.StewardApi.Providers.Opus.ServiceConnections;
using Turn10.LiveOps.StewardApi.Providers.Pipelines;
using Turn10.LiveOps.StewardApi.Providers.Steelhead;
using Turn10.LiveOps.StewardApi.Providers.Steelhead.ServiceConnections;
using Turn10.LiveOps.StewardApi.Providers.Sunrise;
using Turn10.LiveOps.StewardApi.Providers.Sunrise.ServiceConnections;
using Turn10.LiveOps.StewardApi.Providers.Woodstock;
using Turn10.LiveOps.StewardApi.Providers.Woodstock.ServiceConnections;
using Turn10.LiveOps.StewardApi.Proxies;
using Turn10.LiveOps.StewardApi.Validation;
using Turn10.LiveOps.StewardApi.Validation.Apollo;
using Turn10.LiveOps.StewardApi.Validation.Gravity;
using Turn10.LiveOps.StewardApi.Validation.Steelhead;
using Turn10.LiveOps.StewardApi.Validation.Sunrise;
using Turn10.LiveOps.StewardApi.Validation.Woodstock;
using Turn10.Services.CMSRetrieval;
using Turn10.Services.Diagnostics;
using Turn10.Services.Diagnostics.Geneva;
using Turn10.Services.Storage.Blob;
using Turn10.Services.WebApi.Core;
using static Turn10.LiveOps.StewardApi.Common.ApplicationSettings;
using System.Linq;
using System.Threading.Tasks;
using SteelheadV2Providers = Turn10.LiveOps.StewardApi.Providers.Steelhead.V2;
using Turn10.LiveOps.StewardApi.Helpers;

namespace Turn10.LiveOps.StewardApi
{
    /// <summary>
    ///     Entry point for the app.
    /// </summary>
    [SuppressMessage("Microsoft.Maintainability", "CA1506:AvoidExcessiveClassCoupling", Justification = "This can't be avoided.")]
    public sealed class Startup
    {
        private readonly IConfiguration configuration;

        private IServiceCollection allServices;

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
            // If you are setting "redacted due to PII" when debugging certificates/dates/identities, enable this.
            // IdentityModelEventSource.ShowPII = true;
            services.AddControllers();
            services.AddMvc(options => options.Filters.Add(new ServiceExceptionFilter()));
            services.AddApiVersioning(o =>
            {
                o.AssumeDefaultVersionWhenUnspecified = true;
                o.DefaultApiVersion = new ApiVersion(1, 0);
                o.ReportApiVersions = true;
                o.UseApiBehavior = false;
            });

            services.AddVersionedApiExplorer(o =>
            {
                o.GroupNameFormat = "'v'VVV";
                o.SubstituteApiVersionInUrl = true;
                o.AssumeDefaultVersionWhenUnspecified = true;
                o.DefaultApiVersion = new ApiVersion(1, 0);
            });

            services.AddSwaggerGen();
            services.AddSwaggerGenNewtonsoftSupport();
            services.ConfigureOptions<ConfigureSwaggerOptions>();

            services.AddMemoryCache();

            services.AddAuthentication(options =>
                {
                    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                });
            services.AddMicrosoftIdentityWebApiAuthentication(this.configuration);
            services.Configure<JwtBearerOptions>(JwtBearerDefaults.AuthenticationScheme, options =>
            {
                var existingOnMessageReceivedHandler = options.Events.OnMessageReceived;
                options.Events.OnMessageReceived = async context =>
                {
                    await existingOnMessageReceivedHandler(context).ConfigureAwait(false);

                    var accessToken = context.Request.Query["access_token"];
                    var path = context.HttpContext.Request.Path;

                    if (!string.IsNullOrEmpty(accessToken) && path.StartsWithSegments("/hubs", StringComparison.InvariantCulture))
                    {
                        context.Token = accessToken;
                    }
                };
            });
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

            services.AddSignalR().AddNewtonsoftJsonProtocol();

            services.AddApplicationInsightsTelemetry(
                new ApplicationInsightsServiceOptions
                {
                    EnableAdaptiveSampling = false,
                });

            services.AddCors(options =>
            {
                options.AddPolicy(
                    "CorsPolicy",
                    builder =>
                        builder
                            .WithOrigins(
                                "http://localhost:4200",
                                "https://steward-ui-dev.azurewebsites.net",
                                "https://steward-ui-dev-staging.azurewebsites.net",
                                "https://steward-ui-prod.azurewebsites.net",
                                "https://steward-ui-prod-staging.azurewebsites.net")
                            .AllowCredentials()
                            .AllowAnyMethod()
                            .AllowAnyHeader());
            });

            ProviderRegistrations.Register(services);
            ProxyRegistrations.Register(services);

            services.AddSingleton<IKeyVaultClientFactory, KeyVaultClientFactory>();
            services.AddSingleton<IKeyVaultProvider, KeyVaultProvider>();
            services.AddSingleton<IObligationAuthoringClient, ObligationAuthoringClient>();
            services.AddSingleton<IObligationProvider, ObligationProvider>();
            services.AddSingleton<IUserIdProvider, UserIdProvider>();

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
                mc.AddProfile(new SteelheadProfileMapper());
                mc.AddProfile(new WoodstockProfileMapper());
                mc.AddProfile(new DataProfileMapper());
                mc.AllowNullCollections = true;
                mc.IgnoreUnmapped(); // TODO: We should remove this and correct all the mappings. //Should we? Some of the unmapped properties are left empty on purpose. Like error property on valid successes
            });
            mappingConfiguration.AssertConfigurationIsValid();
            var mapper = mappingConfiguration.CreateMapper();
            services.AddSingleton(mapper);

            services.AddSingleton<IKeyVaultProvider, KeyVaultProvider>();

            services.AddSingleton(this.configuration);

            services.AddSingleton<IStsClient, StsClientWrapper>();

            services.AddSingleton<ILoggingService, LoggingService>();
            services.AddSingleton<INotificationHistoryProvider, NotificationHistoryProvider>();

            services.AddSingleton<IWoodstockService, WoodstockServiceWrapper>();
            services.AddSingleton<IWoodstockPegasusService, WoodstockPegasusService>();
            services.AddSingleton<ILiveProjectionWoodstockServiceFactory, LiveProjectionWoodstockServiceFactory>();
            services.AddSingleton<IStewardProjectionWoodstockServiceFactory, StewardProjectionWoodstockServiceFactory>();
            services.AddSingleton<IWoodstockPlayerDetailsProvider, WoodstockPlayerDetailsProvider>();
            services.AddSingleton<IWoodstockPlayerInventoryProvider, WoodstockPlayerInventoryProvider>();
            services.AddSingleton<IWoodstockServiceManagementProvider, WoodstockServiceManagementProvider>();
            services.AddSingleton<IWoodstockNotificationProvider, WoodstockNotificationProvider>();
            services.AddSingleton<IWoodstockBanHistoryProvider, WoodstockBanHistoryProvider>();
            services.AddSingleton<IWoodstockGiftHistoryProvider, WoodstockGiftHistoryProvider>();
            services.AddSingleton<IWoodstockStorefrontProvider, WoodstockStorefrontProvider>();
            services.AddSingleton<IWoodstockLeaderboardProvider, WoodstockLeaderboardProvider>();
            services.AddSingleton<IWoodstockItemsProvider, WoodstockItemsProvider>();

            services.AddSingleton<IRequestValidator<WoodstockBanParametersInput>, WoodstockBanParametersRequestValidator>();
            services.AddSingleton<IRequestValidator<WoodstockGroupGift>, WoodstockGroupGiftRequestValidator>();
            services.AddSingleton<IRequestValidator<WoodstockGift>, WoodstockGiftRequestValidator>();
            services.AddSingleton<IRequestValidator<WoodstockMasterInventory>, WoodstockMasterInventoryRequestValidator>();
            services.AddSingleton<IRequestValidator<WoodstockUserFlagsInput>, WoodstockUserFlagsRequestValidator>();

            services.AddSingleton<ISteelheadService, SteelheadServiceWrapper>();
            services.AddSingleton<ISteelheadPegasusService, SteelheadPegasusService>();
            services.AddSingleton<ISteelheadServiceFactory, SteelheadServiceFactory>();
            services.AddSingleton<ISteelheadPlayerDetailsProvider, SteelheadPlayerDetailsProvider>();
            services.AddSingleton<ISteelheadPlayerInventoryProvider, SteelheadPlayerInventoryProvider>();
            services.AddSingleton<ISteelheadServiceManagementProvider, SteelheadServiceManagementProvider>();
            services.AddSingleton<ISteelheadNotificationProvider, SteelheadNotificationProvider>();
            services.AddSingleton<ISteelheadBanHistoryProvider, SteelheadBanHistoryProvider>();
            services.AddSingleton<ISteelheadGiftHistoryProvider, SteelheadGiftHistoryProvider>();
            services.AddSingleton<IRequestValidator<SteelheadBanParametersInput>, SteelheadBanParametersRequestValidator>();
            services.AddSingleton<IRequestValidator<SteelheadGroupGift>, SteelheadGroupGiftRequestValidator>();
            services.AddSingleton<IRequestValidator<SteelheadGift>, SteelheadGiftRequestValidator>();
            services.AddSingleton<IRequestValidator<SteelheadMasterInventory>, SteelheadMasterInventoryRequestValidator>();
            services.AddSingleton<IRequestValidator<SteelheadUserFlagsInput>, SteelheadUserFlagsRequestValidator>();
            // V2 providers
            services.AddSingleton<SteelheadV2Providers.ISteelheadItemsProvider, SteelheadV2Providers.SteelheadItemsProvider>();
            services.AddSingleton<SteelheadV2Providers.ISteelheadGiftHistoryProvider, SteelheadV2Providers.SteelheadGiftHistoryProvider>();
            services.AddSingleton<SteelheadV2Providers.ISteelheadPlayerInventoryProvider, SteelheadV2Providers.SteelheadPlayerInventoryProvider>();
            services.AddSingleton<SteelheadV2Providers.ISteelheadServiceManagementProvider, SteelheadV2Providers.SteelheadServiceManagementProvider>();

            services.AddSingleton<IGravityService, GravityServiceWrapper>();
            services.AddSingleton<IGravityPlayerDetailsProvider, GravityPlayerDetailsProvider>();
            services.AddSingleton<IGravityGameSettingsProvider, GravityGameSettingsProvider>();
            services.AddSingleton<IGravityPlayerInventoryProvider, GravityPlayerInventoryProvider>();
            services.AddSingleton<IRequestValidator<GravityMasterInventory>, GravityMasterInventoryRequestValidator>();
            services.AddSingleton<IRequestValidator<GravityGift>, GravityGiftRequestValidator>();
            services.AddSingleton<IGravityGiftHistoryProvider, GravityGiftHistoryProvider>();

            services.AddSingleton<ISunriseService, SunriseServiceWrapper>();
            services.AddSingleton<ISunriseServiceFactory, SunriseServiceFactory>();
            services.AddSingleton<ISunrisePlayerDetailsProvider, SunrisePlayerDetailsProvider>();
            services.AddSingleton<ISunrisePlayerInventoryProvider, SunrisePlayerInventoryProvider>();
            services.AddSingleton<ISunriseServiceManagementProvider, SunriseServiceManagementProvider>();
            services.AddSingleton<ISunriseNotificationProvider, SunriseNotificationProvider>();
            services.AddSingleton<IRequestValidator<SunriseMasterInventory>, SunriseMasterInventoryRequestValidator>();
            services.AddSingleton<IRequestValidator<SunriseBanParametersInput>, SunriseBanParametersRequestValidator>();
            services.AddSingleton<IRequestValidator<SunriseUserFlagsInput>, SunriseUserFlagsRequestValidator>();
            services.AddSingleton<IRequestValidator<SunriseGift>, SunriseGiftRequestValidator>();
            services.AddSingleton<IRequestValidator<SunriseGroupGift>, SunriseGroupGiftRequestValidator>();
            services.AddSingleton<ISunriseGiftHistoryProvider, SunriseGiftHistoryProvider>();
            services.AddSingleton<ISunriseBanHistoryProvider, SunriseBanHistoryProvider>();
            services.AddSingleton<ISunriseStorefrontProvider, SunriseStorefrontProvider>();

            services.AddSingleton<IApolloService, ApolloServiceWrapper>();
            services.AddSingleton<IApolloPlayerDetailsProvider, ApolloPlayerDetailsProvider>();
            services.AddSingleton<IApolloPlayerInventoryProvider, ApolloPlayerInventoryProvider>();
            services.AddSingleton<IApolloBanHistoryProvider, ApolloBanHistoryProvider>();
            services.AddSingleton<IApolloServiceManagementProvider, ApolloServiceManagementProvider>();
            services.AddSingleton<IRequestValidator<ApolloBanParametersInput>, ApolloBanParametersRequestValidator>();
            services.AddSingleton<IRequestValidator<ApolloMasterInventory>, ApolloMasterInventoryRequestValidator>();
            services.AddSingleton<IRequestValidator<ApolloUserFlagsInput>, ApolloUserFlagsRequestValidator>();
            services.AddSingleton<IRequestValidator<ApolloGift>, ApolloGiftRequestValidator>();
            services.AddSingleton<IRequestValidator<ApolloGroupGift>, ApolloGroupGiftRequestValidator>();
            services.AddSingleton<IApolloGiftHistoryProvider, ApolloGiftHistoryProvider>();
            services.AddSingleton<IApolloStorefrontProvider, ApolloStorefrontProvider>();

            services.AddSingleton<IOpusService, OpusServiceWrapper>();
            services.AddSingleton<IOpusPlayerDetailsProvider, OpusPlayerDetailsProvider>();
            services.AddSingleton<IOpusPlayerInventoryProvider, OpusPlayerInventoryProvider>();

            services.AddSingleton<IBlobStorageProvider, BlobStorageProvider>();

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

            services.AddScoped<ActionData>();
            services.AddScoped<IActionLogger, ActionLogger>();
            services.AddSingleton<IScheduler, TaskExecutionScheduler>();
            services.AddSingleton<IRefreshableCacheStore, LocalCacheStore>();

            services.AddSingleton<IKeyVaultClientFactory, KeyVaultClientFactory>();

            services.AddSingleton<ITableStorageClientFactory, TableStorageClientFactory>();

            var blobConnectionString = keyVaultProvider.GetSecretAsync(this.configuration[ConfigurationKeyConstants.KeyVaultUrl], this.configuration[ConfigurationKeyConstants.BlobConnectionSecretName]).GetAwaiter().GetResult();

            var blobRepo = new BlobRepository(new CloudBlobProxy(blobConnectionString));

            services.AddSingleton<IBlobRepository>(blobRepo);

            services.AddSingleton<HubManager>();
            services.AddSingleton<IJobTracker, JobTracker>();
            services.AddSingleton<IKustoQueryProvider, KustoQueryProvider>();
            services.AddSingleton<IStewardUserProvider, StewardUserProvider>();

            var pegasusProvider = PegasusCmsProvider.SetupPegasusCmsProvider(this.configuration, keyVaultProvider);
            services.AddSingleton<PegasusCmsProvider>(pegasusProvider);

            this.allServices = services;
        }

        /// <summary>
        ///     Configures the app.
        /// </summary>
        public void Configure(IApplicationBuilder applicationBuilder, IWebHostEnvironment webHostEnvironment, IApiVersionDescriptionProvider provider)
        {
            // initialize everything
            var initializeableServices = this.allServices.Where(s => typeof(IInitializeable).IsAssignableFrom(s.ServiceType));
            var initializationTasks = initializeableServices
                .Select(service => applicationBuilder.ApplicationServices.GetService(service.ServiceType))
                .Cast<IInitializeable>()
                .Select(s => s.InitializeAsync())
                .ToList();
            Task.WhenAll(initializationTasks).GetAwaiter().GetResult();

            if (webHostEnvironment.IsDevelopment())
            {
                applicationBuilder.UseDeveloperExceptionPage();
            }

            applicationBuilder.UseCors("CorsPolicy");
            applicationBuilder.UseMiddleware<EasyAuthSwaggerMiddleware>();
            applicationBuilder.UseSwagger();
            applicationBuilder.UseSwaggerUI(c =>
            {
                c.OAuthScopes(new[] { $"api://{this.configuration[ConfigurationKeyConstants.AzureClientId]}/api_access" });
                foreach (var description in provider.ApiVersionDescriptions.Reverse())
                {
                    c.SwaggerEndpoint(
                        $"/swagger/{description.GroupName}/swagger.json",
                        description.GroupName.ToUpperInvariant());
                }

                c.OAuthClientId(this.configuration[ConfigurationKeyConstants.AzureClientId]);
                c.OAuthScopeSeparator(" ");
                c.DocExpansion(Swashbuckle.AspNetCore.SwaggerUI.DocExpansion.None);
            });

            applicationBuilder.UseHttpsRedirection();
            applicationBuilder.UseAuthentication();
            applicationBuilder.UseRouting();
            applicationBuilder.UseAuthorization();

            applicationBuilder.Use(next => context =>
            {
                context.Request.EnableBuffering();
                return next(context);
            });

            applicationBuilder.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapHub<NotificationsHub>("/hubs/notifications");
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
