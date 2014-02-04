APP=bin/app.psgi

GIT = $(shell which git)
ifeq ($(GIT),)
    GIT = $(error git is required but not installed)
endif

about:
	@echo "make deps|test|build|start|clean|purge"
	@if [ "$$PERLBREW_PERL" ]; then\
		echo "Using perlbrew $$PERLBREW_PERL" ;\
	else \
		echo "Using Perl" `perl -e 'print $$]'` "and carton with ./local";\
	fi

git:
	@$(GIT) --version > /dev/null

deps:
	@if [ "$$PERLBREW_PERL" ]; then\
		cpanm --installdeps . ;\
	else \
		[ -f local/bin/carton ] || cpanm -L local Carton ;\
		perl -Ilocal/lib/perl5 local/bin/carton install ;\
	fi

build: git noperlbrew deps
	@./makedpkg

test:
	@if [ "$$PERLBREW_PERL" ]; then\
		prove -r -Ilib t ;\
	else\
		perl -Ilocal/lib/perl5 local/bin/carton exec -- prove -r -Ilib t ;\
	fi

start:
	@if [ "$$PERLBREW_PERL" ]; then\
		plackup --no-default-middleware -Ilib $(APP) ;\
	else \
		perl -Ilocal/lib/perl5 local/bin/carton exec -- local/bin/starman $(APP) ;\
	fi

noperlbrew:
	@if [ "$$PERLBREW_PERL" ]; then\
	 	echo "please switch off perlbrew for build!" ;\
		exit 1 ;\
	fi

doc:
	cd doc; make html pdf

clean:
	@rm -rf debuild

purge: clean
	@rm -rf local

.PHONY: about deps build test start noperlbrew doc
