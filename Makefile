BUILD_DIR = build

PREFIX = .
DIST_DIR = ${PREFIX}/dist

JS_ENGINE ?= `which node nodejs`
COMPILER = ${JS_ENGINE} ${BUILD_DIR}/uglify.js --unsafe
POST_COMPILER = ${JS_ENGINE} ${BUILD_DIR}/post-compile.js


lint:
	@@if test ! -z ${JS_ENGINE}; then \
		echo "Linting Popcorn.sequence"; \
		${JS_ENGINE} build/jslint-check.js; \
	else \
		echo "Nodejs is missing"; \
	fi
