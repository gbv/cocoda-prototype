#!/usr/bin/env perl
use v5.14;
use FindBin;
use lib "$FindBin::Bin/../lib";

use Plack::Builder;
use Plack::App::Directory::Template;
use Cocoda::Server;

builder {
    enable 'Debug';
    builder {
        mount '/api' => builder {
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
