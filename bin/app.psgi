#!/usr/bin/env perl
use v5.14;
use FindBin;
use lib "$FindBin::Bin/../lib";

use Plack::Builder;
use Plack::App::Directory::Template;
use Cocoda::Server;

builder {
    enable_if { $ENV{PLACK_ENV} eq 'development' } 'StackTrace';
    enable_if { $ENV{PLACK_ENV} eq 'development' } 'Lint';
    enable 'Debug';
    builder {
        mount '/api' => builder {
            enable 'AccessLog';
            # enable 'Plack::Middleware::JSON::ForBrowsers';
            enable 'Plack::Middleware::JSONP';
            Cocoda::Server->dance;
        };
        mount '/' => Plack::App::Directory::Template->new(
            root      => 'public',
            dir_index => 'index.html'
        )->to_app;
    }
};
