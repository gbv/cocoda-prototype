#!/usr/bin/env perl

use FindBin;
use lib "$FindBin::Bin/../lib";

use Cocoda::Server;
Cocoda::Server->dance;
