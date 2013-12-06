package Cocoda::Role::JSONClient;
use v5.14;
use Moo::Role;

use Furl;
use JSON;

has furl => (
    is => 'ro',
    lazy => 1,
    default => sub { Furl->new( timeout => 10, agent => 'Mozilla/5.0' ) }
);

sub jsonclient {
    my ($self, $url) = @_;

    # TODO: better catch errors
    my $res = $self->furl->get($url);
    return unless $res->is_success;
    my $data = JSON->new->utf8(0)->decode($res->content);

    return $data;
}

1;
