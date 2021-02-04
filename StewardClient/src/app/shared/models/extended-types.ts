// TODO: Revert or Expand: GuidLikeString, T10IdString, GamertagString typings (https://dev.azure.com/t10motorsport/Motorsport/_workitems/edit/640494)

/** For strings that look like guids. */
export type GuidLikeString = string;

/** For Xuids that are strings. */
export type XuidString = string;

/** Turn 10 IDs can be either a xuid or a guid-like-string. */
export type T10IdString = XuidString | GuidLikeString;

/** For typing Gamertag strings. */
export type GamertagString = string;
