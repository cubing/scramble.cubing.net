.PHONY: build
build: setup
	bun script/build.ts

.PHONY: setup
setup:
	bun install --no-save

.PHONY: dev
dev: setup
	bun script/dev.ts

.PHONY: clean
clean:
	rm -rf ./dist

.PHONY: lint
lint: setup
	npx @biomejs/biome check

.PHONY: format
format: setup
	npx @biomejs/biome check --write

.PHONY: deploy
deploy: build
	bun x @cubing/deploy
