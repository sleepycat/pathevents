describe('router.js', function(){

  describe('router.getEventName', function(){

    it('retrieves the event name from a given route', function(){
      var route = {"^/foo/(.+)$": {foo: ['bar']}};
      expect(router.getEventName(route["^/foo/(.+)$"])).toEqual('foo');
    });

  });

  describe('router.getSegmentNames', function(){

    it('retrieves the segment names from a given route', function(){
      var route = {"^/foo/(.+)$": {foo: ['bar']}};
      expect(router.getSegmentNames(route["^/foo/(.+)$"])).toEqual(['bar']);
    });

  });

  describe('router.assembleParams', function(){

    it('assembles an object containing the details of the request', function(){
      // this object will be the details obj in a custom event;
      var segmentNames = ['bar', 'buzz'], segmentValues = ['32', '42'], path = '/foo/32/fizz/42';
      var expected = {path: '/foo/32/fizz/42', bar: '32', buzz: '42'};
      expect(router.assembleParams(path, segmentNames, segmentValues)).toEqual(expected);
    });

  });

  describe('router', function(){

    afterEach(function(){
      // this pushstate stuff is messing wtth karma:
      window.history.replaceState(null, null, '/');
    });

    it('creates a global var named router', function(){
      expect(typeof(router)).toEqual('object');
    });

    it('creates regex for matching routes', function(){
      expect(router.createMatchString("foo/:id")).toEqual('^/foo\/(.+)$');
    });

    it('adds a leading slash to regex', function(){
      expect(router.createMatchString("foo/:id")).toEqual('^/foo\/(.+)$');
    });

    it('pulls out dynamic segments from the path spec', function(){
      expect(router.getSegments('foo/:id')).toEqual(['id']);
    });

    it('can deal with multiple segments', function(){
      expect(router.getSegments('foo/:bar/:baz')).toEqual(['bar', 'baz']);
    });

    it('parses path specs to create routes', function(){
      router.register({
        foo: "foo/:bar"
      });

      expected = {};
      expected["^/foo/(.+)$"] = {};
      expected["^/foo/(.+)$"].foo= ['bar'];
      expect(router.routes).toEqual(expected);
    });



    it('returns true when the route is recognized', function(){
      router.register({
        foo: "foo/:bar"
      });
      expect(router.recognize('/foo/13')).toBe(true);
    });

    it('returns false when the route is not recognized', function(){
      router.register({
        foo: "foo/:bar"
      });
      expect(router.recognize('/asdf')).toBe(false);
    });

    it('fires an event if a route has been registered', function(){
      router.register({
        foo: "foo/:bar"
      });
      var spy = jasmine.createSpy('eventSpy');
      document.addEventListener('foo', spy);
      router.recognize('/foo/14');
      expect(spy).toHaveBeenCalled();
    });

    it('fires a 404 event if it cannot match the route', function(){
      var spy = jasmine.createSpy('eventSpy');
      document.addEventListener('404', spy);
      router.recognize('nothing');
      expect(spy).toHaveBeenCalled();
    });

    it('recognizes the current path when pushstate fires', function(){
      router.register({
        foo: "foo/:bar"
      });
      router.listen();
      var spy = jasmine.createSpy('eventSpy');
      document.addEventListener('foo', spy);
      window.history.pushState({}, null, "foo/42");
      expect(spy).toHaveBeenCalled();
    });

    it('recognizes the current path when replacestate fires', function(){
      router.register({
        foo: "foo/:bar"
      });
      router.listen();
      var spy = jasmine.createSpy('eventSpy');
      document.addEventListener('foo', spy);
      window.history.replaceState({}, null, "foo/42");
      expect(spy).toHaveBeenCalled();
    });

  });

  describe('the monkeypatch', function(){

    it('monkeypatches window.history.pushState so it fires an event', function(){
      //why in God's name would this _not_ fire an event?
      var spy = jasmine.createSpy('eventSpy');
      document.addEventListener('pushstate', spy);
      window.history.pushState({}, null, "foo");
      expect(spy).toHaveBeenCalled();
    });

    it('monkeypatches window.history.replacestate so it fires an event', function(){
      var spy = jasmine.createSpy('eventSpy');
      document.addEventListener('replacestate', spy);
      window.history.replaceState({}, null, "/foo");
      expect(spy).toHaveBeenCalled();
    });
  });

});
