# pulled from https://stackoverflow.com/questions/60048492/how-to-create-a-comment-in-azure-devops-pr-in-case-of-build-failure

#Going to create the comment in an Active state, assuming it needs to be resolved
#See https://learn.microsoft.com/en-us/dotnet/api/microsoft.teamfoundation.sourcecontrol.webapi.commentthreadstatus?view=azure-devops-dotnet
$StatusCode = 1 

$Stuff = $env:Build_Repository_Name
$Things = "Other things you might want in the message"

#Build Up a Markdown Message to 
$Markdown = @"
## Markdown Message here
|Column0 |Column1|
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
#https://learn.microsoft.com/en-us/rest/api/azure/devops/git/pull%20request%20threads?view=azure-devops-rest-5.1
try {
    $url = "$($env:SYSTEM_TEAMFOUNDATIONCOLLECTIONURI)$env:SYSTEM_TEAMPROJECTID/_apis/git/repositories/$($env:Build_Repository_Name)/pullRequests/$($env:System_PullRequest_PullRequestId)/threads?api-version=5.1"
    Write-Host "URL: $url"
    $response = Invoke-RestMethod -Uri $url -Method POST -Headers @{Authorization = "Bearer $env:SYSTEM_ACCESSTOKEN"} -Body $Body -ContentType application/json
  if ($response -ne $Null) {
    Write-Host "*******************Comment made*********************************"
  }
}
catch {
  Write-Error $_
  Write-Error $_.Exception.Message
}