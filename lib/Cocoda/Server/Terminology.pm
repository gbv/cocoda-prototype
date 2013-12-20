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

# Return a list of known terminologies
get '/' => sub {
    my $base = request->uri_base;
    return {
        map {
            my $t = $terminologies->{$_};
            my $about = { 
                title => $t->title,
                key   => $_,
                url   => "$base/terminology/$_",
            };
            $about->{uri} = $t->uri if $t->uri;
            $_ => $about;
        } keys %$terminologies
    }
};

# Return information about a terminology, possibly with concepts 
get qr{/(?<terminology>[^/]+)/?$} => sub {
    my $key = captures->{terminology};
    if (my $terminology = $terminologies->{$key}) {
        my $search   = params->{search};
        my $expand   = params->{expand}; # broader|narrower|ancestors

        my $response = { 
            terminology => $terminology->about
        };

        if (defined $search) {
            if ($terminology->can('search')) {
                $response->{result} = $terminology->search($search);
            } else {
                send_error('terminology does not support search',404);
            }
        } else {
            if ($terminology->can('top')) {
                $response->{top} = $terminology->top();
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

A concept in Cocoda belongs to exactely one terminology. A concepts can have
the following properties:

=over

=item notation

Unique notation. This may be empty for some authority files and mandatory for
others.

=item label

Set of labels, each uniquely mapped from a language.

=item uri

URI for use of concepts in SKOS/RDF.

=item ancestors

...

=item narrower

...

=item broader

...

=item register

...

=item notes

...Anmerkungen...

=back

More properties, such as C<alias>, may be added in a later version.

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
