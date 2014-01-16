package Cocoda::Terminology::GNDSubjects;
use v5.14;
use Moo;

extends 'Cocoda::Terminology';

has '+title' => (
    default => sub { 'Sachschlagwörter der Gemeinsamen Normdatei' }
);

with 'Cocoda::Role::JSONClient';
has '+base' => (
    default => sub { 'http://api.lobid.org/subject' }
);

sub concept {
    my ($self, $id, %options) = @_;

    my $data = $self->get(id => $id, format => 'full') or return;
    _to_cocoda($data);
}

sub topConcepts {
    [ ]; # no top concepts
}

sub search {
    my ($self, $query) = @_;

    my $data = $self->get(q => $query, format => 'full') or return;

    use Data::Dumper;
    print STDERR Dumper($data);

    return [ map { _to_cocoda($_) } @$data ];
}

sub _to_cocoda {
    my ($gnd) = @_;
    
    my ($caption) = map { $gnd->{$_} } grep { $_ =~ /^preferredName/ } keys %$gnd;

    return { 
        notation => ($gnd->{gndIdentifier} // ''),
        label    => {
            de => $caption
        },
    };

    # TODO: broader/narrower
}

1;
