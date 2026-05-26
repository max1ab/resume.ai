FILE ?= resumes/sample-resume.tex

.PHONY: build resume all watch clean clean-all distclean

build resume:
	latexmk -cd $(FILE)

all:
	latexmk -cd resumes/*.tex

watch:
	latexmk -cd -pvc $(FILE)

clean:
	latexmk -cd -c $(FILE)

clean-all:
	latexmk -cd -c resumes/*.tex

distclean:
	latexmk -cd -C $(FILE)
