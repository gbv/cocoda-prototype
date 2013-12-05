package Cocoda::Server::Sample;
use v5.14;
use Dancer2;

prefix '/sample';

# Return a list of known samples that make use of terminologies.
# Query parameters are supported to search for samples sources
get '/' => sub {
    send_error('not implemented yet',500);
};

# Return information about a named sample source
get '/:source' => sub {
    my $id = params->{mapping};
    send_error('mapping not found',404);
};

# Get a sample from some source and some terminology
put '/:source/:from/:concept' => sub {
    my $source  = params->{mapping};
    my $from    = params->{from};
    my $concept = params->{concept};
    # TODO: search via SRU
    send_error('mapping not found',404);
};

1;
