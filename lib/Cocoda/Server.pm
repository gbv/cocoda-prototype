package Cocoda::Server;
use v5.14;
use Dancer2;

use Cocoda::Server::Terminology;
use Cocoda::Server::Mapping;
use Cocoda::Server::Sample;

prefix undef;

# Return information about the Cocoda server
get '/' => sub {
    my $base    = request->uri_base;
    my $version = config->{version};
    my $title   = config->{title} // "Cocoda server";
    return {
        title         => $title,
        version       => $version,
        terminologies => "$base/terminology",
        mappings      => "$base/mapping",
        samples       => "$base/sample",
    };
};

#any qr{.*} => sub {
#    send_error('not found',404);
#};

1;
