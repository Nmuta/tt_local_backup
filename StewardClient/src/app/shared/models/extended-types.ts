/** For strings that look like guids. */
export type GuidLikeString = string;

/** For Xuids that are strings. */
export type XuidString = string;

/** Turn 10 IDs can be either a xuid or a guid-like-string. */
export type Turn10IdString = XuidString | GuidLikeString;

/** For typing Gamertag strings. */
export type GamertagString = string;