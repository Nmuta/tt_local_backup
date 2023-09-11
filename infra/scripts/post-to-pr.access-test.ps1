# pulled from https://stackoverflow.com/questions/60048492/how-to-create-a-comment-in-azure-devops-pr-in-case-of-build-failure
# and then from https://stackoverflow.com/questions/73770796/is-it-possible-to-add-comment-as-resolved-to-pr-in-azure-devops
# and then edited based on https://learn.microsoft.com/en-us/rest/api/azure/devops/git/pull-request-threads/create?view=azure-devops-rest-6.0&tabs=HTTP
$StatusCode = 1 

$Stuff = $env:newVersion
$Things = "$($env:System_TeamFoundationCollectionUri)$($env:System_TeamProject)/_apis/build/builds/$($env:Build_BuildId)/artifacts?artifactName=PM_$($env:newVersion)&%24format=zip"

#Build Up a Markdown Message to 
$Markdown = @"
|Version |Download Link|
|--------|---------|
|$Stuff|$Things|  
"@

#Build the JSON body up
$body = @"
{
    "comments": [
      {
        "parentCommentId": 0,
        "content": "$Markdown",
        "commentType": 1
      }
    ],
    "status": $StatusCode 
  }
"@

Write-Debug $Body
#Post the message to the Pull Request
# https://learn.microsoft.com/en-us/rest/api/azure/devops/git/pull%20request%20threads?view=azure-devops-rest-5.1
# https://learn.microsoft.com/en-us/rest/api/azure/devops/git/pull-request-threads/create?view=azure-devops-rest-6.0&tabs=HTTP
try {
    Write-Host " Collection URI: $env:SYSTEM_COLLECTIONURI"
    Write-Host "Team Project ID: $env:SYSTEM_TEAMPROJECTID"
    Write-Host "  Repository ID: $env:BUILD_REPOSITORYID"
    Write-Host "          PR ID: $env:SYSTEM_PULLREQUEST_PULLREQUESTID"
    $url = "https://dev.azure.com/$env:SYSTEM_ORGANIZATIONID/$env:SYSTEM_TEAMPROJECTID/_apis/git/repositories/$($env:Build_Repository_Name)/pullRequests/$($env:System_PullRequest_PullRequestId)/threads?api-version=5.1"
    Write-Host "URL: $url"
    $response = Invoke-RestMethod -Uri $url -Method POST -Headers @{Authorization = "Bearer $env:SYSTEM_ACCESSTOKEN"} -Body $Body -ContentType application/json
  if ($response -ne $Null) {
    Write-Host "*******************Bingo*********************************"
  }
}
catch {
  Write-Error $_
  Write-Error $_.Exception.Message
}