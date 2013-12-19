package Cocoda::Role::JSONClient;
#ABSTRACT: HTTP client to query a JSON API
use v5.14;
use Moo::Role;
use Furl;
use JSON;

has agent => (
    is => 'ro',
    default => sub { 'Mozilla/5.0' }
);

has furl => (
    is => 'ro',
    lazy => 1,
    builder => sub { Furl->new( timeout => 10, agent => $_[0]->agent ) }
);

has base => (
    is => 'ro',
    required => 1
);

sub get {
    my ($self, $path, %query) = @_;

    # TODO: better catch errors

    my $url = $self->base . $path; # TODO: add %query
    my $res = $self->furl->get($url);
    return unless $res->is_success;
    my $data = JSON->new->utf8(0)->decode($res->content);

    return $data;
}

1;
