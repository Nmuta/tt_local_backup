using System;
using System.Collections.Generic;
using System.Net;
using AutoMapper;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Identity.Web;
using Microsoft.OpenApi.Models;
using Turn10.Data.Azure;
using Turn10.Data.Common;
using Turn10.Data.Kusto;
using Turn10.LiveOps.StewardApi.Common;
using Turn10.LiveOps.StewardApi.Contracts.Apollo;
using Turn10.LiveOps.StewardApi.Contracts.Data;
using Turn10.LiveOps.StewardApi.Contracts.Gravity;
using Turn10.LiveOps.StewardApi.Contracts.Sunrise;
using Turn10.LiveOps.StewardApi.Filters;
using Turn10.LiveOps.StewardApi.Middleware;
using Turn10.LiveOps.StewardApi.ProfileMappers;
using Turn10.LiveOps.StewardApi.Providers;
using Turn10.LiveOps.StewardApi.Providers.Apollo;
using Turn10.LiveOps.StewardApi.Providers.Gravity;
using Turn10.LiveOps.StewardApi.Providers.Gravity.Settings;
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
    public sealed class Startup
    {
        private readonly IConfiguration configuration;

        /// <summary>
        ///     Initializes a new instance of the <see cref="Startup"/> class.
        /// </summary>
        /// <param name="configuration">The configuration.</param>
        public Startup(IConfiguration configuration)
        {
            this.configuration = configuration;
        }

        /// <summary>
        ///     Configures the services.
        /// </summary>
        /// <param name="services">The services.</param>
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddMicrosoftWebApiAuthentication(this.configuration);
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

            services.AddControllers().AddNewtonsoftJson();

            services.AddSwaggerGen(options =>
            {
                options.SwaggerDoc("v1", new OpenApiInfo
                {
                    Title = "Turn 10 Steward API",
                    Version = "v1",
                    Description = "Turn 10 Steward",
                    Contact = new Microsoft.OpenApi.Models.OpenApiContact
                    {
                        Email = "t10liveopstools@microsoft.com",
                        Name = "Turn 10 LiveOps Tools"
                    }
                });

                options.AddSecurityDefinition("bearer", new OpenApiSecurityScheme
                {
                    Type = SecuritySchemeType.Http,
                    BearerFormat = "JWT",
                    In = ParameterLocation.Header,
                    Scheme = "bearer"
                });

                options.OperationFilter<AuthorizationHeaderParameterOperationFilter>();
                options.OperationFilter<SessionIdHeaderParameterOperationFilter>();
            });

            services.AddCors(options =>
            {
                options.AddPolicy("CorsPolicy", builder => builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
            });

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
                mc.AllowNullCollections = true;
            });

            var mapper = mappingConfiguration.CreateMapper();
            services.AddSingleton(mapper);

            services.AddSingleton<IKeyVaultProvider, KeyVaultProvider>();

            services.AddSingleton<IConfiguration>(this.configuration);

            services.AddSingleton<IStsClient, StsClientWrapper>();

            services.AddSingleton<IGravityUserService, GravityUserServiceWrapper>();
            services.AddSingleton<IGravityUserInventoryService, GravityUserInventoryServiceWrapper>();
            services.AddSingleton<IGravityPlayerDetailsProvider, GravityPlayerDetailsProvider>();
            services.AddSingleton<IGravityPlayerInventoryProvider, GravityPlayerInventoryProvider>();
            services.AddSingleton<IRequestValidator<GravityPlayerInventory>, GravityPlayerInventoryRequestValidator>();
            services.AddSingleton<IGravityGiftHistoryProvider, GravityGiftHistoryProvider>();
            if (this.configuration[ConfigurationKeyConstants.GravitySandbox]
                .Equals("RETAIL", StringComparison.OrdinalIgnoreCase))
            {
                services.AddSingleton<ISettingsProvider, SettingsProviderProd>();
            }
            else
            {
                services.AddSingleton<ISettingsProvider, SettingsProviderDev>();
            }

            services.AddSingleton<ISunriseUserService, SunriseUserServiceWrapper>();
            services.AddSingleton<ISunriseEnforcementService, SunriseEnforcementServiceWrapper>();
            services.AddSingleton<ISunriseUserInventoryService, SunriseUserInventoryServiceWrapper>();
            services.AddSingleton<ISunriseGiftingService, SunriseGiftingServiceWrapper>();
            services.AddSingleton<ISunrisePlayerDetailsProvider, SunrisePlayerDetailsProvider>();
            services.AddSingleton<ISunrisePlayerInventoryProvider, SunrisePlayerInventoryProvider>();
            services.AddSingleton<IRequestValidator<SunrisePlayerInventory>, SunrisePlayerInventoryRequestValidator>();
            services.AddSingleton<IRequestValidator<SunriseBanParameters>, SunriseBanParametersRequestValidator>();
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
            services.AddSingleton<IRequestValidator<ApolloBanParameters>, ApolloBanParametersRequestValidator>();
            services.AddSingleton<IRequestValidator<ApolloPlayerInventory>, ApolloPlayerInventoryRequestValidator>();
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
        }

        /// <summary>
        ///     Configures the app.
        /// </summary>
        /// <param name="applicationBuilder">The application builder.</param>
        /// <param name="webHostEnvironment">The web host environment.</param>
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
