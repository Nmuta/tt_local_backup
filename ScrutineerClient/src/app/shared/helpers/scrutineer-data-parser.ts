import { Injectable } from '@angular/core';

/* tslint:disable:no-bitwise */
export class ScrutineerDataParser {
    public convertDateString(dateString) {
        return dateString.replace('T', ' ').replace('Z', '');
    }

    public countryDict(country) {
        const dict = {};
        dict[0] = 'Unknown';
        dict[1] = 'United Arab Emirates';
        dict[2] = 'Albania';
        dict[3] = 'Armenia';
        dict[4] = 'Argentina';
        dict[5] = 'Austria';
        dict[6] = 'Australia';
        dict[7] = 'Azerbaijan';
        dict[8] = 'Belgium';
        dict[9] = 'Bulgaria';
        dict[10] = 'Bahrain';
        dict[11] = 'Brunei Darussalam';
        dict[12] = 'Bolivia';
        dict[13] = 'Brazil';
        dict[14] = 'Belarus';
        dict[15] = 'Belize';
        dict[16] = 'Canada';
        dict[18] = 'Switzerland';
        dict[19] = 'Chile';
        dict[20] = 'China';
        dict[21] = 'Colombia';
        dict[22] = 'Costa Rica';
        dict[23] = 'Czech Republic';
        dict[24] = 'Germany';
        dict[25] = 'Denmark';
        dict[26] = 'Dominican Republic';
        dict[27] = 'Algeria';
        dict[28] = 'Ecuador';
        dict[29] = 'Estonia';
        dict[30] = 'Egypt';
        dict[31] = 'Spain';
        dict[32] = 'Finland';
        dict[33] = 'Faroe Islands';
        dict[34] = 'France';
        dict[35] = 'United Kingdom';
        dict[36] = 'Georgia';
        dict[37] = 'Greece';
        dict[38] = 'Guatemala';
        dict[39] = 'Hong Kong';
        dict[40] = 'Honduras';
        dict[41] = 'Croatia';
        dict[42] = 'Hungary';
        dict[43] = 'Indonesia';
        dict[44] = 'Ireland';
        dict[45] = 'Israel';
        dict[46] = 'India';
        dict[47] = 'Iraq';
        dict[48] = 'Iran; Islamic Republic of';
        dict[49] = 'Iceland';
        dict[50] = 'Italy';
        dict[51] = 'Jamaica';
        dict[52] = 'Jordan';
        dict[53] = 'Japan';
        dict[54] = 'Kenya';
        dict[55] = 'Kyrgyzstan';
        dict[56] = 'Korea; Republic of';
        dict[57] = 'Kuwait';
        dict[58] = 'Kazakhstan';
        dict[59] = 'Lebanon';
        dict[60] = 'Liechtenstein';
        dict[61] = 'Lithuania';
        dict[62] = 'Luxembourg';
        dict[63] = 'Latvia';
        dict[64] = 'Libyan Arab Jamahiriya';
        dict[65] = 'Morocco';
        dict[66] = 'Monaco';
        dict[67] = 'Macedonia; the Former Yugoslav Republic of';
        dict[68] = 'Mongolia';
        dict[69] = 'Macao';
        dict[70] = 'Maldives';
        dict[71] = 'Mexico';
        dict[72] = 'Malaysia';
        dict[73] = 'Nicaragua';
        dict[74] = 'Netherlands';
        dict[75] = 'Norway';
        dict[76] = 'New Zealand';
        dict[77] = 'Oman';
        dict[78] = 'Panama';
        dict[79] = 'Peru';
        dict[80] = 'Philippines';
        dict[81] = 'Pakistan';
        dict[82] = 'Poland';
        dict[83] = 'Puerto Rico';
        dict[84] = 'Portugal';
        dict[85] = 'Paraguay';
        dict[86] = 'Qatar';
        dict[87] = 'Romania';
        dict[88] = 'Russian Federation';
        dict[89] = 'Saudi Arabia';
        dict[90] = 'Sweden';
        dict[91] = 'Singapore';
        dict[92] = 'Slovenia';
        dict[93] = 'Slovakia';
        dict[95] = 'El Salvador';
        dict[96] = 'Syrian Arab Republic';
        dict[97] = 'Thailand';
        dict[98] = 'Tunisia';
        dict[99] = 'Turkey';
        dict[100] = 'Trinidad and Tobago';
        dict[101] = 'Taiwan';
        dict[102] = 'Ukraine';
        dict[103] = 'United States';
        dict[104] = 'Uruguay';
        dict[105] = 'Uzbekistan';
        dict[106] = 'Venezuela';
        dict[107] = 'Vietnam';
        dict[108] = 'Yemen';
        dict[109] = 'South Africa';
        dict[110] = 'Zimbabwe';
        dict[111] = 'Afghanistan';
        dict[112] = 'American Samoa';
        dict[113] = 'Andorra';
        dict[114] = 'Angola';
        dict[115] = 'Anguilla';
        dict[116] = 'Antarctica';
        dict[117] = 'Antigua and Barbuda';
        dict[118] = 'Aruba';
        dict[119] = 'Bahamas';
        dict[120] = 'Bangladesh';
        dict[121] = 'Barbados';
        dict[122] = 'Benin';
        dict[123] = 'Bermuda';
        dict[124] = 'Bhutan';
        dict[125] = 'Bosnia and Herzegovina';
        dict[126] = 'Botswana';
        dict[127] = 'Burkina Faso';
        dict[128] = 'Burundi';
        dict[129] = 'Cambodia';
        dict[130] = 'Cameroon';
        dict[131] = 'Cape Verde';
        dict[132] = 'Cayman Islands';
        dict[133] = 'Central African Republic';
        dict[134] = 'Chad';
        dict[135] = 'Christmas Island';
        dict[136] = 'Cocos (Keeling) Islands';
        dict[137] = 'Comoros';
        dict[138] = 'Congo';
        dict[139] = 'Congo; the Democratic Republic of the';
        dict[140] = 'Cook Islands';
        dict[141] = 'Cote d\'Ivoire';
        dict[142] = 'Cyprus';
        dict[143] = 'Djibouti';
        dict[144] = 'Dominica';
        dict[146] = 'Equatorial Guinea';
        dict[147] = 'Eritrea';
        dict[148] = 'Ethiopia';
        dict[149] = 'Falkland Islands (Malvinas)';
        dict[150] = 'Fiji';
        dict[151] = 'French Guiana';
        dict[152] = 'French Polynesia';
        dict[153] = 'Gabon';
        dict[154] = 'Gambia';
        dict[155] = 'Ghana';
        dict[156] = 'Gibraltar';
        dict[157] = 'Greenland';
        dict[158] = 'Grenada';
        dict[159] = 'Guadeloupe';
        dict[160] = 'Guam';
        dict[161] = 'Guernsey';
        dict[162] = 'Guinea';
        dict[163] = 'Guinea-Bissau';
        dict[164] = 'Guyana';
        dict[165] = 'Haiti';
        dict[166] = 'Jersey';
        dict[167] = 'Kiribati';
        dict[168] = 'Lao Peoples Democratic Republic';
        dict[169] = 'Lesotho';
        dict[170] = 'Liberia';
        dict[171] = 'Madagascar';
        dict[172] = 'Malawi';
        dict[173] = 'Mali';
        dict[174] = 'Malta';
        dict[175] = 'Marshall Islands';
        dict[176] = 'Martinique';
        dict[177] = 'Mauritania';
        dict[178] = 'Mauritius';
        dict[179] = 'Mayotte';
        dict[180] = 'Micronesia';
        dict[181] = 'Moldova';
        dict[182] = 'Montenegro';
        dict[183] = 'Montserrat';
        dict[184] = 'Mozambique';
        dict[185] = 'Myanmar';
        dict[186] = 'Namibia';
        dict[187] = 'Nauru';
        dict[188] = 'Nepal';
        dict[189] = 'Netherlands Antilles';
        dict[190] = 'New Caledonia';
        dict[191] = 'Niger';
        dict[192] = 'Nigeria';
        dict[193] = 'Niue';
        dict[194] = 'Norfolk Island';
        dict[195] = 'Northern Mariana Islands';
        dict[196] = 'Palau';
        dict[197] = 'Palestinian Territory';
        dict[198] = 'Papua New Guinea';
        dict[199] = 'Pitcairn';
        dict[200] = 'Reunion';
        dict[201] = 'Rwanda';
        dict[202] = 'Samoa';
        dict[203] = 'San Marino';
        dict[204] = 'Sao Tome and Principe';
        dict[205] = 'Senegal';
        dict[206] = 'Serbia';
        dict[207] = 'Seychelles';
        dict[208] = 'Sierra Leone';
        dict[209] = 'Solomon Islands';
        dict[210] = 'Somalia';
        dict[211] = 'Sri Lanka';
        dict[212] = 'Saint Helena Ascension and Tristan da Cunha';
        dict[213] = 'Saint Kitts and Nevis';
        dict[214] = 'Saint Lucia';
        dict[215] = 'Saint Pierre and Miquelon';
        dict[216] = 'Saint Vincent and the Grenadines';
        dict[217] = 'Suriname';
        dict[218] = 'Swaziland';
        dict[219] = 'Tajikistan';
        dict[220] = 'Tanzania';
        dict[221] = 'Timor-Leste';
        dict[222] = 'Togo';
        dict[223] = 'Tokelau';
        dict[224] = 'Tonga';
        dict[225] = 'Turkmenistan';
        dict[226] = 'Turks and Caicos Islands';
        dict[227] = 'Tuvalu';
        dict[228] = 'Uganda';
        dict[229] = 'Vanuatu';
        dict[230] = 'Vatican City';
        dict[231] = 'U.S. Virgin Islands';
        dict[232] = 'British Virgin Islands';
        dict[233] = 'Wallis and Futuna';
        dict[234] = 'Western Sahara';
        dict[235] = 'Zambia';
        return dict[country];
    }
    public ageGroupDict(age: any) {
        const dict = { };
        dict[0] = 'Child';
        dict[1] = 'Teen';
        dict[2] = 'Adult';
        return dict[age];
    }
    public regionDict(region: any) {
        const dict = { };
        dict[1] = 'TheAmericas';
        dict[2] = 'Europe';
        dict[3] = 'AsiaAustraliaAndNz';
        dict[4] = 'Africa';
        return dict[region];
    }
    public regionDictFM7(region: any) {
        const dict = { };
        dict[-1] = 'Invalid';
        dict[0] = 'Rest of World';
        dict[1] = 'China';
        return dict[region];
    }
    public lcid(lcid: any) {
        const dict = { };
        dict[1] = 'Arabic';
        dict[2] = 'Bulgarian';
        dict[3] = 'Catalan';
        dict[4] = 'Chinese';
        dict[5] = 'Czech';
        dict[6] = 'Danish';
        dict[7] = 'German';
        dict[8] = 'Greek';
        dict[9] = 'English';
        dict[10] = 'Spanish';
        dict[11] = 'Finnish';
        dict[12] = 'French';
        dict[13] = 'Hebrew';
        dict[14] = 'Hungarian';
        dict[15] = 'Icelandic';
        dict[16] = 'Italian';
        dict[17] = 'Japanese';
        dict[18] = 'Korean';
        dict[19] = 'Dutch';
        dict[20] = 'Norwegian';
        dict[21] = 'Polish';
        dict[22] = 'Portuguese';
        // 23 does not exist
        dict[24] = 'Romanian';
        dict[25] = 'Russian';
        dict[26] = 'Serbo-Croatian';
        dict[27] = 'Slovak';
        dict[28] = 'Albanian';
        dict[29] = 'Swedish';
        dict[30] = 'Thai';
        dict[31] = 'Turkish';
        dict[32] = 'Urdu';
        dict[33] = 'Indonesian';
        dict[34] = 'Ukrainian';
        dict[35] = 'Belorussian';
        dict[36] = 'Slovenian';
        dict[37] = 'Estonian';
        dict[38] = 'Latvian';
        dict[39] = 'Lithuanian';
        // 40 does not exist
        dict[41] = 'Farsi';
        dict[42] = 'Vietnamese';
        dict[43] = 'Armenian';
        dict[44] = 'Azeri';
        dict[45] = 'Basque';
        // 46 does not exist
        dict[47] = 'Macedonian';
        // 48-54 don't exist
        dict[55] = 'Georgian';
        dict[56] = 'Faeroese';
        dict[57] = 'Hindi';
        // 58-61 don't exist
        dict[62] = 'Malay';
        // 63-64 don't exist
        dict[65] = 'Swahili';
        // 66 does not exist
        dict[67] = 'Uzbek';
        dict[68] = 'Tatar';
        dict[69] = 'Bengali';
        dict[70] = 'Punjabi';
        dict[71] = 'Gujarati';
        dict[72] = 'Oriya';
        dict[73] = 'Tamil';
        dict[74] = 'Telugu';
        dict[75] = 'Kannada';
        dict[76] = 'Malayalam';
        dict[77] = 'Assamese';
        dict[78] = 'Marathi';
        dict[79] = 'Sanskrit';
        // 80-86 do not exist
        dict[87] = 'Konkani';
        dict[88] = 'Manipuri';
        dict[89] = 'Sindhi';
        // 90-95 do not exist
        dict[96] = 'Kashmiri';
        dict[97] = 'Nepalese';
        dict[1025] = 'Arabic (Saudi Arabia)';
        dict[1026] = 'Bulgarian';
        dict[1027] = 'Catalan';
        dict[1028] = 'Chinese (Taiwan)';
        dict[1029] = 'Czech';
        dict[1030] = 'Danish';
        dict[1031] = 'German (Germany)';
        dict[1032] = 'Greek';
        dict[1033] = 'English (U.S.)';
        dict[1034] = 'Spanish (Spain-Traditional Sort)';
        dict[1035] = 'Finnish';
        dict[1036] = 'French (France)';
        dict[1037] = 'Hebrew';
        dict[1038] = 'Hungarian';
        dict[1039] = 'Icelandic';
        dict[1040] = 'Italian (Italy)';
        dict[1041] = 'Japanese';
        dict[1042] = 'Korean';
        dict[1043] = 'Dutch (Netherlands)';
        dict[1044] = 'Norwegian (Bokmal)';
        dict[1045] = 'Polish';
        dict[1046] = 'Portuguese (Brazil)';
        dict[1047] = 'Rhaeto-Romanic';
        dict[1048] = 'Romanian (Romania)';
        dict[1049] = 'Russian (Russia)';
        dict[1050] = 'Croatian';
        dict[1051] = 'Slovak';
        dict[1052] = 'Albanian';
        dict[1053] = 'Swedish (Sweden)';
        dict[1054] = 'Thai';
        dict[1055] = 'Turkish';
        dict[1056] = 'Urdu';
        dict[1057] = 'Indonesian';
        dict[1058] = 'Ukrainian';
        dict[1059] = 'Belarusian';
        dict[1060] = 'Slovenian';
        dict[1061] = 'Estonian';
        dict[1062] = 'Latvian';
        dict[1063] = 'Lithuanian';
        dict[1064] = 'Tajik';
        dict[1065] = 'Farsi';
        dict[1066] = 'Vietnamese';
        dict[1067] = 'Armenian';
        dict[1068] = 'Azeri (Latin)';
        dict[1069] = 'Basque';
        dict[1070] = 'Sorbian';
        dict[1071] = 'FYRO Macedonian';
        dict[1072] = 'Sutu';
        dict[1073] = 'Tsonga';
        dict[1074] = 'Tswana';
        dict[1075] = 'Venda';
        dict[1076] = 'Xhosa';
        dict[1077] = 'Zulu';
        dict[1078] = 'Afrikaans';
        dict[1079] = 'Georgian';
        dict[1080] = 'Faeroese';
        dict[1081] = 'Hindi';
        dict[1082] = 'Maltese';
        dict[1083] = 'Sami (Lappish)';
        dict[1084] = 'Gaelic (Scotland)';
        dict[1085] = 'Yiddish';
        dict[1086] = 'Malay';
        dict[1087] = 'Kazakh';
        dict[1088] = 'Kyrgyz';
        dict[1089] = 'Swahili';
        dict[1090] = 'Turkmen';
        dict[1091] = 'Uzbek (Latin)';
        dict[1092] = 'Tatar';
        dict[1093] = 'Bengali';
        dict[1094] = 'Punjabi';
        dict[1095] = 'Gujarati';
        dict[1096] = 'Oriya';
        dict[1097] = 'Tamil';
        dict[1098] = 'Telugu';
        dict[1099] = 'Kannada';
        dict[1100] = 'Malayalam';
        dict[1101] = 'Assamese';
        dict[1102] = 'Marathi';
        dict[1103] = 'Sanskrit';
        dict[1104] = 'Mongolian';
        dict[1105] = 'Tibetan (PRC)';
        dict[1106] = 'Welsh';
        dict[1107] = 'Khmer';
        dict[1108] = 'Lao';
        dict[1109] = 'Burmese';
        dict[1110] = 'Galician';
        dict[1111] = 'Konkani';
        dict[1112] = 'Manipuri';
        dict[1113] = 'Sindhi (Devanagari)';
        dict[1114] = 'Syriac';
        dict[1115] = 'Sinhalese';
        dict[1116] = 'Cherokee';
        dict[1117] = 'Inuktitut';
        dict[1118] = 'Amharic';
        dict[1119] = 'Tamazight';
        dict[1120] = 'Kashmiri (Arabic)';
        dict[1121] = 'Nepali';
        dict[1122] = 'Frisian (Netherlands)';
        dict[1123] = 'Pashto';
        dict[1124] = 'Filipino';
        dict[1125] = 'Divehi';
        dict[1126] = 'Edo';
        dict[1127] = 'Fulfulde';
        dict[1128] = 'Hausa';
        dict[1129] = 'Ibibio';
        dict[1130] = 'Yoruba';
        dict[1131] = 'Quechua (Bolivia)';
        dict[1132] = 'Sepedi';
        dict[1133] = 'Bashkir (Russia)';
        dict[1134] = 'Luxembourgish (Luxembourg)';
        dict[1135] = 'Greenlandic (Greenland)';
        dict[1136] = 'Igbo';
        dict[1137] = 'Kanuri';
        dict[1138] = 'Oromo';
        dict[1139] = 'Tigrigna (Ethiopia)';
        dict[1140] = 'Guarani';
        dict[1141] = 'Hawaiian';
        dict[1142] = 'Latin';
        dict[1143] = 'Somali';
        dict[1144] = 'Yi';
        dict[1145] = 'Papiamentu';
        dict[1146] = 'Mapudungun (Chile)';
        dict[1148] = 'Mohawk (Mohawk)';
        dict[1150] = 'Breton (France)';
        dict[1152] = 'Uyghur (PRC)';
        dict[1153] = 'Maori';
        dict[1154] = 'Occitan (France)';
        dict[1155] = 'Corsican (France)';
        dict[1156] = 'Alsatian (France)';
        dict[1157] = 'Yakut (Russia)';
        dict[1158] = 'K\'iche (Guatemala)';
        dict[1159] = 'Kinyarwanda (Rwanda)';
        dict[1160] = 'Wolof (Senegal)';
        dict[1164] = 'Dari (Afghanistan)';
        dict[1169] = 'Scottish Gaelic (United Kingdom)';
        dict[2049] = 'Arabic (Iraq)';
        dict[2052] = 'Chinese (PRC)';
        dict[2055] = 'German (Switzerland)';
        dict[2057] = 'English (U.K.)';
        dict[2058] = 'Spanish (Mexico)';
        dict[2060] = 'French (Belgium)';
        dict[2064] = 'Italian (Switzerland)';
        dict[2067] = 'Dutch (Belgium)';
        dict[2068] = 'Norwegian (Nynorsk)';
        dict[2070] = 'Portuguese (Portugal)';
        dict[2072] = 'Romanian (Moldova)';
        dict[2073] = 'Russian (Moldova)';
        dict[2074] = 'Serbian (Latin)';
        dict[2077] = 'Swedish (Finland)';
        dict[2092] = 'Azeri (Cyrillic)';
        dict[2094] = 'Lower Sorbian (Germany)';
        dict[2107] = 'Sami, Northern (Sweden)';
        dict[2108] = 'Gaelic (Ireland)';
        dict[2110] = 'Malay (Brunei Darussalam)';
        dict[2115] = 'Uzbek (Cyrillic)';
        dict[2117] = 'Bengali (Bangladesh)';
        dict[2118] = 'Punjabi (Pakistan)';
        dict[2128] = 'Mongolian (Mongolian)';
        dict[2129] = 'Tibetan (Bhutan)';
        dict[2137] = 'Sindhi (Arabic)';
        dict[2141] = 'Inuktitut (Latin, Canada)';
        dict[2143] = 'Tamazight (Latin)';
        dict[2144] = 'Kashmiri';
        dict[2145] = 'Nepali (India)';
        dict[2155] = 'Quechua (Ecuador)';
        dict[2163] = 'Tigrigna (Eritrea)';
        dict[3073] = 'Arabic (Egypt)';
        dict[3076] = 'Chinese (Hong Kong S.A.R.)';
        dict[3079] = 'German (Austria)';
        dict[3081] = 'English (Australia)';
        dict[3082] = 'Spanish (Spain-Modern Sort)';
        dict[3084] = 'French (Canada)';
        dict[3098] = 'Serbian (Cyrillic)';
        dict[3131] = 'Sami, Northern (Finland)';
        dict[3179] = 'Quechua (Peru)';
        dict[4097] = 'Arabic (Libya)';
        dict[4100] = 'Chinese (Singapore)';
        dict[4103] = 'German (Luxembourg)';
        dict[4105] = 'English (Canada)';
        dict[4106] = 'Spanish (Guatemala)';
        dict[4108] = 'French (Switzerland)';
        dict[4122] = 'Croatian (Latin, Bosnia and Herzegovina)';
        dict[4155] = 'Sami, Lule (Norway)';
        dict[5121] = 'Arabic (Algeria)';
        dict[5124] = 'Chinese (Macao S.A.R.)';
        dict[5127] = 'German (Liechtenstein)';
        dict[5129] = 'English (New Zealand)';
        dict[5130] = 'Spanish (Costa Rica)';
        dict[5132] = 'French (Luxembourg)';
        dict[5146] = 'Bosnian (Latin, Bosnia and Herzegovina)';
        dict[5179] = 'Sami, Lule (Sweden)';
        dict[6145] = 'Arabic (Morocco)';
        dict[6153] = 'English (Ireland)';
        dict[6154] = 'Spanish (Panama)';
        dict[6156] = 'French (Monaco)';
        dict[6170] = 'Serbian (Latin, Bosnia and Herzegovina)';
        dict[6203] = 'Sami, Southern (Norway)';
        dict[7169] = 'Arabic (Tunisia)';
        dict[7177] = 'English (South Africa)';
        dict[7178] = 'Spanish (Dominican Republic)';
        dict[7180] = 'French (West Indies)';
        dict[7194] = 'Serbian (Cyrillic, Bosnia and Herzegovina)';
        dict[7227] = 'Sami, Southern (Sweden)';
        dict[8193] = 'Arabic (Oman)';
        dict[8201] = 'English (Jamaica)';
        dict[8202] = 'Spanish (Venezuela)';
        dict[8204] = 'French (Reunion)';
        dict[8218] = 'Bosnian (Cyrillic, Bosnia and Herzegovina)';
        dict[8251] = 'Sami, Skolt (Finland)';
        dict[9217] = 'Arabic (Yemen)';
        dict[9225] = 'English (Caribbean)';
        dict[9226] = 'Spanish (Colombia)';
        dict[9228] = 'French (Congo (DRC))';
        dict[9242] = 'Serbian (Latin, Serbia)';
        dict[9275] = 'Sami, Inari (Finland)';
        dict[10241] = 'Arabic (Syria)';
        dict[10249] = 'English (Belize)';
        dict[10250] = 'Spanish (Peru)';
        dict[10252] = 'French (Senegal)';
        dict[10266] = 'Serbian (Cyrillic, Serbia)';
        dict[11265] = 'Arabic (Jordan)';
        dict[11273] = 'English (Trinidad and Tobago)';
        dict[11274] = 'Spanish (Argentina)';
        dict[11276] = 'French (Cameroon)';
        dict[11290] = 'Serbian (Latin, Montenegro)';
        dict[12289] = 'Arabic (Lebanon)';
        dict[12297] = 'English (Zimbabwe)';
        dict[12298] = 'Spanish (Ecuador)';
        dict[12300] = 'French (Cote d\'Ivoire)';
        dict[12314] = 'Serbian (Cyrillic, Montenegro)';
        dict[13313] = 'Arabic (Kuwait)';
        dict[13321] = 'English (Philippines)';
        dict[13322] = 'Spanish (Chile)';
        dict[13324] = 'French (Mali)';
        dict[14337] = 'Arabic (U.A.E)';
        dict[14345] = 'English (Indonesia)';
        dict[14346] = 'Spanish (Uruguay)';
        dict[14348] = 'French (Morocco)';
        dict[15361] = 'Arabic (Bahrain)';
        dict[15369] = 'English (Hong Kong S.A.R.)';
        dict[15370] = 'Spanish (Paraguay)';
        dict[15372] = 'French (Haiti)';
        dict[16385] = 'Arabic (Qatar)';
        dict[16393] = 'English (India)';
        dict[16394] = 'Spanish (Bolivia)';
        dict[17417] = 'English (Malaysia)';
        dict[17418] = 'Spanish (El Salvador)';
        dict[18441] = 'English (Singapore)';
        dict[18442] = 'Spanish (Honduras)';
        dict[19466] = 'Spanish (Nicaragua)';
        dict[20490] = 'Spanish (Puerto Rico)';
        dict[21514] = 'Spanish (United States)';
        return dict[lcid];
    }

    public parseFlags(input) {
        const flags = {
            Turn10Employee: 1 << 0,
            VIP: 1 << 1,
            Whitelist: 1 << 2,
            CommunityManager: 1 << 3,
            UltimateVIP: 1 << 4
        };
        const returnFlags = [];
        if (input & flags.Turn10Employee) {
            returnFlags.push('Turn10Employee');
        }
        if (input & flags.VIP) {
            returnFlags.push('VIP');
        }
        if (input & flags.Whitelist) {
            returnFlags.push('Whitelist');
        }
        if (input & flags.CommunityManager) {
            returnFlags.push('CommunityManager');
        }
        if (input & flags.UltimateVIP) {
            returnFlags.push('UltimateVIP');
        }
        if (returnFlags.length === 0) {
            returnFlags.push('No Flags');
        }

        return returnFlags.join(', ');
    }
}

@Injectable()
export class MockScrutineerDataParser {
    public copyMessage = jasmine.createSpy('copyMessage');
}

export function createMockScrutineerDataParser() {
    return {
        provide: ScrutineerDataParser,
        useValue: new MockScrutineerDataParser()
    };
}
