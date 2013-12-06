package Cocoda::Server::Terminology;
use v5.14;
use Dancer2;

use Cocoda::Terminology;

prefix '/terminology';

use Cocoda::Terminology::RVK;
use Cocoda::Terminology::DDC;
use Cocoda::Terminology::BK;

my $terminologies = {
    map { $_->key => $_ }
    map { "Cocoda::Terminology::$_"->new } qw(RVK DDC BK)
};

# Return a list of known terminologies
get '/' => sub {
    my $base = request->uri_base;
    return {
        map {
            $_ => { 
                %{$terminologies->{$_}->about},
                url => "$base/terminology/$_" 
            }
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
