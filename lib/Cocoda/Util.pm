package Cocoda::Util;
use v5.14;

sub new_instance { # mostly copied from Plack::Util::load_class
    my ($class, $prefix, @args) = @_;
    
    if ($prefix) {
        unless ($class =~ s/^\+// || $class =~ /^$prefix/) {
            $class = "$prefix\::$class";
        }
    }

    my $file = $class;
    $file =~ s!::!/!g;
    require "$file.pm"; ## no critic

    return $class->new(@args);
}

1;
