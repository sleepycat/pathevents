//router fires onload and tries to match
//gives 404 or whatever if no route matches
//listens for hashchange event and tries to match


(function(history){

  // TODO: this is repetitive:

  // Monkeypatch pushstate to generate an event:
  var pushState = history.pushState;
  history.pushState = function(state) {
    var pushstateReturnValue = pushState.apply(history, arguments);
    var event = document.createEvent('CustomEvent');
    var details = {
      'state': arguments[0],
      'title': arguments[1],
      'url': arguments[2]
    };
    event.initCustomEvent('pushstate', true, false, details);
    document.dispatchEvent(event);
    return pushstateReturnValue;
  };

  // Monkeypatch replacestate to generate an event:
  var replaceState = history.replaceState;
  history.replaceState = function(state) {
    var replacestateReturnValue = replaceState.apply(history, arguments);
    var event = document.createEvent('CustomEvent');
    var details = {
      'state': arguments[0],
      'title': arguments[1],
      'url': arguments[2]
    };
    event.initCustomEvent('replacestate', true, false, details);
    document.dispatchEvent(event);
    return replacestateReturnValue;
  };
})(window.history);


var router = {};
router.routes = {};

router.createMatchString = function(pathSpec){
  if(pathSpec.match(/^\/$/)){
    return '^\/$';
  }else if(pathSpec.match(/^\/\w+/)){
    pathSpec = '^' + pathSpec + '$';
  }else{
    pathSpec = '^/' + pathSpec + '$';
  }
  var matchString = pathSpec.replace(/:\w+/g, '(.+)');
  return matchString;
};

router.getSegments = function(pathSpec){
  var segments = pathSpec.match(/:\w+/g);
  if(segments === null){
    return [];
  } else {
    for(var count=0, length = segments.length; count < length; count++) {
       segments[count] = segments[count].replace(/:/g, '');
    }
    return segments;
  }
};

router.listen = function(){
  var recognize = function(){
    router.recognize(window.location.pathname);
  };
  window.addEventListener('pushstate', recognize);
  window.addEventListener('replacestate', recognize);
  window.addEventListener('popstate', recognize);
};

router.register = function(routeCollection){
  for(var routeName in routeCollection){
    if(routeCollection.hasOwnProperty(routeName)){
      var matchString = router.createMatchString(routeCollection[routeName]);
      var segments = router.getSegments(routeCollection[routeName]);
      router.routes[matchString] = {};
      router.routes[matchString][routeName]= segments;
    }
  }
};

router.getEventName = function(route){
  for(var key in route) break;
  return key;
};

router.getSegmentNames = function(route){
  for(var key in route) break;
  return route[key];
};

router.assembleParams = function(path, names, values){
  var details = {};
  for(var count=0, length = names.length; count < length; count++){
    details[names[count]]= values[count];
  }
  details.path = path;
  return details;
};

 // XXX: this is doing WAY to many things
router.recognize = function(path){
  var foundMatchingRoute = null;
  var event = document.createEvent('CustomEvent');
  for(var routeString in router.routes){
    //console.log("Path is: " + path + " and routestring: " + routeString);
    var regex = new RegExp(routeString);
    var matchData = regex.exec(path);
    //console.log("Matchdata for " + path + " is " + matchData);
    if(matchData !== null){
      var segmentValues = matchData.slice(1);
      var segmentNames = router.getSegmentNames(router.routes[routeString]);
      var detail = router.assembleParams(path, segmentNames, segmentValues);
      event.initCustomEvent(router.getEventName(router.routes[routeString]), true, false, detail);
      document.dispatchEvent(event);
      foundMatchingRoute = true;
      break;
    }
  }
  if(foundMatchingRoute === null){
    event.initCustomEvent('404', true, false, {path: path});
    document.dispatchEvent(event);
    return false;
  }else{
    return true;
  }
};

