package Cocoda::Server::Mapping;
use v5.14;
use Dancer2;

prefix '/mapping';

# Return a list and/or general information about stored mappings.
# Query parameters are supported to search for mappings.
get '/' => sub {
    my $sourceTerminology = params->{sourceTerminology};
    my $targetTerminology = params->{targetTerminology};
    my $sourceConcept = params->{sourceConcept}; # may be array
    my $targetConcept = params->{targetConcept}; # may be array
    my $relevance = params->{relevance};

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

# TODO: Use document store (MongoDB/CouchDB/SQLite/...)
# to actually store and query mappings

1;

=head1 DESCRIPTION

A mapping consists of the following properties:

=over

=item id (single, unique)

Unique identifier, automatically assigned on creation. 

=item source (single)

Source terminology (e.g. C<ddc>).

=item target (single)

Target terminology (e.g. C<rvk>).

=item from (repeatable)

Source concepts of terminology C<source> that is mapped to another concept C<to>
in terminology C<target>.

=item to (repeatable)

Target concepts of terminology C<target> that concept C<from> is mapped to.

=item relevance (single, optional)

Relevance such as "high", "medium", or "low".

=item created (single)

Timestamp of creation.

=item modified (single)

Timestamp of last modification.

=back

Additional metadata such as creator will be added in a later version.

Information about each terminology can be queried from a Cocoda server at 
C</terminology/{source}> and C</terminology/{target}>.

Information about each concept can be queried from a Cocoda server at
C</terminology/{source}/{from}> and C</terminology/{target}/{to}>.

=cut

=encoding utf8
