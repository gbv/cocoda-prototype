package Cocoda::Server::Terminology;
use v5.14;
use Dancer2;

use Cocoda::Terminology;
use Cocoda::Util;

prefix '/terminology';

# load terminologies specified in config file
my $terminologies = { };
foreach (@{ config->{terminologies} // [ ] }) {
    my ($class, $args) = ref $_ ? %$_ : ($_,{});
    my $t = Cocoda::Util::new_instance($class, 'Cocoda::Terminology', %$args);
    # TODO: warn if key already used
    $terminologies->{ $t->key } = $t;
}

sub about_terminology {
    my ($t) = @_;

    return unless $t;

    my $prefLabel = $t->prefLabel;
    my $key = $t->key;

    my @parameters;
    push @parameters, 'search' if $t->can('search');
    my $url = request->uri_base . "/terminology/$key";
    $url .= '{?'.join(',',@parameters).'}' if @parameters;

    my $about = { 
        prefLabel => ref $prefLabel ? $prefLabel : { en => $prefLabel },
        url       => $url,
    };
    $about->{uri} = $t->uri if $t->uri;

    return $about;
}

# Return a list of known terminologies
get '/' => sub {
    # TODO: filter and query
    # TODO: add short name (notation)
    return {
        terminologies => [
            map { about_terminology($_) } values %$terminologies
        ]
    }
};

# Return information about a terminology, possibly with concepts 
get qr{/(?<terminology>[^/]+)/?$} => sub {
    my $key = captures->{terminology};
    if (my $terminology = $terminologies->{$key}) {
        my $search   = params->{search};
#        my $expand   = params->{expand}; # broader|narrower|ancestors

        my $response = { 
            terminology => about_terminology( $terminologies->{key} )
        };

        if (defined $search) {
            if ($terminology->can('search')) {
                $response->{concepts} = $terminology->search($search);
            } else {
                send_error('terminology does not support search',404);
            }
        } else {
            if ($terminology->can('topConcepts')) {
                $response->{topConcepts} = $terminology->topConcepts();
            }
        }

        return $response;
    } else {
        send_error('terminology not found',404);
    }
};

# Return information about a concept
get qr{/(?<terminology>[^/]+)/(?<concept>.+)$} => sub {
    if (my $terminology = $terminologies->{ captures->{terminology} }) {
        if ($terminology->can('concept')) {
            my %options = (
                map { $_ => params->{$_} } grep { params->{$_} }
                    qw(narrower broader ancestors)
            );
            if (my $concept = $terminology->concept( captures->{concept}, %options )) {
                return {
                    concept => $concept
                };
            } else {
                send_error('concept not found',404);
            }
        } else {
            send_error('terminology does not support search',404);
        }
    } else {
        send_error('terminology not found',404);
    } 
};

1;

=head1 DESCRIPTION

A concept in Cocoda belongs to exactely one terminology. The JSON format of a concept
is defined in the Cocoda specification.

=head1 QUERIES

=over

=item C</>

General infomation about a terminology. This may includes a list
of top concepts, if supported.

=item C</?search=...>

Full text search in a terminology.

=item C</...>

Lookup of a concept. Query parameters C<narrower>, C<broader>, and
C<ancestors> can be used to also return connected concepts.

=encoding utf8
