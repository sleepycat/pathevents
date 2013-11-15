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

  });

});
