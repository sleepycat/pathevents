//router fires onload and tries to match
//gives 404 or whatever if no route matches
//listens for hashchange event and tries to match

var router = {};
router.routes = {};

router.createMatchString = function(pathSpec){
  var slashesEscaped = pathSpec.replace('/', '\/');
  var matchString = slashesEscaped.replace(/:\w+/g, '(.+)');
  return matchString;
};

router.getSegments = function(pathSpec){
  var segments = pathSpec.match(/:\w+/g);
  for(var count=0, length = segments.length; count < length; count++) {
     segments[count] = segments[count].replace(/:/g, '');
  }
  return segments;
};

router.register = function(routeCollection){
  for(var routeName in routeCollection){
    if(routeCollection.hasOwnProperty(routeName)){
      var matchString = this.createMatchString(routeCollection[routeName]);
      var segments = this.getSegments(routeCollection[routeName]);
      router.routes[matchString] = {};
      router.routes[matchString][routeName]= segments;
      return router.routes;
    }
  }
};
