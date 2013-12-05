This repository contains a Cocoda Server as created at VZG.

The server is implemented in Perl as Dancer2 application.

# Installation

1. Make sure you have at least Perl version 5.14.0

2. Make sure you have installed cpanminus.

3. Install required modules:

    perl cpanm --installdeps .

# Run the server

    perl -Ilib bin/app.pl
