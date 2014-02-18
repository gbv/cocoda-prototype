package Cocoda::Terminology::RVK;
use v5.14;
use Moo;

extends 'Cocoda::Terminology';

has '+prefLabel' => (
    default => sub { { 
        de => 'Regensburger Verbundklassifikation' 
    } }
);

with 'Cocoda::Role::JSONClient';
has '+base' => (
    default => sub { 'http://rvk.uni-regensburg.de/api/json' }
);

sub debug { # TODO: move to logging module
    use Data::Dumper;
    say STDERR ref($_[0]) ? Dumper($_[0]) : $_[0]; 
}

sub concept {
    my ($self, $notation, %options) = @_;

    $notation =~ s/[ _]/+/g;
    my $data = $self->get("/node/$notation") or return;

    # debug($data);

    my $concept = _to_cocoda( $data->{node} );

    if ($options{ancestors}) {
        if (my $data = $self->get("/ancestors/$notation")) {
            # debug($data);
            my $nodes = $data->{node};
            $nodes = [$nodes] unless ref $nodes eq 'ARRAY';
            $concept->{ancestors} = [
                map { _to_cocoda($_) } @$nodes
            ]
        }
    }

    if ($options{narrower}) {
        if (my $data = $self->get("/children/$notation")) {
            $concept->{narrower} = [
                map { _to_cocoda($_) } @{$data->{node}{children}{node}}
            ]
        }
    }

    return $concept;
}

use URI::Escape;

sub search {
    my ($self, $query) = @_;

    $query = uri_escape($query);
    my $data = $self->get("/nodes/$query") or return;

    return [ map { _to_cocoda($_) } @{$data->{node}} ];
}

sub topConcepts {
    my ($self) = @_;

    my $data = $self->get("/children") or return;
    return [ map { _to_cocoda($_) } @{$data->{node}{children}{node}} ];
}

sub _to_cocoda {
    my ($node) = @_;

    my $concept = { 
        notation => ($node->{notation} // ''),
        prefLabel => {
            de => $node->{benennung}
        },
    };

    $concept->{notes} = $node->{register} 
        if exists $node->{register};
    $concept->{narrower} = [ ]
        if ($node->{has_children} // 'yes') ne 'yes';

    return $concept;
}

1;