﻿using System.Collections.Generic;

namespace Turn10.LiveOps.StewardTest
{
    public static class TestConstants
    {
        public const string ArgumentOutOfRangeExceptionMessagePartial = "Specified argument was out of the range of valid values. (Parameter '{0} must be > {1}. {0} was {2}.')";
        public const string ArgumentNullExceptionMessagePartial = "Value cannot be null. (Parameter '{0}')";
        public const string ArgumentTooLongExceptionMessagePartial = "{0} cannot be longer than {1} characters.";
        public const string ArgumentDurationTooShortMessagePartial = "{0} cannot be less than {1}.";
        public const string ArgumentExceptionMissingSettingMessagePartial = "The following setting is required but is missing from the settings source: ";
        public const string ArgumentExceptionMissingSettingsMessagePartial = "The following settings are required and not found in the settings source: ";
        public const string BadHeaderStewardExceptionBadTitleMessagePartial = "Endpoint key designated for title: {0}, but expected {1}.";
        public const string BadHeaderStewardExceptionBadEndpointKeyMessagePartial = "Failed to parse key: {0} for title: {1}.";
        public const string NotImplementedMessage = "{0} not supported for {1}.";
        public const string TitleNotValidPartial = "{0} is not a valid title.";
        public const string EnvironmentNotValidPartial = "{0} is not a valid environment.";
        public const string Empty = "";
        public const string WhiteSpace = " ";
        public const int NegativeValue = -1;
        public const string TestCertificateString = "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";
        public const string TestRequestPath = "/test/path";
        public const string TestRequestHost = "localhost:12345";
        public const string TestRequestScheme = "https";
        public const string TestClientUri = "https://test.unit.net/stsclient";
        public const string GetSecretResult = "Test Key Vault Secret.";
        public const string InvalidGamertag = "Invalid Gamertag";
        public const string InvalidT10Id = "9876543210123456789";
        public const string InvalidAuthKey = "Bearer ThisIsNotAnApiKeyAtAll";
        public const ulong InvalidXuid = 9223372036854775799;
        public const ulong InvalidXuidBelow100 = 1;
        public const int InvalidProfileId = 987654321;
        public const int MaxLoopTimeInMilliseconds = 120000;
        public const int DefaultStartIndex = 0;
        public const int DefaultMaxResults = 100;
        public const int LiveOpsLeaderboardTalentedPlayersGroupId = 31;
        public const int InvalidGrouId = 99999;
        public const string ValidProductId = "9P2LBL48Q0LS";
        public const string InvalidExternalProfileId = "VeryRealExternalProfileId";
        public const string InvalidUgcId = "VeryRealUgcId";
        public const string InvalidUgcType = "VeryRealUgcType";
        public const string ValidCuratedUgcType = "Featured";
        public const string InvalidCuratedUgcType = "VeryRealCuratedUgcType";
        public const string ValidSharecode = "103756890";
        public const string InvalidSharecode = "VeryRealSharecode";
        public const string ValidLiveryUgcId = "4fcbe4e9-4dad-493c-ad08-3a4ab7ee3b0e";
        public const string ValidPhotoUgcId = "453f9135-6ac6-485e-a0cc-d3f1c11dc5d6";
        public const string ValidTuneBlobUgcId = "f20a984b-5e41-451d-8810-4c9a94581be5";
        public const string ValidLayerGroupUgcId = "13650d54-0ce8-4d97-b8b1-e7fe5d14728b";
        public const string ValidGameOptionsUgcId = "TempId";
        public const string ValidReplayUgcId = "cd957724-e560-418e-ae8d-199d5720fb34";
        public const string TestMessageOfTheDayId = "40b18822-eaa9-4c10-b468-b8460527c66b";
        public const string ValidTextTileId = "b1341039-313f-4f6a-a261-b7185f7177a0";
        public const string ValidWoodstockLiveryUgcId = "c5329e63-3c1f-4d60-b251-9e69cb2aeda7";

        // Test account, removed until we have valid test account setup
        public const ulong TestAccountXuid = 2535405314408422;
        public const string TestAccountGamertag = "testing 01001";
        public const string TestAccountExternalProfileId = "00000000-0000-0000-0000-000000000000";
        public const string TestAccountMessageId = "00000000-0000-0000-0000-000000000000";
        public const ulong TestAccountProfileId = 0000;
        public const string TestAccountKnownVin = "00000000-0000-0000-0000-000000000000";
        public const string TestAccountUgcId = "00000000-0000-0000-0000-000000000000";
        public static readonly string[] TestAccountTitlesOwned = { "FH", "FH2", "FH3", "FH4", "FH5", "FM2", "FM3", "FM4", "FM5", "FM6", "FM7" };
    }
}
