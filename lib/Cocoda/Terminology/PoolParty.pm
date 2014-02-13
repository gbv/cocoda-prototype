package Cocoda::Terminology::PoolParty;
#ABSTRACT: PoolParty Thesaurus Service SKOS API Wrapper to Cocoda API
use v5.14;
use Moo;

extends 'Cocoda::Terminology';
with 'Cocoda::Role::JSONClient';

# default locale of the project
has 'locale' => (
    is      => 'ro',
    default => 'en'
);

sub concept {
    my ($self, $uri, %options) = @_;

    my $response = $self->get("/concept", 
        concept => $uri,
        properties => 'skos:altLabel,skos:hiddenLabel,skos:definition,skos:broader,skos:narrower,skos:related',
        # loclae => $self->locale
    ) or return;

    # debug($response);
    # if ($options{ancestors}) ...
    # if ($options{narrower}) ...

    return pp2cocoda($response, $self->locale);
}

# https://grips.semantic-web.at/display/public/POOLDOKU/Method%3A+getTopConcepts
sub topConcepts {
    my ($self) = @_;

    my $response = $self->get("/topconcepts", 
        properties => 'skos:altLabel,skos:hiddenlabel,skos:definition',
        locale     => $self->locale,
    ) or return;

    return [ map { pp2cocoda($_, $self->locale) } @$response ];
}

sub pp2cocoda {
    my ($ppc, $language) = @_;

    my $concept = { 
        uri         => map { $_ } $ppc->{uri},
        prefLabel   => map { { $language => $_ } } $ppc->{prefLabel},
        altLabel    => map { { $language => $_ } } $ppc->{altLabels},
        hiddenLabel => map { { $language => $_ } } $ppc->{hiddenLabels},
        definition  => map { $_ } $ppc->{definition},
    };

    foreach (keys %$concept) {
        delete $concept->{$_} unless defined $concept->{$_};
    }

    return $concept;
}

1;
