//var path = window.location.pathname;

var router = {};
router.routes = [];

//router fires onload and tries to match
//gives 404 or whatever if no route matches
//listens for hashchange event and tries to match

// remove leading slash
// escape rest of the slashes
// sub in (.+)
// save as regex
// 'foo/:id/:bar'.match(/:\w+/g)
// [":id", ":bar"]
// 'foo/1/baz'.match(/foo\/(.+)\/(.+)/)
// ["foo/1/baz", "1", "baz"]

router.register = function(route_collection){
  for(var route_name in route_collection){
    if(route_collection.hasOwnProperty(route_name)){
      router.routes[route_name] = route_collection[route_name].replace(/:\w+/, '(.+)');
    }
  }
};

router.recognize = function(pathname){
  
};

router.register({
  foo: "foo/:id"
});
