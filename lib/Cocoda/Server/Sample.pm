package Cocoda::Server::Sample;
use v5.14;
use Dancer2;

# for testing
our $samples = {
    gvk => {
        title => 'GVK'
    }
};

prefix '/sample';

# Return a list of known samples that make use of terminologies.
# Query parameters are supported to search for samples sources
get '/' => sub {
    $samples;
};

# Return information about a named sample
get '/:sample' => sub {
    my $key  = params->{sample};
    if (my $sample = $samples->{$key}) {
        send_error('not implemented yet',500);
    } else {
        send_error('sample not found',404);
    }
};

# Get a sample from some source and some terminology
put '/:sample/:terminology/:concept' => sub {
    my $sample      = params->{sample};
    my $terminology = params->{source};
    my $concept     = params->{concept};

    # query parameters
    my $target      = params->{target}; # e.g. ddc

    # e.g. search in sample gvk for concept 10.11 from terminology BK to find DDC
    
    send_error('mapping not found',404);
};

1;

=head1 DESCRIPTION

Samples analyze occurrences of concepts from one terminology in a result set of
another terminology. The result contains at least:

=over

=item hits

Total number of result set.

=item occurrences

Mapping of target concepts to the number of hits in the result set.

=back

=cut
