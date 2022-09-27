using Microsoft.TeamFoundation.SourceControl.WebApi;

namespace StewardGitApi
{
    public class CommitRefProxy
    {
        public string CommitComment { get; init; }
        public string PathToFile { get; init; }
        public string NewFileContent { get; init; }
        public VersionControlChangeType VersionControlChangeType { get; internal set; }

        public static CommitRefProxy Create(
            string commitComment,
            string pathToFile,
            string newFileContent,
            VersionControlChangeType versionControlChangeType = VersionControlChangeType.Edit)
        {
            return new CommitRefProxy()
            {
                CommitComment = Check.ForNullEmptyOrWhiteSpace(commitComment, nameof(commitComment)),
                PathToFile = Check.ForNullEmptyOrWhiteSpace(pathToFile, nameof(pathToFile)),
                NewFileContent = Check.ForNullEmptyOrWhiteSpace(newFileContent, nameof(newFileContent)),
                VersionControlChangeType = versionControlChangeType,
            };
        }
    }
}
