# Steward

### .npmrc setup

In the same directory as the package.json, create a file named '.npmrc'
Add the below contents to the file


> registry=https://pkgs.dev.azure.com/turn10/_packaging/Turn10-Services/npm/registry/         
> always-auth=true

After, run the following command:

> npm run refreshVSToken
