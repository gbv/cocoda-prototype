package Cocoda::Terminology::BK;
use v5.14;
use Moo;
use Furl;
use JSON;

extends 'Cocoda::Terminology';

has '+title' => (
    default => sub { 'Basisklassifikation' }
);

# look up a concept
sub concept {
    my ($self, $id) = @_;
    return unless $id =~ /^[0-9][0-9](\.[0-9][0-9])?$/;

    my $furl = Furl->new( timeout => 10, agent => 'Mozilla/5.0' );
    my $uri = "http://uri.gbv.de/terminology/bk/$id";

    my $res = $furl->get("$uri?format=json");
    return unless $res->is_success;
    my $rdf = decode_json($res->content);

    my $title = $rdf->{$uri}->{"http://purl.org/dc/elements/1.1/title"}->[0]->{"value"};

    return {
        uri => $uri,
        notation => $id,
        label => $title,
    };
}

# full-text search for concepts
sub search {
    my ($self, $query) = @_;
    return;
}

1;
