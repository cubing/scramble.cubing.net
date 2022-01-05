# This Makefile is a wrapper around the scripts from `package.json`.
# https://github.com/lgarron/Makefile-scripts
# Run `make first-run` once to set up the commands. # this-line-will-be-deleted-during-first-run
.PHONY: first-run # this-line-will-be-deleted-during-first-run
first-run: update-Makefile # this-line-will-be-deleted-during-first-run

# Note: the first command becomes the default `make` target.
NPM_COMMANDS = build dev

.PHONY: $(NPM_COMMANDS)
$(NPM_COMMANDS):
	npm run $@

# We write the npm commands to the top of the file above to make shell autocompletion work in more places.
DYNAMIC_NPM_COMMANDS = $(shell node -e 'console.log(Object.keys(require("./package.json").scripts).join(" "))')
UPDATE_MAKEFILE_SED_ARGS = "s/^NPM_COMMANDS = .*$$/NPM_COMMANDS = ${DYNAMIC_NPM_COMMANDS}/" Makefile
.PHONY: update-Makefile
update-Makefile:
	if [ "$(shell uname -s)" = "Darwin" ] ; then sed -i "" ${UPDATE_MAKEFILE_SED_ARGS} ; fi
	if [ "$(shell uname -s)" != "Darwin" ] ; then sed -i"" ${UPDATE_MAKEFILE_SED_ARGS} ; fi

DEPLOY_SOURCE_PATH = ./dist/scramble.cubing.net/
DEPLOY_SITE_PATH   = scramble.cubing.net/
DEPLOY_SFTP_PATH   = "towns.dreamhost.com:~/${DEPLOY_SITE_PATH}"

.PHONY: deploy
deploy: build
	rsync -avz \
		--exclude .DS_Store \
		--exclude .git \
		${DEPLOY_SOURCE_PATH} \
		${DEPLOY_SFTP_PATH}
	echo "\nDone deploying. Go to https://${DEPLOY_SITE_PATH}\n"
