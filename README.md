#Pathevents

Pathevents gives a simple way to link a url to an event.

All you need to be doing on the backend is respond to a variety of
routes with the same page, and let the router deal with what to do.
If you are using Rails that might look like putting something like
this at the bottom of your routes.rb:

    get "*path" => "home#index"

Then on the page that will be served, pass an object to router.register
to create the routes:

    <html>
    <head>
    <script src="/javascripts/router.js"></script>
    <script>
      router.register({
          "root": '/',
          "foo": "foo/:bar",
          "fizz": "fizz/:buzz",
          "asdf": "asdf/:first/:second"
      });
      // listen for replacestate and pushstate stuff
      // and run router.recognize when it happens:
      router.listen();

      document.addEventListener('root', function(e){
        console.log('you hit the root path!');
      });
      document.addEventListener('foo', function(e){
        console.log(e.detail.bar);
      });
      document.addEventListener('fizz', function(e){
        console.log(e.detail.buzz);
      });
      document.addEventListener('asdf', function(e){
        console.log(e.detail.first);
        console.log(e.detail.second);
      });
      // Now that event listeners are set up,
      // and the page has loaded... do we recognize
      // the path?
      router.recognize(location.pathname);
    </script>
    </head>
    <body>
    <p>this is a test page</p>
    </body>
    </html>

The code above gives us a page that when loaded with a path of "/foo/42"
will fire a "foo" event with with the e.detail.bar giving us "42".

This is an experiment aimed at solving deeplinking and routing issues in
single page application I am working on.

## Contributing

1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request

##Author

Mike Williamson, [@dexterchief](https://twitter.com/dexterchief) /
[http://mikewilliamson.wordpress.com](http://mikewilliamson.wordpress.com)
