using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Microsoft.TeamFoundation.SourceControl.WebApi;

namespace StewardGitApi
{
    public class StewardGitChange
    {
        public string CommitComment { get; }
        public string PathToFile { get; }
        public string NewFileContent { get; }
        public VersionControlChangeType VersionControlChangeType { get; }

        public StewardGitChange(
            string commitComment, 
            string pathToFile, 
            string newFileContent, 
            VersionControlChangeType versionControlChangeType = VersionControlChangeType.Edit)
        {
            this.CommitComment = Check.ForNullEmptyOrWhiteSpace(commitComment, nameof(commitComment));
            this.PathToFile = Check.ForNullEmptyOrWhiteSpace(pathToFile, nameof(pathToFile));
            this.NewFileContent = Check.ForNullEmptyOrWhiteSpace(newFileContent, nameof(newFileContent));
            this.VersionControlChangeType = versionControlChangeType;
        }
    }
}
