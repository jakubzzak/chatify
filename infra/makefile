.PHONY: bundle-server
bundle-server:
	cd ../server && \
	npm run build && \
	npm prune --production && \
	mv node_modules ./dist/node_modules && \
	npm i && \
	cd ../infra

.PHONY: bundle-client
bundle-client:
	cd ../client && \
	npm run build && \
	cd ../infra

.PHONY: deploy-fresh
deploy-fresh:
	make bundle-server bundle-client && \
	npm run cdk:deploy
