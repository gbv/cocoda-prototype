package Cocoda::Terminology::DDC;
use v5.14;
use Moo;

extends 'Cocoda::Terminology';

has '+prefLabel' => (
    default => sub { {
        en => 'Dewey Decimal Classification',
        de => 'Dewey-Dezimalklassifikation',
    } }
);

# look up a concept
sub concept {
    my ($self, $id) = @_;
    return;
}

1;
