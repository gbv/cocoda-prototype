use v5.14;
use Test::More;
use File::Find;

find({ no_chdir => 1, wanted => sub {
        s{\.pm$}{}g or next;
        s{^lib/}{}g;
        s{/}{::}g;
        use_ok $_;
    } }, 'lib');

done_testing;
