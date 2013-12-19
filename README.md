#Pathevents

Pathevents gives a simple way to link a url to an event.

    <html>
    <head>
    <script src="/javascripts/router.js"></script>
    <script>
      router.register({
          foo: "foo/:bar",
          fizz: "fizz/:buzz",
          asdf: "asdf/:first/:second"
      });
      // listen for replacestate and pushstate stuff
      // and run router.recognize when it happens:
      router.listen();

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

      router.recognize(location.pathname);
    </script>
    </head>
    <body>
    <p>this is a test page</p>
    </body>
    </html>

This is an experiment aimed at solving deeplinking and routing issues in
single page application I am working on. Feel free to try it out but
keep in mind that I'm not even using this yet.

## Contributing

1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request
