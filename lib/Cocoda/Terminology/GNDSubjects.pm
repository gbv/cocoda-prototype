package Cocoda::Terminology::GNDSubjects;
use v5.14;
use Moo;

extends 'Cocoda::Terminology';

has '+prefLabel' => (
    default => sub { {
        de => 'Sachschlagwörter der Gemeinsamen Normdatei',
        en => 'Subject headings of Integrated Authority File (GND)',
    } }
);

with 'Cocoda::Role::JSONClient';
has '+base' => (
    default => sub { 'http://api.lobid.org/subject?format=full' }
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

    my $data = $self->get( name => $query ) or return;

    use Data::Dumper;
    print STDERR Dumper($data);

    return [ map { _to_cocoda($_) } @$data ];
}

sub _to_cocoda {
    my ($gnd) = @_;
    
    my ($prefLabel) = map { $gnd->{$_} } grep { $_ =~ /^preferredName/ } keys %$gnd;

    my $id = $gnd->{gndIdentifier};
    my $concept = { 
        notation  => $id,
        uri       => "http://d-nb.info/gnd/$id",
        prefLabel => { de => $prefLabel },
    };

    if (my $broader = $gnd->{broaderTermGeneral}) {;
        $concept->{broader} = [ 
            map { $_ if $_ =~ s|^http://d-nb\.info/gnd/||; } 
            (ref $broader ? @$broader : $broader) 
        ];
    }

    # TODO: narrower
    # TODO: synonyme und erläuterung

    return $concept;
}

1;
