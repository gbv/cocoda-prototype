package Cocoda::Role::JSONClient;
#ABSTRACT: HTTP client to query a JSON API
use v5.14;
use Moo::Role;
use Furl;
use JSON;
use URI::Escape;

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
    my $self = shift;

    # TODO: better catch errors

    my $res = $self->furl->get( $self->url(@_) );
    return unless $res->is_success;
    my $data = JSON->new->utf8(0)->decode($res->content);

    return $data;
}

sub url {
    my $self = shift;
    my $path = @_ % 2 ? shift : undef;
    my %query = @_;

    my $url = $self->base;
    $url .= $path if defined $path;
    $url .= '?' . do {
        join '&', map { "$_=".uri_escape($query{$_}) } keys %query 
    } if %query;

    $url;
}

1;
