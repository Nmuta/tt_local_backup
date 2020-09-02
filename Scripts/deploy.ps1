# deploy.ps1

# requires nuget to be on the path
# requires Azure CLI to be installed

# you may have to bypass execution policy for the process to run this
# Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass

# based on https://docs.microsoft.com/en-us/azure/azure-resource-manager/templates/deploy-cli
# based on https://genevamondocs.azurewebsites.net/collect/environments/azurewebapp.html

Function Invoke-Deploy {
    [CmdletBinding()]
    Param (
        [Parameter(Mandatory = $True)]
        [ValidateSet('dev', 'prod')]
        [string]$DevProd
    )

    Begin {
        $ErrorActionPreference = 'Stop'
        Write-Verbose -Message "Entering the BEGIN block [$($MyInvocation.MyCommand.CommandType): $($MyInvocation.MyCommand.Name)]."
        Write-Output "-----------------------"
        $PackagesPath = "$PSScriptRoot/packages"
        $ResourceGroup = "scrutineer-$DevProd"
        $ProjectRoot = (Resolve-Path $PSScriptRoot/..)
        $MonitoringRoot = (Resolve-Path $ProjectRoot/Monitoring)
        $DeployRoot = (Resolve-Path $ProjectRoot/Deploy)
        $Template_AppServicePlan = (Resolve-Path  $DeployRoot/template-plan.json)
        $Template_Identity = (Resolve-Path  $DeployRoot/template-identity.json)
        $Template_KeyVault = (Resolve-Path  $DeployRoot/template-keyvault.json)
        $Template_Site = (Resolve-Path  $DeployRoot/template-site.json)
        $Parameters_Plan = (Resolve-Path  $DeployRoot/parameters-plan-$($DevProd).json)
        $Parameters_Sites = (Resolve-Path  $DeployRoot/parameters-site-common-$($DevProd).json)
        $Parameters_API = (Resolve-Path  $DeployRoot/parameters-site-override-api.json)
        $Parameters_UI = (Resolve-Path  $DeployRoot/parameters-site-override-ui.json)
        
        Write-Output "Project Root = $ProjectRoot"
        Write-Output "Monitoring Root = $MonitoringRoot"
        Write-Output "Deploy Root = $DeployRoot"
        Write-Output "Packages Path = $PackagesPath"
        Write-Output "-----------------------"
    }
    
    Process {
        $ErrorActionPreference = 'Stop'
        Write-Verbose -Message "Entering the PROCESS block [$($MyInvocation.MyCommand.CommandType): $($MyInvocation.MyCommand.Name)]."
        Write-Output "Resource Group = $ResourceGroup"
        Write-Output "-----------------------"

        Write-Output "Deploying Identity"
        Write-Output "-----------------------"
        az deployment group create --resource-group $ResourceGroup --template-file $Template_Identity --parameters @$Parameters_Sites --verbose
        if (-not $?) { exit }

        # TODO: Running this will erase the access policies but not the secrets. Figure out how to only run this if it is missing?
        # Write-Output "-----------------------"
        # Write-Output "Deploying KeyVault"
        # Write-Output "-----------------------"
        # az deployment group create --resource-group $ResourceGroup --template-file $Template_KeyVault --parameters @$Parameters_Sites --verbose
        # if (-not $?) { exit }

        Write-Output "-----------------------"
        Write-Output "Deploying Plan"
        Write-Output "-----------------------"
        az deployment group create --resource-group $ResourceGroup --template-file $Template_AppServicePlan --parameters @$Parameters_Plan --verbose
        if (-not $?) { exit }
        
        Write-Output "-----------------------"
        Write-Output "Deploying Site API"
        Write-Output "-----------------------"
        az deployment group create --resource-group $ResourceGroup --template-file $Template_Site --parameters @$Parameters_Sites --parameters @$Parameters_API --verbose
        if (-not $?) { exit }

        Write-Output "-----------------------"
        Write-Output "Deploying Site UI"
        Write-Output "-----------------------"
        az deployment group create --resource-group $ResourceGroup --template-file $Template_Site --parameters @$Parameters_Sites --parameters @$Parameters_UI --verbose
        if (-not $?) { exit }

    }
    
    End {
        $ErrorActionPreference = 'Stop'
        Write-Verbose -Message "Entering the END block [$($MyInvocation.MyCommand.CommandType): $($MyInvocation.MyCommand.Name)]."
    }
}

Invoke-Deploy @args
