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

// XXX: this is doing WAY to many things
router.recognize = function(path){
  for(var route in router.routes){
    var regex = new RegExp(route);
    matchData = regex.exec(path);
    var details = {};
    details.path = path;
    if(matchData !== null){
      var segmentValues = matchData.slice(1);
      for(var count=0, length = router.routes[route].length; count < length; count++){
        details[segment[count]]=matchData[count];
      }
      var event = document.createEvent('CustomEvent');
      event.initCustomEvent(Object.keys(router.routes[route])[0], true, false, details);
      document.dispatchEvent(event);
    }else{
      var event = document.createEvent('CustomEvent');
      event.initCustomEvent('404', true, false, details);
      document.dispatchEvent(event);
    }
  }
}
