use v5.14;
use Test::More;
use Cocoda::Server;
use Cocoda::Server::Terminology;
use Cocoda::Server::Mapping;
use Cocoda::Server::Occurrence;
use Dancer2::Test apps => [
    'Cocoda::Server',
    'Cocoda::Server::Terminology',
    'Cocoda::Server::Mapping',
    'Cocoda::Server::Occurrence',
];

foreach (qw(/ /terminology /occurrence)) { # /mapping)) {
    route_exists [GET => $_], "route handler defined for $_";
    response_status_is [GET => $_], 200, "GET $_ is 200";
}

response_status_is [GET => '/mapping'], 500, "GET /mapping is 500";

done_testing;
