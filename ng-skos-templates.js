angular.module('ngSKOS').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('template/skos-concept-thesaurus.html',
    "<div class=\"skos-concept-thesaurus\"><ul ng-if=\"ancestors.length\" class=\"ancestors\"><span ng-if=\"inScheme\" class=\"classification\">{{inScheme}}</span><li class=\"ancestor\" ng-repeat=\"a in ancestors\"><span skos-label=\"a\" lang=\"{{language}}\" ng-click=\"update(a);reload();\"></span></li></ul><div class=\"top top-classic\"><span ng-if=\"notation\" class=\"notation\">{{notation[0]}}</span> <b><span skos-label=\"concept\" lang=\"{{language}}\"></span></b><a ng-if=\"notation\" class=\"uri\" href=\"{{uri}}\"><span style=\"vertical-align:-10%\" class=\"glyphicon glyphicon-globe\"></span></a></div><div ng-if=\"broader.length\" class=\"skos-concept-thesaurus-relation\"><b>Broader Terms:</b><ul ng-repeat=\"b in broader\" ng-click=\"update(b);reload();\"><li><span skos-label=\"b\" lang=\"{{language}}\"></li></ul></div><div ng-if=\"narrower.length\" class=\"skos-concept-thesaurus-relation\"><b>Narrower Terms:</b><ul ng-repeat=\"n in narrower\" ng-click=\"update(n);reload();\"><li><span skos-label=\"n\" lang=\"{{language}}\"></li></ul></div><div ng-if=\"related.length\" class=\"skos-concept-thesaurus-relation\"><b>Related Terms:</b><ul ng-repeat=\"r in related\" ng-click=\"update(r);reload();\"><li><span skos-label=\"r\" lang=\"{{language}}\"></li></ul></div></div>"
  );


  $templateCache.put('template/skos-concept.html',
    "<div class=\"skos-concept\"><div class=\"top top-alt\"><span ng-if=\"notation\" class=\"notation\">{{notation[0]}}</span> <b><span skos-label=\"concept\" lang=\"{{language}}\"></span></b><a ng-if=\"notation\" class=\"uri\" href=\"{{uri[0]}}\"><span class=\"glyphicon glyphicon-globe\"></span></a></div><div ng-if=\"altLabel.length\" style=\"margin-bottom:5px; border:1px solid #ddd\"><ul><li ng-repeat=\"alt in altLabel\"><span ng-if=\"$index < 5\" style=\"display:inline\">{{alt}}</span> <span style=\"margin-left:-4px\" ng-if=\"$index < altLabel.length-1\">,</span></li></ul></div><div ng-if=\"broader.length\" class=\"skos-concept-relation\"><ul ng-repeat=\"c in broader\" ng-click=\"update(c);reload();\"><li>&#8598; <span skos-label=\"c\" lang=\"{{language}}\"></span></li></ul></div><div ng-if=\"narrower.length\" class=\"skos-concept-relation\"><ul ng-repeat=\"c in narrower\" ng-click=\"update(c);reload();\"><li>&#8600; <span skos-label=\"c\" lang=\"{{language}}\"></span></li></ul></div><div ng-if=\"related.length\" class=\"skos-concept-relation\"><ul ng-repeat=\"c in related\" ng-click=\"update(c);reload();\"><li>&#10137; <span skos-label=\"c\" lang=\"{{language}}\"></span></li></ul></div></div>"
  );


  $templateCache.put('template/skos-mapping.html',
    "<div class=\"skos-mapping\"><div class=\"mappingResults\"><div class=\"mappingResults-from\"><div class=\"mapping-label\"><span class=\"classification\">{{from[0].inScheme.notation[0]}}</span></div><ul><li ng-repeat=\"from in from\"><span class=\"notation\" popover=\"{{from.prefLabel.en}}\" popover-trigger=\"mouseenter\">{{from.notation[0]}}</span></li></ul></div><div class=\"mappingResults-icon\"><big><span ng-if=\"from.length\" class=\"glyphicon glyphicon-arrow-right\"></span></big></div><div class=\"mappingResults-to\"><div class=\"mapping-label\"><span class=\"classification\">{{to[0].inScheme.notation[0]}}</span></div><ul><li ng-repeat=\"target in to\"><span class=\"notation\" popover=\"{{target.prefLabel.en}}\" popover-trigger=\"mouseenter\">{{target.notation[0]}}</span></li></ul></div></div><div class=\"mappingFoot\"><ul ng-if=\"from.length\"><li><span><b>Type:</b></span> <span>{{type}}</span> <span><b>Date added:</b></span> <span>{{timestamp}}</span></li></ul></div></div>"
  );


  $templateCache.put('template/skos-occurrences.html',
    "<div class=\"skos-occurrences\"><div class=\"skos-occurrences occ-details\"><table><tr><td>Used notation:</td><td><span ng-if=\"search.length\" class=\"notation\" popover=\"{{search[0].prefLabel.en}}\" popover-trigger=\"mouseenter\">{{search[0].notation[0]}}</span></td></tr><tr><td><b>Used</b> concept scheme:</td><td><span ng-if=\"search.length\" class=\"classification\">{{search[0].inScheme.notation[0]}}</span></td></tr><tr><td><b>Target</b> concept scheme:</td><td><span ng-if=\"search.length\" class=\"classification\">{{target.notation[0]}}</span></td></tr><tr><td>Used database:</td><td><span ng-if=\"search.length\" class=\"dbase\">{{database.notation[0]}}</span></td></tr><tr ng-if=\"search.length\"><td>Results (total) for <span ng-if=\"search.length\" class=\"notation\" popover=\"{{search[0].prefLabel.en}}\" popover-trigger=\"mouseenter\">{{search[0].notation[0]}}</span>:</td><td>{{total}}</td></tr></table></div><div class=\"skos-occurrences occ-results\">Corresponding notations in <span ng-if=\"search.length\" class=\"classification\">{{target.notation[0]}}</span>:<table ng-if=\"search.length\" class=\"table table-hover table-striped table-condensed table-bordered\"><thead><tr><th>Notation</th><th>total</th><th>% of total results</th></tr></thead><tbody><tr ng-repeat=\"not in hits\"><td><span ng-if=\"not.length\" class=\"notation\" popover=\"{{not[0].prefLabel.en}}\" popover-trigger=\"mouseenter\">{{not[0].notation[0]}}</span></td><td>{{not[1]}}</td><td>{{not[1]/total*100 | number:1}} %</td></tr></tbody></table></div></div>"
  );


  $templateCache.put('template/skos-search.html',
    "<div class=\"concept concept-search\"></div>"
  );


  $templateCache.put('template/skos-tree.html',
    "<div class=\"skos-tree\"><p class=\"set\"><span ng-if=\"tree.notation\" class=\"notation\">{{tree.notation[0]}}</span> <span class=\"nlabel\">{{ tree.prefLabel.en }}</span></p><ul><li ng-repeat=\"n in tree.narrower\"><span skos-tree=\"n\"></span></li></ul></div>"
  );

}]);
