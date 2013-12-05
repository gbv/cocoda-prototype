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
