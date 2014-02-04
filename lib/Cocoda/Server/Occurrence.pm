package Cocoda::Server::Occurrence;
use v5.14;
use Dancer2;

# for testing
our $databases = {
    gvk => {
        prefLabel => { en => 'GVK' }
    }
};

prefix '/occurrence';

# Return a list of known occurrences that make use of terminologies.
# Query parameters are supported to search for occurrences sources
get '/' => sub {
    $databases;
};

# Return information about a named occurrence
get '/:database' => sub {
    my $key  = params->{occurrence};
    if (my $database = $databases->{$key}) {
        send_error('not implemented yet',500);
    } else {
        send_error('database not found',404);
    }
};

# Search for occorrences of some terminology 
put '/:database/:terminology' => sub {
    my $database    = params->{database};
    my $terminology = params->{terminology};
    my $search      = params->{search};  # full text search

    my $from        = params->{from}; # notation terminology
    my $notation    = params->{notation};

    # e.g. search in database gvk for concept 10.11 from terminology BK to find DDC
    
    send_error('terminology not found',404);
};

1;

=head1 DESCRIPTION

Occurrences analyze occurrences of concepts from one terminology in a result set of
another terminology. The result contains at least:

=over

=item hits

Total number of result set.

=item occurrences

Mapping of target concepts to the number of hits in the result set.

=back

=cut
