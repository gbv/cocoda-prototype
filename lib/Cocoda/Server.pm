package Cocoda::Server;
use v5.14;
use Dancer2;

use Cocoda::Server::Terminology;
use Cocoda::Server::Mapping;
use Cocoda::Server::Sample;

set serializer => 'JSON';

prefix undef;

# Return information about the Cocoda server
get '/' => sub {
    my $base    = request->uri_base;
    my $version = config->{version};
    my $title   = config->{title} // "Cocoda server";
    return {
        title    => $title,
        version  => $version,
        services => {
            terminologies => "$base/terminology",
            mappings      => "$base/mapping",
            samples       => "$base/sample",
        }
    };
};

#any qr{.*} => sub {
#    send_error('not found',404);
#};

1;

=head1 DESCRIPTION

A Cocoda Server can provide multiple services, each implemented in
a Perl package of its own:

=over

=item /terminology

L<Cocoda::Server::Terminology>

=item /mapping

L<Cocoda::Server::Mapping>

=item /sample

L<Cocoda::Server::Sample>

=back

=cut

=encoding utf8
