#pragma warning disable SA1600 // ElementsMustBeDocumented (POCO mapped directly from LSP)
#pragma warning disable CS1591 // XML Comments (POCO mapped directly from LSP)
#pragma warning disable SA1516 // Blank Lines (POCO mapped directly from LSP)
#pragma warning disable SA1204 // Static elements should appear before instance elements
#pragma warning disable SA1402 // File may only contain a single type
using AdaptiveCards.Templating;
using System;
using System.Globalization;
using Turn10.LiveOps.StewardApi.Contracts.Common;

namespace Turn10.LiveOps.StewardApi.Contracts.MsTeams
{
    /// <summary>
    ///     Initializes a new instance of the <see cref="MsTeamsQuestion"/> class.
    /// </summary>
    public class MsTeamsQuestion
    {
        public string Question { get; set; }
    }

    /// <summary>
    ///     Extension helpers for the <see cref="MsTeamsQuestion"/> class.
    /// </summary>
    public static class MsTeamsQuestionExtensions
    {
        public static string ToMsTeamsAdaptiveCardJson(this MsTeamsQuestion question, StewardClaimsUser user)
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
                                    ""text"": ""Steward: Question"",
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
                                    ""text"": ""${question}"",
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
                Question = question.Question,
                CreatedDate = DateTime.UtcNow.ToString("R", new CultureInfo("en-US")),
            });
        }
    }
}