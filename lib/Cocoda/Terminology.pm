package Cocoda::Terminology;
#ABSTRACT: Abstract base class of terminologies
use v5.14;
use Moo;

has prefLabel => ( 
    is => 'ro', 
    default => sub { 'unknown' }
); 

has key => (
    is => 'ro', 
    default => sub {
        lc($1) if ref($_[0]) =~ /^Cocoda::Terminology::(.+)/;
    }
);

has uri => (
    is => 'ro',
);

1;

=head1 DESCRIPTION

A terminology must provide at least the following attributes:

=over

=item key

A lowercase letter code to uniquely identify the terminology within the scope
of a Cocoda server. A class Cocoda::Terminology::FOO, if derived from
Cocoda::Terminology, will automatically get the default key "foo".

=item prefLabel

A human-readable title. Will be used as prefLabel.

=item uri

An URI for uniquely identifying the terminology (optional).

=back

A terminology should implement the following query methods:

=head1 concept($concept)

Look up a concept. Expected to return a hash reference with the (optional)
fields notation, prefLabel, narrower, broader, and ancestors as defined by
the Cocoda specification.

=head2 search($query)

Full-text search for concepts.

Expected to return an array reference of concepts (see method C<concept>).

=head2 topConcepts()

Return a list of top concepts. 

Expected to return an array reference of concepts (see method C<concept>).

=encoding utf8
