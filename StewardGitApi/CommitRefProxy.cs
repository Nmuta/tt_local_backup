#pragma warning disable SA1600 // Elements should be documented

using Microsoft.TeamFoundation.SourceControl.WebApi;

namespace StewardGitApi
{
    /// <summary>
    ///     A simple way to represent commits.
    /// </summary>
    public class CommitRefProxy
    {
        public string CommitComment { get; set; }

        public string PathToFile { get; init; }

        public string NewFileContent { get; init; }

        public VersionControlChangeType VersionControlChangeType { get; init; }

        /// <summary>
        ///     Factory creation.
        /// </summary>
        public static CommitRefProxy Create(
            string commitComment,
            string pathToFile,
            string newFileContent,
            VersionControlChangeType versionControlChangeType = VersionControlChangeType.Edit)
        {
            return new CommitRefProxy()
            {
                CommitComment = commitComment.CheckForNullEmptyOrWhiteSpace(nameof(commitComment)),
                PathToFile = pathToFile.CheckForNullEmptyOrWhiteSpace(nameof(pathToFile)),
                NewFileContent = newFileContent.CheckForNullEmptyOrWhiteSpace(nameof(newFileContent)),
                VersionControlChangeType = versionControlChangeType,
            };
        }
    }
}
