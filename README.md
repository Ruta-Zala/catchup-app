# Catchup Frontend
## REQUIREMENTS
- NodeJS 14.15.4 (see .nvmrc)

## Commit Style
The linting process checks if your commit messages meet the [conventional commit format](https://conventionalcommits.org).

*__THIS NEEDS TO BE RESPECTED OTHERWISE THE VERSIONING SYSTEM LOSES VALUE!__*

In general the pattern mostly looks like this

```sh
type(scope?): subject  #scope is optional (BUT it's NOT)
```

Real-world examples can look like this

```
chore: run tests on travis ci
```

```
fix(server): send cors headers
```

```
feat(blog): add comment section
```

Common types according to [commitlint-config-conventional](https://github.com/conventional-changelog/commitlint/tree/master/%40commitlint/config-conventional#type-enum) can be:

- build
- ci
- chore
- docs
- feat
- fix
- perf
- refactor
- revert
- style
- test

## Branch Style and MR Rule
Every time you start to work on a feature or a fix you must start from the `develop` branch.

The branch you create need to reflect the task number and it's kind e.g `feat/CAT-111` or `fix/CAT-111` depending of it CAT-111 task is a new feature or a fix.

Once you completed you task, open up a MR (Pull Request) to merge e.g `feat/CAT-111` into `develop`

## Versioning
Using *standard-version* we have an automatic bump using the *Conventional Commit Specifications* used in the section above. Also we'll a nice automatically generated `CHANGELOG.md` with the list of Features and Bug Fixes new for each release (see .versionrc.json file).

After we approved and merged a MR into `develop` we can run these line to bump the version and push the git tag into the remote

```sh
npm run release
git push --follow-tags
```

The version number will be present in the application's sidebar

*__N.B:__* We also use the `follow-tags` when we push so that we have a Tag for each version published.

## Local Development
Copy `_docker/.env.example` to `_docker/.env` and set parameters accordingly.

**NOTE**: if you use a different domain and/or local HTTPS port, you should also change `VUE_APP_CALLBACK_URL` parameter in `.env.<environment>`.

Also, such address:port redirect URI must be added in Google Cloud Console.

To run the app using the hot reload feature locally use

```
npm run docker //staging
npm run docker:prod //production
```
and add `app.catchup.email`, `test.catchup.email` to your `/etc/hosts`

You could use `npm run docker:stop` to stop the container BUT it's already done by the `npm run docker` and `npm run docker:prod`

**NOTE**: if you get a 502 Bad Gateway error from nginx proxy, just wait for Node.js build to be completed.

Finally, remember to **import self-signed certificate on your host and mark it as trusted**.

## Docker Build

To run production in build in dev
```
docker run --name nginx-proxy -d -p 80:80 -p 443:443 -v /var/run/docker.sock:/tmp/docker.sock:ro jwilder/nginx-proxy
docker build -t catchupemail_front .
docker run -it -e VIRTUAL_HOST=app.catchup.email --name catchupemail_front-app catchupemail_front
```

The docker image uses **nginx** as the server and the configuration file is *default.conf*

To build for deployment
```
npm run build //staging
npm run build:prod //production
```
