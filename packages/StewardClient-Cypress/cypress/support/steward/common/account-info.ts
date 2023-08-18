/** A single known user. */
export interface KnownUser {
  gtag?: string;
  xuid?: string;
  t10Id?: string;
  accountInfo: AccountInfo[];
  relatedXuids?;
  relatedConsoles?;
}

/** The account info to verify. */
export interface AccountInfo {
  //title: 'Woodstock' | 'Steelhead' | 'Sunrise' | 'Apollo' | 'Opus';
  title: 'FH5' | 'FM' | 'FH4' | 'FM7' | 'FH3';
  hasAccount: boolean;
}

const jordan: KnownUser = {
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
  relatedXuids: {
    FH5: ['2535424453525895'],
    FH4: ['2535435129485725', '2535471499352164', '2535424453525895'],
    FM7: ['2535435129485725', '2535424627138763', '2535467864609498'],
  },
  relatedConsoles: {
    FH5: ['17942604087340396005', '17942614470107700295', '17942578793090150565'],
    FH4: ['17942604087340396005', '17657759527483562068', '18230637609444823812'],
    FM7: ['18230637609444823812', '17942614470107700295'],
  },
};

const luke: KnownUser = {
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
  relatedXuids: {
    FH5: ['2535424453525895'],
    FH4: ['2535405314408422'],
    FM7: ['2535405314408422'],
  },
  relatedConsoles: {
    FH5: ['17942558415018055479', '18230640064596068933'],
    FH4: ['17942554844970616302', '17942598092927465652', '17657763114461563562'],
    FM7: ['17942598092927465652'],
  },
};

const chad: KnownUser = {
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
  relatedXuids: {
    FH5: ['2535414449518525', '2533274879135661'],
    FH4: ['2675352635783107', '2535434300327001'],
    FM7: ['2675352635783107', '2533274878971956', '2533274895523987'],
  },
  relatedConsoles: {
    FH5: ['17582067006214279393', '18230757851150134313', '17657699980770163455'],
    FH4: ['18230684556654040033', '17942463598587848313', '18230697602130888980'],
    FM7: ['17942578784821034417', '18230667492832029861', '17942454409269389163'],
  },
};

const madden: KnownUser = {
  gtag: 'R2Dubs',
  xuid: '2533274879135661',
  t10Id: undefined,
  accountInfo: [
    { title: 'FH5', hasAccount: true },
    { title: 'FM', hasAccount: true },
    { title: 'FH4', hasAccount: true },
    { title: 'FM7', hasAccount: true },
    { title: 'FH3', hasAccount: false },
  ],
  relatedXuids: {
    FH5: ['2533274798773995', '2533274803263397', '2533274810145297'],
    FH4: ['2533274879135661', '2535467864609498', '2535446403711265'],
    FM7: ['2533274879135661', '2535410010952080', '2535446801227106'],
  },
  relatedConsoles: {
    FH5: ['17582066429146533450', '17582067747176963427', '17582068820745506761'],
    FH4: ['18230573690869604875', '18230571459419353670', '18230610480804008032'],
    FM7: ['18230710337924350496', '18230735095813462951'],
  },
};

const ben: KnownUser = {
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
  relatedXuids: {
    FH5: [],
    FM7: ['2533274833661814'],
  },
  relatedConsoles: {
    FH5: ['17942620628388150154'],
    FM7: ['17942620628388150154'],
  },
};

const caleb: KnownUser = {
  gtag: '	2 Dev 046404329',
  xuid: '2814670801628842',
  t10Id: undefined,
  accountInfo: [
    { title: 'FH5', hasAccount: false },
    { title: 'FM', hasAccount: true },
    { title: 'FH4', hasAccount: false },
    { title: 'FM7', hasAccount: false },
    { title: 'FH3', hasAccount: false },
  ],
  relatedXuids: {},
  relatedConsoles: {},
};

const testing1: KnownUser = {
  gtag: 'T10LiveOpsTest1',
  xuid: '2535467621506171',
  t10Id: undefined,
  accountInfo: [
    { title: 'FH5', hasAccount: false },
    { title: 'FM', hasAccount: false },
    { title: 'FH4', hasAccount: false },
    { title: 'FM7', hasAccount: false },
    { title: 'FH3', hasAccount: false },
  ],
  relatedXuids: {},
  relatedConsoles: {},
};

export const AllKnownUsers: KnownUser[] = [jordan, luke, chad, madden, ben, testing1];

export const RetailUsers = {
  jordan,
  luke,
  chad,
  madden,
  ben,
  testing1,
};

export const StudioUsers = {
  caleb,
};
