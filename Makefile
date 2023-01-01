.DELETE_ON_ERROR:
.PHONY: all audit build lint lint-fix qa test test-data FORCE

default: all

CATALYST_SCRIPTS:=npx catalyst-scripts
BASH_ROLLUP:=npx bash-rollup

FJSON_SRC:=src/fjson
FJSON_FILES:=$(shell find $(FJSON_SRC) \( -name "*.js" -o -name "*.mjs" \) -not -path "*/test/*" -not -name "*.test.js")
FJSON_CJS_LIB:=dist/fjson.js
FJSON_MODULE_LIB:=dist/fjson.mjs

FJSON_TEST_DATA_SRC:=$(FJSON_SRC)/test/data
FJSON_TEST_DATA_FILES:=$(shell find $(FJSON_TEST_DATA_SRC) -name "*.json")
FJSON_TEST_DATA:=$(patsubst $(FJSON_SRC)/%, test-staging/%, $(FJSON_TEST_DATA_FILES))

FJSON_TEST_SRC_FILES:=$(shell find $(FJSON_SRC) -name "*.js" -o -name "*.mjs")
FJSON_TEST_BUILT_FILES=$(patsubst %.mjs, %.js, $(patsubst $(FJSON_SRC)/%, test-staging/%, $(FJSON_TEST_SRC_FILES)))

CLI_SRC=src/cli
CLI_SRC_ROOT:=$(CLI_SRC)/fjson.sh
CLI_SRC_FILES:=$(shell find $(CLI_SRC) -not -name "$(notdir $(CLI_SRC_ROOT))")
CLI_BIN:=dist/fjson.sh

BUILD_TARGETS:=$(FJSON_CJS_LIB) $(FJSON_MODULE_LIB) $(CLI_BIN)

build: $(BUILD_TARGETS)

all: build

# build rules
# TODO: should be a 'grouped taget' '&:' sep, but currently writing to make 3 and thaht's a 4.x feature.
$(FJSON_CJS_LIB) $(FJSON_MODULE_LIB) : $(FJSON_FILES) 
	JS_SRC=$(FJSON_SRC) $(CATALYST_SCRIPTS) build

$(CLI_BIN): $(CLI_SRC_ROOT) $(CLI_SRC_FILES)
	mkdir -p $(dir $@)
	$(BASH_ROLLUP) $< $@

# test rules
# TODO: should be a 'grouped taget' '&:' sep, but currently writing to make 3 and thaht's a 4.x feature.
$(FJSON_TEST_BUILT_FILES) : $(FJSON_TEST_SRC_FILES)
	JS_SRC=$(FJSON_SRC) $(CATALYST_SCRIPTS) pretest

test-staging/test/data/datadir:
	mkdir -p $@

test-data: $(FJSON_TEST_DATA)
	@echo 'Updating test data files...'

$(FJSON_TEST_DATA) : test-staging/% : $(FJSON_SRC)/% test-staging/test/data/datadir FORCE
	@cp "$<" "$@"

test: $(FJSON_TEST_BUILT_FILES) test-data
	JS_SRC=test-staging $(CATALYST_SCRIPTS) test

# lint rules
lint:
	JS_SRC=$(FJSON_SRC) $(CATALYST_SCRIPTS) lint

lint-fix:
	JS_SRC=$(FJSON_SRC) $(CATALYST_SCRIPTS) lint-fix

# audit rules
audit:
	npm audit

audit-fix:
	npm audit fix

#qa
qa: test lint audit