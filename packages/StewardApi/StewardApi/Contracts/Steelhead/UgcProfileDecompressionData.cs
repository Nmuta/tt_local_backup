﻿namespace Turn10.LiveOps.StewardApi.Contracts.Steelhead
{
    public class UgcProfileDecompressionData
    {
        public bool CompressedDataLengthIsValid { get; set; }

        public bool UncompressedDataLengthIsValid { get; set; }

        public uint ExpectedCompressedDataLength { get; set; }

        public uint ExpectedUncompressedDataLength { get; set; }

        public uint ActualCompressedDataLength { get; set; }

        public uint ActualUncompressedDataLength { get; set; }
    }
}
