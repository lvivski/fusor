JS_COMPILER ?= ./node_modules/uglify-js/bin/uglifyjs
FILES = \
	src/fusor.js \
	src/flux.js \
	src/mixins.js \
	src/actions.js \
	src/store.js \
	src/util.js \

all: \
	fusor.js \
	fusor.min.js

fusor.js: ${FILES}
	@rm -f $@
	@echo "(function(global){" > $@.tmp
	@echo "'use strict'" >> $@.tmp
	@cat $(filter %.js,$^) >> $@.tmp
	@echo "}(this))" >> $@.tmp
	@$(JS_COMPILER) $@.tmp -b indent-level=2 -o $@
	@rm $@.tmp
	@chmod a-w $@

fusor.min.js: fusor.js
	@rm -f $@
	@$(JS_COMPILER) $< -c -m -o $@ \
		--source-map $@.map \
		&& du -h $< $@

deps:
	mkdir -p node_modules
	npm install

clean:
	rm -f fusor*.js*
