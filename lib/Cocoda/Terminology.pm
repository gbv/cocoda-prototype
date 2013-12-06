package Cocoda::Terminology;
#ABSTRACT: Abstract base class of terminologies
use v5.14;
use Moo;

has 'title' => ( 
    is => 'ro', 
    default => sub { 'unknown' } 
); 

has 'key' => (
    is => 'ro', 
    default => sub {
        lc($1) if ref($_[0]) =~ /^Cocoda::Terminology::(.+)/;
    }
);

sub about {
    my ($self) = @_;
    return {
        title => $self->title,
        key   => $self->key,
    };
}

1;

=head1 DESCRIPTION

For each terminology, a subclass of Cocoda::Terminology must be implemented as
Cocoda::Terminology::SOMENAME. The subclass should implement the following
methods:

=head1 concept($concept)

Look up a concept.

Expected to return a hash reference with the following (optional) fields:

=over

=item notation

=item label

Hash reference that maps language tags to main labels.

=item narrower

List of narrower/child concepts.

=item ancestors

List of all broader transitive concepts.

=back

=head2 search($query)

Full-text search for concepts.

Expected to return an array reference of concepts (see method C<concept>).

=head2 top

Return a list of top concepts. 

Expected to return an array reference of concepts (see method C<concept>).

=encoding utf8
