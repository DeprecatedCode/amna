.PHONY: test install test-watch docs

install:
	npm install

test:
	npm test

test-watch:
	./node_modules/.bin/_mocha --check-leaks --no-exit --recursive --watch -R min

docs:
	node ./dev/docs
