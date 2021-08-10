
# Steward
## App setup
### Git Submodules
To ensure proper suppression of CA/SA warnings, you want to be sure to download the data-buildmodule Submodule.
Use this command when creating your repository to pull down all submodules.
```console
git clone --recurse-submodules https://github.com/ABC/Project
```

### GIT Hooks
In base directory of repository, run the GIT hook setup executable:
```console
GitHooks/setup.sh
```

### Zendesk
Follow the instructions listed in the [LiveOps OneNote Setup Page](https://microsoft.sharepoint.com/teams/Turn10LiveOpsTools/_layouts/15/Doc.aspx?sourcedoc={768af33f-6711-4663-815b-7c0007bfa8bf}&action=edit&wd=target%28ZAF.one%7Ce6ecf726-05a8-4a4f-8947-6b605f34e456%2FZendesk%20First%20Time%20setup%7C2f92f1a6-1364-46b7-af36-d29c8a5d89dc%2F%29).


### UI
Steward's UI is built with Node, NPM, and Angular.
In order to get started, you need to make sure [Node and NPM](https://nodejs.org/en/download/) is installed on your machine.
> Make sure node version >= 12.16.x & npm version >= 6.14.x

<br>
Next, you need to install the projects node package dependencies.
In the StewardClient directory, run the install command

```console
npm run install
```

<br>
In order to gain access to the app's features, you also need to be given permission within the [Client Azure AAD App](https://ms.portal.azure.com/#blade/Microsoft_AAD_RegisteredApps/ApplicationMenuBlade/Overview/appId/48a8a430-0f6b-4469-940f-1c5c6af1fd88/isMSAApp/). 

Please reach out to anyone on the LiveOps dev team to give you permissions.

### API
Steward's API is built with .NET Core.
You will need to install Visual Studio to run the app.

<br>
Also you will need to be given a role within the [API Azure AAD App](https://ms.portal.azure.com/#blade/Microsoft_AAD_RegisteredApps/ApplicationMenuBlade/Overview/appId/cfe0ac3f-d0a7-4566-99f7-0c56b7a9f7d4/isMSAApp/). 
Please reach out to anyone on the LiveOps dev team to give you correct Admin role.

## Running the app
### Zendesk
You have two options to run Zendesk locally:

1) Run bash.exe and change working directory to Web-Steward/StewardClient/app-local. Once inside, run `zat serve`.

2) Run the npm command `npm run dev:zat`. This does everything in option 1 automatically for you

### UI
There are two different types of local environments that can be used.

1) All local - `npm run start` - this will run the Angular app locally and point all API requests to a local instance of Steward API.

2) Local UI/ Dev API - `npm run dev:start`- this will run the Angular app locally and point all API requests to the DEV instance of Steward API.
  
### API
To run the Steward API locally, open up the solution in Visual Studio. Make sure the StewardApi project is set as the Startup Project and click the Visual Studio's run button (green arrow).

This should open up the API's local swagger page on: https://localhost:44321/swagger/index.html

## Testing the app
### UI
You have multiple options to run client unit tests.

1) `npm run local:test:chrome` - Run using Chrome
2) `npm run local:test:ff` - Run using Firefox
3) `npm run vsts:test` - Run using headless browser
3) `npm run vsts:test:ncc` - Run using headless browser without code coverage results:

### API
API testing is simple and can all be done through Visual Studio's **Test Explorer**

