.PHONY: build
build: setup
	bun run -- ./script/build.ts

.PHONY: check
check: lint build

.PHONY: setup
setup:
	bun install --frozen-lockfile

.PHONY: dev
dev: setup
	bun run -- ./script/dev.ts

.PHONY: lint
lint: setup
	bun x -- bun-dx --package @biomejs/biome biome -- check

.PHONY: format
format: setup
	bun x -- bun-dx --package @biomejs/biome biome -- check --write

.PHONY: deploy
deploy: build
	bun x -- bun-dx --package @cubing/deploy deploy --

RM_RF = bun -e 'process.argv.slice(1).map(p => process.getBuiltinModule("node:fs").rmSync(p, {recursive: true, force: true, maxRetries: 5}))' --

.PHONY: clean
clean:
	${RM_RF} ./dist/

.PHONY: reset
reset: clean
	${RM_RF} ./node_modules/
