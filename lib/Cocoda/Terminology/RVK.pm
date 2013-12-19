package Cocoda::Terminology::RVK;
use v5.14;
use Moo;

extends 'Cocoda::Terminology';
with 'Cocoda::Role::JSONClient';

use URI::Escape;

has '+title' => (
    default => sub { 'Regensburger Verbundklassifikation' }
);

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

    my $concept = rvk_to_cocoda( $data->{node} );

    if ($options{ancestors}) {
        if (my $data = $self->get("/ancestors/$notation")) {
            # debug($data);
            my $nodes = $data->{node};
            $nodes = [$nodes] unless ref $nodes eq 'ARRAY';
            $concept->{ancestors} = [
                map { rvk_to_cocoda($_) } @$nodes
            ]
        }
    }

    if ($options{narrower}) {
        if (my $data = $self->get("/children/$notation")) {
            $concept->{narrower} = [
                map { rvk_to_cocoda($_) } @{$data->{node}{children}{node}}
            ]
        }
    }

    return $concept;
}

sub search {
    my ($self, $query) = @_;

    $query = uri_escape($query);
    my $data = $self->get("/nodes/$query") or return;

    return [ map { rvk_to_cocoda($_) } @{$data->{node}} ];
}

sub top {
    my ($self) = @_;

    my $data = $self->get("/children") or return;
    return [ map { rvk_to_cocoda($_) } @{$data->{node}{children}{node}} ];
}

sub rvk_to_cocoda {
    my ($node) = @_;

    my $concept = { 
        notation => ($node->{notation} // ''),
        label    => {
            de => $node->{benennung}
        },
    };

    $concept->{register} = $node->{register} 
        if exists $node->{register};
    $concept->{narrower} = [ ]
        if ($node->{has_children} // 'yes') ne 'yes';

    return $concept;
}

1;
