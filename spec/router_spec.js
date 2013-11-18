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


  });

});
