package Cocoda::Terminology::DDC;
use v5.14;
use Moo;

extends 'Cocoda::Terminology';

has '+title' => (
    default => sub { 'Dewey Decimal Classification' }
);

# look up a concept
sub concept {
    my ($self, $id) = @_;
    return;
}

# full-text search for concepts
sub search {
    my ($self, $query) = @_;
    return;
}

1;
