#!/usr/bin/env perl

use FindBin;
use lib "$FindBin::Bin/../lib";

use Plack::Builder;
use Cocoda::Server;

builder {
    enable 'Debug';
    builder {
        mount '/web/js' => builder {
           enable 'Compile',
                lib  => 'public/js',
                mime => 'text/javascript',
                pattern => qr{\.coffee$}, # TODO: security
                map => sub {
                    my $filename = shift;
                    $filename =~ s/coffee$/js/;
                    return $filename;
                },
                compile => sub {
                    # TODO: filter $in/$out for security!
                    my ($in, $out) = @_;
                    system("coffee --compile --stdio < $in > $out");
                };
        };
        mount '/web' => builder {
            enable 'Static', 
                path => qr{\.(png|css|js)$},
                root => 'public';
            enable 'TemplateToolkit',
                INCLUDE_PATH => 'views',
                dir_index => 'index.tt';
        };
        mount '/' => builder {
            # enable 'Plack::Middleware::JSON::ForBrowsers';
            enable 'Plack::Middleware::JSONP';
            Cocoda::Server->dance;
        };
    }
};
