package Cocoda::Terminology::RVK;
use v5.14;
use Moo;

extends 'Cocoda::Terminology';
with 'Cocoda::Role::JSONClient';

use URI::Escape;

has '+title' => (
    default => sub { 'Regensburger Verbundklassifikation' }
);

sub concept {
    my ($self, $notation, %options) = @_;

    $notation =~ s/[ _]/+/g;
    my $url = "http://rvk.uni-regensburg.de/api/json/node/$notation";
    my $data = $self->jsonclient($url) or return;

    my $concept = rvk_to_cocoda( $data->{node} );

    if ($options{ancestors}) {
        my $url = "http://rvk.uni-regensburg.de/api/json/ancestors/$notation";
        if (my $data = $self->jsonclient($url)) {
            $concept->{ancestors} = [
                map { rvk_to_cocoda($_) } @{$data->{node}}
            ]
        }
    }

    if ($options{narrower}) {
        my $url = "http://rvk.uni-regensburg.de/api/json/children/$notation";
        if (my $data = $self->jsonclient($url)) {
            $concept->{narrower} = [
                map { rvk_to_cocoda($_) } @{$data->{node}{children}{node}}
            ]
        }
    }

    return $concept;
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
    $concept->{children} = 0
        if ($node->{has_children} // 'yes') ne 'yes';

    return $concept;
}

sub search {
    my ($self, $query) = @_;

    $query = uri_escape($query);
    my $url = "http://rvk.uni-regensburg.de/api/json/nodes/$query";
    my $data = $self->jsonclient($url) or return;

    return [ map { rvk_to_cocoda($_) } @{$data->{node}} ];
}

sub top {
    my ($self) = @_;

    my $url = "http://rvk.uni-regensburg.de/api/json/children";
    my $data = $self->jsonclient($url) or return;
    return [ map { rvk_to_cocoda($_) } @{$data->{node}{children}{node}} ];
}

1;
