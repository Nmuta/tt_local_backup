using Microsoft.TeamFoundation.SourceControl.WebApi;

namespace StewardGitApi
{
    /// <summary>
    ///     A simple way to represent commits.
    /// </summary>
    public class CommitRefProxy
    {
        /// <summary>
        ///     Gets the commit comment.
        /// </summary>
        public string CommitComment { get; init; }

        /// <summary>
        ///     Gets the path to the file on repo.
        /// </summary>
        public string PathToFile { get; init; }

        /// <summary>
        ///     Gets file with edited content.
        /// </summary>
        public string NewFileContent { get; init; }

        /// <summary>
        ///     Gets the pull request change type.
        /// </summary>
        public VersionControlChangeType VersionControlChangeType { get; init; }

        /// <summary>
        ///     Creates a POCO <see cref="CommitRefProxy"/>.
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
