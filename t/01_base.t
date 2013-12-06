use v5.14;
use Test::More;
use Cocoda::Server;
use Cocoda::Server::Terminology;
use Cocoda::Server::Mapping;
use Cocoda::Server::Sample;
use Dancer2::Test apps => [
    'Cocoda::Server',
    'Cocoda::Server::Terminology',
    'Cocoda::Server::Mapping',
    'Cocoda::Server::Sample',
];

foreach (qw(/ /terminology)) { # /mapping /sample)) {
    route_exists [GET => $_], "route handler defined for $_";
    response_status_is [GET => $_], 200, "GET $_ is 200";
}

response_status_is [GET => '/mapping'], 500, "GET /mapping is 500";
response_status_is [GET => '/sample'], 500, "GET /index is 500";

done_testing;
