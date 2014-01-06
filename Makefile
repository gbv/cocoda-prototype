GIT = $(shell which git)
ifeq ($(GIT),)
    GIT = $(error git is required but not installed)
endif

about:
	@echo "make build|clean|purge"

git:
	@$(GIT) --version > /dev/null


deps: noperlbrew
	@perl -Ilocal/lib/perl5 local/bin/carton install

build: git noperlbrew
	@./makedpkg

test: noperlbrew
	@perl -Ilocal/lib/perl5 local/bin/carton exec -- prove -Ilib t

start:
	@perl -Ilocal/lib/perl5 local/bin/carton exec -- local/bin/starman bin/app.psgi

noperlbrew:
	@if [ `which perl` != "/usr/bin/perl" ]; then\
	   echo "perl must be /usr/bin/perl"; exit 1; fi
#	@hash perlbrew 2>/dev/null && perlbrew off

clean:
	@rm -rf debuild

purge: clean
	@rm -rf local

.PHONY: about deps build test start noperlbrew
