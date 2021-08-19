/** A single known user. */
export interface KnownUser {
  gtag?: string;
  xuid?: string;
  t10Id?: string;
  accountInfo: AccountInfo[];
}

/** The account info to verify. */
export interface AccountInfo {
  title: 'Woodstock' | 'Steelhead' | 'Gravity' | 'Sunrise' | 'Apollo' | 'Opus';
  hasAccount: boolean;
}

export const emerson: KnownUser = {
  gtag: 'SublimeEther',
  xuid: '2533274814787919',
  t10Id: undefined,
  accountInfo: [
    { title: 'Woodstock', hasAccount: false },
    { title: 'Steelhead', hasAccount: false },
    { title: 'Gravity', hasAccount: true },
    { title: 'Sunrise', hasAccount: true },
    { title: 'Apollo', hasAccount: true },
    { title: 'Opus', hasAccount: true },
  ],
};

export const jordan: KnownUser = {
  gtag: 'FuriKuriFan5',
  xuid: '2535435129485725',
  t10Id: '2535435129485725',
  accountInfo: [
    { title: 'Woodstock', hasAccount: false },
    { title: 'Steelhead', hasAccount: false },
    { title: 'Gravity', hasAccount: true },
    { title: 'Sunrise', hasAccount: true },
    { title: 'Apollo', hasAccount: true },
    { title: 'Opus', hasAccount: false },
  ],
};
