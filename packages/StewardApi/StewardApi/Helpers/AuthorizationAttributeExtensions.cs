using System.Collections;
using System.Collections.Generic;
using System.Linq;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Authorization;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;

namespace Turn10.LiveOps.StewardApi.Helpers
{
    /// <summary>
    ///     Contains assorted extension methods for types that utilize <see cref="AuthorizationAttribute"/>s.
    /// </summary>
    public static class AuthorizationAttributeExtensions
    {
        /// <summary>
        ///     Returns true if attribute list include the <see cref="UserAttribute.ManageStewardTeam"/> attribute.
        /// </summary>
        public static bool HasManageTeamAttribute(this IEnumerable<AuthorizationAttribute> attributes)
        {
            var manageTeamAttr = attributes.FirstOrDefault(attr => attr.Attribute == UserAttribute.ManageStewardTeam);
            return manageTeamAttr != null;
        }

        /// <summary>
        ///     Adds the <see cref="UserAttribute.ManageStewardTeam"/> attribute to attributes list.
        /// </summary>
        public static IList<AuthorizationAttribute> AddManageTeamAttribute(this IEnumerable<AuthorizationAttribute> attributes)
        {
            var attributesAsList = attributes.ToList();
            var manageTeamAttr = attributesAsList.FirstOrDefault(attr => attr.Attribute == UserAttribute.ManageStewardTeam);
            if (manageTeamAttr == null)
            {
                attributesAsList.Add(new AuthorizationAttribute()
                {
                    Attribute = UserAttribute.ManageStewardTeam,
                    Title = string.Empty,
                    Environment = string.Empty,
                });
            }

            return attributesAsList;
        }

        /// <summary>
        ///     Removes the <see cref="UserAttribute.ManageStewardTeam"/> attribute to attributes list.
        /// </summary>
        public static IList<AuthorizationAttribute> RemoveManageTeamAttribute(this IEnumerable<AuthorizationAttribute> attributes)
        {
            var attributesAsList = attributes.ToList();
            var manageTeamAttr = attributesAsList.FirstOrDefault(attr => attr.Attribute == UserAttribute.ManageStewardTeam);
            if (manageTeamAttr != null)
            {
                attributesAsList.Remove(manageTeamAttr);
            }

            return attributesAsList;
        }
    }
}
