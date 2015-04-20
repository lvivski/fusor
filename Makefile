JS_COMPILER ?= ./node_modules/uglify-js/bin/uglifyjs
FILES = \
	src/flex.js \
	src/flux.js \
	src/mixins.js \
	src/store.js \
	src/utils.js \

all: \
	flex.js \
	flex.min.js

flex.js: ${FILES}
	@rm -f $@
	@echo "(function(global){" > $@.tmp
	@echo "'use strict'" >> $@.tmp
	@cat $(filter %.js,$^) >> $@.tmp
	@echo "}(this))" >> $@.tmp
	@$(JS_COMPILER) $@.tmp -b indent-level=2 -o $@
	@rm $@.tmp
	@chmod a-w $@

flex.min.js: flex.js
	@rm -f $@
	@$(JS_COMPILER) $< -c -m -o $@ \
		--source-map $@.map \
		&& du -h $< $@

deps:
	mkdir -p node_modules
	npm install

clean:
	rm -f flex*.js*
