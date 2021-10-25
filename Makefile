
DEPLOY_SOURCE_PATH = ./
DEPLOY_SITE_PATH   = scramble.cubing.net/
DEPLOY_SFTP_PATH   = "towns.dreamhost.com:~/${DEPLOY_SITE_PATH}"

.PHONY: deploy
deploy:
	rsync -avz \
		--exclude .DS_Store \
		--exclude .git \
		${DEPLOY_SOURCE_PATH} \
		${DEPLOY_SFTP_PATH}
	echo "\nDone deploying. Go to https://${DEPLOY_SITE_PATH}\n"
