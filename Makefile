BUILD_DIR = build

PREFIX = .
DIST_DIR = ${PREFIX}/dist

JS_ENGINE ?= `which node nodejs`
COMPILER = ${JS_ENGINE} ${BUILD_DIR}/uglify.js --unsafe
POST_COMPILER = ${JS_ENGINE} ${BUILD_DIR}/post-compile.js


hint:
	@@if test ! -z ${JS_ENGINE}; then \
		echo "Hinting Popcorn.sequence"; \
		${JS_ENGINE} build/jshint-check.js; \
	else \
		echo "Nodejs is missing"; \
	fi
