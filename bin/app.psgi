#!/usr/bin/env perl

use FindBin;
use lib "$FindBin::Bin/../lib";

use Cocoda::Server;
use Plack::Builder;

builder {
    enable 'Debug';
    enable 'Plack::Middleware::JSON::ForBrowsers';
    enable 'Plack::Middleware::JSONP';
#    enable 'Plack::Middleware::Negotiate',
#        formats => {
#            json => { type => 'application/json' },
#            html => { type => 'text/html' }
#        };
    Cocoda::Server->dance;
}
