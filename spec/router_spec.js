describe('router.js', function(){

  describe('router', function(){

    it('creates a global var named router', function(){
      expect(typeof(router)).toEqual('object');
    });

    it('creates regex for matching routes', function(){
      expect(router.createMatchString("foo/:id")).toEqual('foo\/(.+)');
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
      expected["foo\/(.+)"] = {};
      expected["foo\/(.+)"].foo= ['bar'];
      expect(router.routes).toEqual(expected);
    });

    it('returns true when the route is recognized', function(){
      router.register({
        foo: "foo/:bar"
      });
      expect(router.recognize('foo/13')).toBe(true);
    });

    it('returns false when the route is not recognized', function(){
      router.register({
        foo: "foo/:bar"
      });
      expect(router.recognize('asdf')).toBe(false);
    });

    it('fires an event if a route has been registered', function(){
      router.register({
        foo: "foo/:bar"
      });
      var spy = jasmine.createSpy('eventSpy');
      document.addEventListener('foo', spy);
      router.recognize('foo/14');
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

  });

  describe('the monkeypatch', function(){
    it('monkeypatches window.history.pushState so it fires an event', function(){
      //why in God's name would this _not_ fire an event?
      var spy = jasmine.createSpy('eventSpy');
      document.addEventListener('pushstate', spy);
      window.history.pushState({}, null, "foo");
      expect(spy).toHaveBeenCalled();
    });
  });

});
