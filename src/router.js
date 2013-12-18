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

router.listen = function(){
  window.addEventListener('pushstate', function(){
    router.recognize(window.location.pathname);
  });
  window.addEventListener('replacestate', function(){
    router.recognize(window.location.pathname);
  });
};

router.register = function(routeCollection){
  for(var routeName in routeCollection){
    if(routeCollection.hasOwnProperty(routeName)){
      var matchString = this.createMatchString(routeCollection[routeName]);
      var segments = this.getSegments(routeCollection[routeName]);
      router.routes[matchString] = {};
      router.routes[matchString][routeName]= segments;
    }
  }
};

// XXX: this is doing WAY to many things
router.recognize = function(path){
  for(var route in router.routes){
    var regex = new RegExp(route);
    var matchData = regex.exec(path);
    var details = {};
    var event = document.createEvent('CustomEvent');
    details.path = path;
    if(matchData !== null){
      var segmentValues = matchData.slice(1);
      for(var count=0, length = router.routes[route].length; count < length; count++){
        details[segment[count]]=matchData[count];
      }
      event.initCustomEvent(Object.keys(router.routes[route])[0], true, false, details);
      document.dispatchEvent(event);
      return true;
    }else{
      event.initCustomEvent('404', true, false, details);
      document.dispatchEvent(event);
      return false;
    }
  }
};


