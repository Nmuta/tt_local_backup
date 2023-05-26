/** A single known user. */
export interface KnownUser {
  gtag?: string;
  xuid?: string;
  t10Id?: string;
  accountInfo: AccountInfo[];
}

/** The account info to verify. */
export interface AccountInfo {
  //title: 'Woodstock' | 'Steelhead' | 'Sunrise' | 'Apollo' | 'Opus';
  title: 'FH5' | 'FM' | 'FH4' | 'FM7' | 'FH3';
  hasAccount: boolean;
}

export const jordan: KnownUser = {
  gtag: 'FuriKuriFan5',
  xuid: '2535435129485725',
  t10Id: '2535435129485725',
  accountInfo: [
    { title: 'FH5', hasAccount: false },
    { title: 'FM', hasAccount: false },
    { title: 'FH4', hasAccount: true },
    { title: 'FM7', hasAccount: true },
    { title: 'FH3', hasAccount: false },
  ],
};

export const luke: KnownUser = {
  gtag: 'testing 01001',
  xuid: '2535405314408422',
  t10Id: undefined,
  accountInfo: [
    { title: 'FH5', hasAccount: true },
    { title: 'FM', hasAccount: false },
    { title: 'FH4', hasAccount: true },
    { title: 'FM7', hasAccount: true },
    { title: 'FH3', hasAccount: false },
  ],
};

export const chad: KnownUser = {
  gtag: 'Plink',
  xuid: '2675352635783107',
  t10Id: undefined,
  accountInfo: [
    { title: 'FH5', hasAccount: true },
    { title: 'FM', hasAccount: true },
    { title: 'FH4', hasAccount: true },
    { title: 'FM7', hasAccount: true },
    { title: 'FH3', hasAccount: true },
  ],
};

export const madden: KnownUser = {
  gtag: 'R2Dubs',
  xuid: '533274879135661',
  t10Id: undefined,
  accountInfo: [
    { title: 'FH5', hasAccount: true },
    { title: 'FM', hasAccount: true },
    { title: 'FH4', hasAccount: true },
    { title: 'FM7', hasAccount: true },
    { title: 'FH3', hasAccount: false },
  ],
};

export const ben: KnownUser = {
  gtag: 'Dinjambes',
  xuid: '2533274833661814',
  t10Id: undefined,
  accountInfo: [
    { title: 'FH5', hasAccount: true },
    { title: 'FM', hasAccount: false },
    { title: 'FH4', hasAccount: false },
    { title: 'FM7', hasAccount: true },
    { title: 'FH3', hasAccount: false },
  ],
};

export const AllKnownUsers: KnownUser[] = [jordan, luke, chad, madden, ben];
