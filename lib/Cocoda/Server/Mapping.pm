package Cocoda::Server::Mapping;
use v5.14;
use Dancer2;

prefix '/mapping';

# Return a list and/or general information about stored mappings
# query parameters are supported to search for mappings.
get '/' => sub {
    send_error('not implemented yet',500);
};

# Add a new mapping
post '/' => sub {
    send_error('mapping not found',404);
};

# Return an existing mapping
get '/:id' => sub {
    my $id = params->{mapping};
    send_error('mapping not found',404);
};

# Modify an existing mapping
put '/:id' => sub {
    my $id = params->{mapping};
    send_error('mapping not found',404);
};

1;
