#pragma warning disable SA1600 // Elements should be documented

using Microsoft.TeamFoundation.SourceControl.WebApi;

namespace StewardGitApi
{
    /// <summary>
    ///     A simple way to represent commits.
    /// </summary>
    public class CommitRefProxy
    {
        public string PathToFile { get; init; }

        public string NewFileContent { get; init; }

        public string CommitMessage { get; set; }

        public string AuthorEmail { get; set; }

        public string AuthorName { get; set; }

        public VersionControlChangeType VersionControlChangeType { get; init; }

        /// <summary>
        ///     Factory creation.
        /// </summary>
        public static CommitRefProxy Create(
            string commitComment,
            string pathToFile,
            string newFileContent,
            string authorEmail,
            string authorName,
            VersionControlChangeType versionControlChangeType = VersionControlChangeType.Edit)
        {
            return new CommitRefProxy()
            {
                CommitMessage = commitComment.CheckForNullEmptyOrWhiteSpace(nameof(commitComment)),
                PathToFile = pathToFile.CheckForNullEmptyOrWhiteSpace(nameof(pathToFile)),
                NewFileContent = newFileContent.CheckForNullEmptyOrWhiteSpace(nameof(newFileContent)),
                AuthorEmail = authorEmail.CheckForNullEmptyOrWhiteSpace(nameof(authorEmail)),
                AuthorName = authorName.CheckForNullEmptyOrWhiteSpace(nameof(authorName)),
                VersionControlChangeType = versionControlChangeType,
            };
        }
    }
}
