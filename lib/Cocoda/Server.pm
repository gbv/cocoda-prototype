package Cocoda::Server;
use v5.14;
use Dancer2;

use Cocoda::Server::Terminology;
use Cocoda::Server::Mapping;
use Cocoda::Server::Occurrence;

use Encode;

# TODO: Fix UTF8 mess
set serializer => 'JSON';
hook after => sub {
    content_type 'application/vnd.cocoda+json';

    # http://tools.ietf.org/html/draft-wilde-profile-link-04
    if (my $profile = config->{profile}) {
        header 'Link', "<$profile>; rel=\"profile\"";
    }

#    my $content = $_[0]->content; # is double encoded
#    $_[0]->content( encode('utf8',decode('utf8',$content)) );
#    $_[0]->{content_type} .= '; encoding=UTF-8';
#    $_[0]->{content} = decode('utf8',$content);
#    print STDERR $_[0];
};

prefix undef;

# Return information about the Cocoda server
get '/' => sub {
    my $base    = request->uri_base;
    my $version = config->{version};
    my $title   = config->{title} // "Cocoda server";
    return {
        provider => {
            title    => $title,
            foo      => 'äöü',
            version  => $version,
            services => {
                terminologies => "$base/terminology",
                mappings      => "$base/mapping",
                occurrences   => "$base/occurrence",
            }
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

=item /occurrence

L<Cocoda::Server::Occurrence>

=back

=cut

=encoding utf8
