using System;
using System.Globalization;
using AdaptiveCards.Templating;
using Turn10.LiveOps.StewardApi.Contracts.Common;

#pragma warning disable SA1600 // ElementsMustBeDocumented (POCO mapped directly from LSP)
#pragma warning disable CS1591 // XML Comments (POCO mapped directly from LSP)
#pragma warning disable SA1516 // Blank Lines (POCO mapped directly from LSP)
#pragma warning disable SA1204 // Static elements should appear before instance elements
#pragma warning disable SA1402 // File may only contain a single type

namespace Turn10.LiveOps.StewardApi.Contracts.MsTeams
{
    /// <summary>
    ///     Initializes a new instance of the <see cref="MsTeamsPermissionRequest"/> class.
    /// </summary>
    public class MsTeamsPermissionRequest
    {
        public string Permission { get; set; }

        public string Titles { get; set; }

        public string Environments { get; set; }

        public string Justification { get; set; }
    }

    /// <summary>
    ///     Extension helpers for the <see cref="MsTeamsPermissionRequest"/> class.
    /// </summary>
    public static class MsTeamsPermissionRequestExtensions
    {
        /// <summary>
        ///     Generates JSON to create MS Teams adaptive card for a permission request
        /// </summary>
        public static string ToMsTeamsAdaptiveCardJson(this MsTeamsPermissionRequest permissionRequest, StewardClaimsUser user)
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
                                    ""text"": ""Steward: Permission(s) Request"",
                                    ""weight"": ""Bolder"",
                                    ""size"": ""ExtraLarge""
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
                                    ""type"": ""TextBlock"",
                                    ""text"": ""Permission(s) Needed"",
                                    ""wrap"": true,
                                    ""weight"": ""Bolder"",
                                    ""size"": ""Large""
                                },
                                {   
                                    ""type"": ""TextBlock"",
                                    ""text"": ""${permission}"",
                                    ""wrap"": true
                                },
                                {
                                    ""type"": ""TextBlock"",
                                    ""text"": ""Title(s)"",
                                    ""wrap"": true,
                                    ""weight"": ""Bolder"",
                                    ""size"": ""Large""
                                },
                                {   
                                    ""type"": ""TextBlock"",
                                    ""text"": ""${titles}"",
                                    ""wrap"": true
                                },
                                {
                                    ""type"": ""TextBlock"",
                                    ""text"": ""Environment(s)"",
                                    ""wrap"": true,
                                    ""weight"": ""Bolder"",
                                    ""size"": ""Large""
                                },
                                {   
                                    ""type"": ""TextBlock"",
                                    ""text"": ""${environments}"",
                                    ""wrap"": true
                                },
                                {
                                    ""type"": ""TextBlock"",
                                    ""text"": ""Business Justification"",
                                    ""wrap"": true,
                                    ""weight"": ""Bolder"",
                                    ""size"": ""Large""
                                },
                                {
                                    ""type"": ""TextBlock"",
                                    ""text"": ""${justification}"",
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

            AdaptiveCardTemplate template = new AdaptiveCardTemplate(cardSchema);
            return template.Expand(new
            {
                UserId = user.ObjectId,
                Name = user.Name,
                Email = user.EmailAddress,
                Permission = permissionRequest?.Permission,
                Titles = permissionRequest?.Titles,
                Environments = permissionRequest?.Environments,
                Justification = permissionRequest?.Justification,
                CreatedDate = DateTime.UtcNow.ToString("R", new CultureInfo("en-US")),
            });
        }
    }
}
