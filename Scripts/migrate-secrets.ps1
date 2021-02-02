# migrate-secrets.ps1

# requires nuget to be on the path
# requires Azure CLI to be installed

# you may have to login to run this
# az login

# you may have to bypass execution policy for the process to run this
# Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass

# example command
# ./Scripts/migrate-secrets.ps1 -sourceVaultName steward-keyvault-dev -destVaultName steward-keyvault-test

# based on https://stackoverflow.com/questions/55617951/how-do-i-copy-over-all-secrets-from-one-azure-keyvault-to-another-using-powershe

Param(
  [Parameter(Mandatory)]
  [string]$sourceVaultName,

  [Parameter(Mandatory = $false)]
  [string]$sourceSubscription,

  [Parameter(Mandatory)]
  [string]$destVaultName,

  [Parameter(Mandatory = $false)]
  [string]$descriptionSubscription
)

# az login
if ($sourceSubscription) {
  az account set --subscription $sourceSubscription
}

Write-Host ''
Write-Host '# Reading secret ids from' $sourceVaultName
$secretNames = az keyvault secret list --vault-name $sourceVaultName  -o json --query "[].name"  | ConvertFrom-Json

Write-Host ''
Write-Host '# Reading secret values from' $sourceVaultName
$secrets = $secretNames | % {
  $secret = az keyvault secret show --name $_ --vault-name $sourceVaultName -o json | ConvertFrom-Json
  Write-Host $_
  [PSCustomObject]@{
    name  = $_;
    value = $secret.value;
  }
}

if ($descriptionSubscription) {
  az account set --subscription $descriptionSubscription
}

Write-Host ''
Write-Host '# Writing secrets to' $destVaultName

$secrets.foreach{
  Write-Host $_.name
  az keyvault secret set --vault-name $destVaultName --name $_.name  --value  $_.value | Out-Null
}