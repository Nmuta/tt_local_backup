#################################################################################################################################
# WARNING: 2020-09-02: THIS WAS DESIGNED FOR USE WITH FMNET'S STYLE OF GENEVA AGENT USE AND MAY NOT WORK WITH SCRUTINEER AS-IS ##
#################################################################################################################################

# monitor.ps1:
# 1. Installs latest GenevaMonitoring Agent
# 2. Logs into Azure with your account
# 3. Gathers appropriate GenevaStorageAccount Key
# 4. Configures ENV
# 5. MonAgentLauncher

# requires nuget to be on the path
# requires Azure CLI to be installed

# you may have to bypass execution policy for the process to run this
# Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass

Write-Output "-----------------------"
$PackagesPath = "$PSScriptRoot/packages"
$ProjectRoot = (Resolve-Path $PSScriptRoot/..)
$MonitoringRoot = (Resolve-Path $ProjectRoot/Monitoring)
$DeployRoot = (Resolve-Path $ProjectRoot/Deploy)
Write-Output "Project Root = $ProjectRoot"
Write-Output "Monitoring Root = $MonitoringRoot"
Write-Output "Deploy Root = $DeployRoot"
Write-Output "Packages Path = $PackagesPath"
Write-Output "-----------------------"
Write-Output "# 1. Installing Geneva"
Write-Output "-----------------------"

nuget install GenevaMonitoringAgent -OutputDirectory $PackagesPath

Write-Output "-----------------------"
$GenevaScript = (Resolve-Path $PackagesPath/GenevaMonitoringAgent*/Monitoring/Agent/MonAgentLauncher.exe)
Write-Output "Geneva = $GenevaScript"
Write-Output "-----------------------"
Write-Output "# 2. Logging in to Azure"
Write-Output "-----------------------"

# TODO: Do not do this if they're already logged in
az login

Write-Output "-----------------------"
Write-Output "# 3. Gathering Secrets"
Write-Output "-----------------------"

$vaultName = 'dev-fmnet-keyvault'
$secretName = 'GenevaStorageAccountKey'

$genevaStorageAccountKey = (az keyvault secret show --vault-name $vaultName --name $secretName --query value)

Write-Output "# 4. Configuring ENV"
Write-Output "-----------------------"

$accountMoniker = 't10WebsiteDevDiag'
$genevaStorageAccount = 't10websitedevdiagusw'

$Env:MONITORING_DATA_DIRECTORY = '%TEMP%'
$Env:MONITORING_INIT_CONFIG = "$MonitoringRoot\t10WebsiteDev.xml"
$Env:MONITORING_TENANT = 't10WebsiteDev'
$Env:MONITORING_ROLE = 'Website'
$Env:MONITORING_ROLE_INSTANCE = 'Local'
$Env:MONITORING_XSTORE_ACCOUNTS = "$accountMoniker#false#$genevaStorageAccount#$genevaStorageAccountKey#http://table.core.windows.net#http://queue.core.windows.net#http://blob.core.windows.net"

Write-Output "# 5. Start Geneva Monitoring"
Write-Output "-----------------------"

Invoke-Expression "$GenevaScript -useenv"