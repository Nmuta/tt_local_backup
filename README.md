
# Steward
## App setup
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
The only prerequisites for this app is to install Visual Studio.

## Running the app
### Zendesk

### UI

### API

