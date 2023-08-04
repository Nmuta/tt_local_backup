#pragma warning disable SA1600 // ElementsMustBeDocumented (POCO mapped directly from LSP)
#pragma warning disable CS1591 // XML Comments (POCO mapped directly from LSP)
#pragma warning disable SA1516 // Blank Lines (POCO mapped directly from LSP)
#pragma warning disable SA1204 // Static elements should appear before instance elements
#pragma warning disable SA1402 // File may only contain a single type
using AdaptiveCards.Templating;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Globalization;
using Turn10.LiveOps.StewardApi.Contracts.Common;

namespace Turn10.LiveOps.StewardApi.Contracts.MsTeams
{
    /// <summary>
    ///     Initializes a new instance of the <see cref="MsTeamsFeatureRequest"/> class.
    /// </summary>
    public class MsTeamsFeatureRequest
    {
        public string Title { get; set; }

        public string Description { get; set; }

        public bool IsBusinessCritital { get; set; }

        public string InternalImpact { get; set; }

        public string ExternalImpact { get; set; }
    }

    /// <summary>
    ///     Extension helpers for the <see cref="MsTeamsFeatureRequest"/> class.
    /// </summary>
    public static class MsTeamsFeatureRequestExtensions
    {
        public static string ToMsTeamsAdaptiveCardJson(this MsTeamsFeatureRequest featureRequest, StewardClaimsUser user)
        {
            // Adaptive Card Designer: https://adaptivecards.io/designer/
            var cardSchema = @"{
            ""type"":""message"",
            ""attachments"":[{
                  ""contentType"": ""application/vnd.microsoft.card.adaptive"",
                  ""content"": {
                    ""$schema"": ""http://adaptivecards.io/schemas/adaptive-card.json"",
                    ""type"": ""AdaptiveCard"",
                    ""version"": ""1.5"",
                    ""body"": [
                        {
                            ""type"": ""Container"",
                            ""items"": [
                                {
                                    ""type"": ""TextBlock"",
                                    ""text"": ""To follow this thread and get notifications, post a reply below"",
                                    ""weight"": ""Bolder"",
                                    ""size"": ""Small""
                                },
                                {
                                    ""type"": ""TextBlock"",
                                    ""text"": ""Steward: Feature Request"",
                                    ""weight"": ""Bolder"",
                                    ""size"": ""ExtraLarge""
                                },
                                {   
                                    ""type"": ""TextBlock"",
                                    ""text"": ""${title}"",
                                    ""wrap"": true
                                },
                                {
                                    ""type"": ""FactSet"",
                                    ""facts"": [
                                        {
                                            ""title"": ""Created By"",
                                            ""value"": ""<at>${name}</at>""
                                        },
                                        {
                                            ""title"": ""Created Date:"",
                                            ""value"": ""${createdDate}""
                                        },
                                    ]
                                }
                            ]
                        },
                        {
                            ""type"": ""Container"",
                            ""items"": [
                                {
                                    ""type"": ""FactSet"",
                                    ""facts"": [
                                        {
                                            ""title"": ""Is Business Critical:"",
                                            ""value"": ""${isBusinessCritical}""
                                        },
                                        {
                                            ""title"": ""Internal Impact:"",
                                            ""value"": ""${internalImpact}""
                                        },
                                        {
                                            ""title"": ""External Impact:"",
                                            ""value"": ""${externalImpact}""
                                        },
                                    ]
                                },
                                {
                                    ""type"": ""TextBlock"",
                                    ""text"": ""Description"",
                                    ""wrap"": true,
                                    ""weight"": ""Bolder"",
                                    ""size"": ""Large""
                                },
                                {
                                    ""type"": ""TextBlock"",
                                    ""text"": ""${description}"",
                                    ""wrap"": true
                                },
                            ]
                        }
                    ],
                    ""msteams"": {
                        ""width"": ""Full"",
                        ""entities"": [
                            {
                                ""type"": ""mention"",
                                ""text"": ""<at>${name}</at>"",
                                ""mentioned"": {
                                    ""id"": ""${userId}"",
                                    ""name"": ""${name}""
                                    }
                            }]
                    }
                }
            }]}";

            var template = new AdaptiveCardTemplate(cardSchema);
            return template.Expand(new
            {
                UserId = user.ObjectId,
                Name = user.Name,
                Email = user.EmailAddress,
                Title = featureRequest.Title,
                IsBusinessCritical = featureRequest.IsBusinessCritital ? "Yes" : "No",
                InternalImpact = featureRequest.InternalImpact,
                ExternalImpact = featureRequest.ExternalImpact,
                Description = featureRequest.Description,
                CreatedDate = DateTime.UtcNow.ToString("R", new CultureInfo("en-US")),
            });
        }
    }
}