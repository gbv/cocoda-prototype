package Cocoda::Terminology::RVK;
use v5.14;
use Moo;
use Furl;
use JSON;

extends 'Cocoda::Terminology';

has '+title' => (
    default => sub { 'Regensburger Verbundklassifikation' }
);

# look up a concept
sub concept {
    my ($self, $notation) = @_;

    my $furl = Furl->new( timeout => 10, agent => 'Mozilla/5.0' );
    $notation =~ s/[ _]/+/g;
    my $url = "http://rvk.uni-regensburg.de/api/json/node/$notation";

    my $res = $furl->get($url);
    return unless $res->is_success;
    my $data = JSON->new->utf8(0)->decode($res->content);

    my $concept = $data->{node};
    return {
        register => $concept->{register},
        notation => $concept->{notation},
        label    => $concept->{benennung},
        has_children => $concept->{has_children} eq 'yes' ? 1 : 0,
    };
}

# full-text search for concepts
sub search {
    my ($self, $query) = @_;
    return;
}

1;
