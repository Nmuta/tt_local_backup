# pulled from https://stackoverflow.com/questions/60048492/how-to-create-a-comment-in-azure-devops-pr-in-case-of-build-failure
# and then from https://stackoverflow.com/questions/73770796/is-it-possible-to-add-comment-as-resolved-to-pr-in-azure-devops
# and then edited based on https://learn.microsoft.com/en-us/rest/api/azure/devops/git/pull-request-threads/create?view=azure-devops-rest-6.0&tabs=HTTP

#Build Up a Markdown Message
$Markdown = @"
**The UI portion of this PR was unable to be deployed.**  
There is a limit of 10 staging environment slots. There may be too many.  
Read the deploy log and check Manage Environments below.

---

Info:
Your environment: **$env:DEPLOYMENT_ENVIRONMENT**
Your access URL: $env:ACCESS_URL

[Docs]($env:DOCS_URL)
[Manage Auth]($env:MANAGE_AUTH_URL)
[Manage Environments]($env:MANAGE_ENVIRONMENTS_URL)
[Manage CORS]($env:MANAGE_CORS_URL)
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
    "status": 'closed'
  }
"@

Write-Debug $Body
#Post the message to the Pull Request
# https://learn.microsoft.com/en-us/rest/api/azure/devops/git/pull%20request%20threads?view=azure-devops-rest-5.1
# https://learn.microsoft.com/en-us/rest/api/azure/devops/git/pull-request-threads/create?view=azure-devops-rest-6.0&tabs=HTTP
try {
    Write-Host " Collection URI: $env:SYSTEM_COLLECTIONURI"
    Write-Host "Team Project ID: $env:SYSTEM_TEAMPROJECTID"
    Write-Host "  Repository ID: $env:BUILD_REPOSITORY_ID"
    Write-Host "          PR ID: $env:SYSTEM_PULLREQUEST_PULLREQUESTID"
    $url = "$env:SYSTEM_COLLECTIONURI/$env:SYSTEM_TEAMPROJECTID/_apis/git/repositories/$env:BUILD_REPOSITORY_ID/pullRequests/$env:SYSTEM_PULLREQUEST_PULLREQUESTID/threads?api-version=6.0"
    Write-Host "URL: $url"
    $response = Invoke-RestMethod -Uri $url -Method POST -Headers @{Authorization = "Bearer $env:SYSTEM_ACCESSTOKEN"} -Body $Body -ContentType application/json
  if ($response -ne $Null) {
    Write-Host "********************************* Comment Posted *********************************"
  }
}
catch {
  Write-Error $_
  Write-Error $_.Exception.Message
}