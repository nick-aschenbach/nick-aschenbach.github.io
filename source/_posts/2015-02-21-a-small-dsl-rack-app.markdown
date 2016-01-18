---
layout: post
title: "Writing a Small DSL using Rack"
date: 2015-02-21 22:03:36 -0800
comments: true
categories: rack dsl
description: Building a small DSL like sinatra on top of rack
keywords: ruby rack dsl web
---

In this post, I write a small domain specific language to handle HTTP requests (inspired by
[Sinatra](http://www.sinatrarb.com/)) using Rack. We start by taking a quick look at a few small rack applications
and then write a small DSL.

** Rack **

Rack provides an abstraction layer between multiple web servers (unicorn, webrick, thin, etc) and your ruby application.
This allows developers to focus on the application layer instead of working on handling the low level details associated
with dealing with a HTTP request.

Let's take a look at the "hello world" example provided by [Rack](http://rack.github.io/):

{% codeblock lang:rb %}
require 'rack'

app = Proc.new do |env|
  ['200', {'Content-Type' => 'application/json'}, ['A barebones rack app.']]
end

Rack::Handler::WEBrick.run app
{% endcodeblock %}

To use rack, one must provide an object (class, proc or lambda) that responds to `call` and returns an array with
elements. The first element is a stringified HTTP status code. The second is a hash of response headers. The last
element is the response body, which must respond to the `each` method.

Let's run the rack app in one terminal and issue a HTTP request against it in a different one:

{% codeblock lang:bash %}
$ curl -v localhost:8080
> GET / HTTP/1.1
> User-Agent: curl/7.30.0
> Host: localhost:8080
> Accept: */*
>
< HTTP/1.1 200 OK
< Content-Type: application/json
< Server: WEBrick/1.3.1 (Ruby/2.1.1/2014-02-24)
< Date: Fri, 20 Feb 2015 06:19:57 GMT
< Content-Length: 18
< Connection: Keep-Alive
<
Barebones rack app
{% endcodeblock %}

<!-- more -->

Let's supply a class that implements a `call` class method. Let's also use `awesome_print` to interrogate the `env`
parameter:

{% codeblock lang:rb %}
require 'rack'
require 'awesome_print'

class RackApp
  def self.call(env)
    ap env

    ['200', {'Content-Type' => 'text/html'}, ['Hello World']]
  end
end

Rack::Handler::WEBrick.run RackApp
{% endcodeblock %}

Let's issue a HTTP request against this app using the bash command `curl -v localhost:8080/foobar?baz=true` and observe
the app output:

{% codeblock lang:bash %}
{
    "GATEWAY_INTERFACE" => "CGI/1.1",
            "PATH_INFO" => "/foobar",
         "QUERY_STRING" => "baz=true",
          "REMOTE_ADDR" => "::1",
          "REMOTE_HOST" => "localhost",
       "REQUEST_METHOD" => "GET",
          "REQUEST_URI" => "http://localhost:8080/foobar?baz=true",
          "SCRIPT_NAME" => "",
          "SERVER_NAME" => "localhost",
          "SERVER_PORT" => "8080",
      "SERVER_PROTOCOL" => "HTTP/1.1",
      "SERVER_SOFTWARE" => "WEBrick/1.3.1 (Ruby/2.1.1/2014-02-24)",
      "HTTP_USER_AGENT" => "curl/7.30.0",
            "HTTP_HOST" => "localhost:8080",
          "HTTP_ACCEPT" => "*/*",
         "rack.version" => [
        [0] 1,
        [1] 3
    ],
           "rack.input" => #<StringIO:0x0000010198dda0>,
          "rack.errors" => #<IO:<STDERR>>,
     "rack.multithread" => true,
    "rack.multiprocess" => false,
        "rack.run_once" => false,
      "rack.url_scheme" => "http",
         "rack.hijack?" => true,
          "rack.hijack" => #<Proc:0x0000010198dbe8@/Users/sela/.rvm/gems/ruby-2.1.1/gems/rack-1.6.0/lib/rack/handler/webrick.rb:77 (lambda)>,
       "rack.hijack_io" => nil,
         "HTTP_VERSION" => "HTTP/1.1",
         "REQUEST_PATH" => "/foobar"
}
localhost - - [19/Feb/2015:23:05:30 PST] "GET /foobar?baz=true HTTP/1.1" 200 11
- -> /foobar?baz=true
{% endcodeblock %}

The `env` hash provides some insight into the the facilities that Rack provides. Let's take a look at some of the HTTP
request components:

- `REQUEST_URI` provides the full request endpoint including protocol and endpoint and query string
parameters.
- `PATH_INFO` or `REQUEST_PATH` provides just the resource.
- `QUERY_STRING` breaks out the query string parameters delimited by the `&` character.
- `REQUEST_METHOD` indicates the HTTP verb used for the request. The `curl` command issues `GET`
requests by default unless we specify one via the `-X <HTTP_VERB>` parameter.
- Variables that start with `HTTP_*` correspond to HTTP request headers (e.g. `HTTP_ACCEPT` = `Accept`).

The [Rack interface specification](http://www.rubydoc.info/github/rack/rack/master/file/SPEC) provides more details.
Rack additionally provides middleware facilities like routing to different apps `Rack::URLMap`, Apache-like logging
`Rack::CommonLogger`, exception handling `Rack::ShowException` and `Rack::File` for serving static assets. There are
numerous rack middleware and utilities available as well via [rack-contrib](https://github.com/rack/rack-contrib).

** A Simple DSL **

A domain specific language is designed to solve problems for a particular application. In our case we want
to define a simple language to handle HTTP requests. While predominantly a Rails developer, I am enchanted by
Sinatra's minimal and expressive syntax. After digging into
[Sinatra's source](https://github.com/sinatra/sinatra) I felt inspired to write a small DSL for fun.

My goal is register a block of code that gets executed when a HTTP request is made to a particular endpoint:

{% codeblock lang:rb %}
get '/foobar' do
  'Hello world at /foobar'
end
{% endcodeblock %}

We want to associate `'/foobar'` with the block of code, which is defined within the `do ... end` block. A hash seems
like a convenient data structure for this purpose. First, let's define a class called `RackTest` that responds to
`call` with a `404` not found (we will change this later). Also, let's define an `add_callback` method that takes the
route as a string and associates it with a block of code in a `@callback` hash.

{% codeblock lang:rb %}
class RackTest
  def add_callback(route, &block)
    @callback ||= {}
    @callback[route] = block
  end

  def call(env)
    ['404', { 'Content-Type' => 'text/html' }, ['Resource not found']]
  end
end
{% endcodeblock %}

Now we need to define a get method outside of the `RackTest` class:

{% codeblock lang:rb %}
def get(route, &block)
  APP.add_callback(route, &block)
end
{% endcodeblock %}

Finally, let's put everything together. We need to call the block of code associated with a `REQUEST_PATH` from the
incoming HTTP request. If no endpoint is registered in the `@callback` hash, then we want to return a `404`:

{% codeblock lang:rb %}
require 'rack'

class RackTest
  def add_callback(route, &block)
    @callback ||= {}
    @callback[route] = block
  end

  def call(env)
    # Trigger callback if it exists
    ['200', {}, [response = @callback[env['REQUEST_PATH']].call]]

    # Nothing was registered
    rescue NoMethodError
      ['404', { 'Content-Type' => 'text/html' }, ['Resource not found']]
  end
end

APP = RackTest.new

def get(route, &block)
  APP.add_callback(route, &block)
end

get '/foobar' do
  'Hello world at /foobar'
end

Rack::Handler::WEBrick.run APP
{% endcodeblock %}

Let's exercise this code via curl:

{% codeblock lang:bash %}
$ curl -v localhost:8080/foobar
> GET /foobar HTTP/1.1
> User-Agent: curl/7.30.0
> Host: localhost:8080
> Accept: */*
>
< HTTP/1.1 200 OK
< Server: WEBrick/1.3.1 (Ruby/2.1.1/2014-02-24)
< Date: Sat, 21 Feb 2015 05:49:14 GMT
< Content-Length: 22
< Connection: Keep-Alive
<
Hello world at /foobar
{% endcodeblock %}

Our DSL is pretty limited, let's look into extending it. Minimally, I want to be able to specify the HTTP status code
and content type in the HTTP response headers.

Let's start with how we want to use the DSL in the `MyRack` class:

{% codeblock lang:rb %}
class MyRack < RackApp
  get '/foo' do
    status 201
    'Response from /foo'
  end

  get '/bar' do
    content_type 'application/json'
    'Response from /bar'
  end
end
{% endcodeblock %}

It is important to understand that the `do ... end` block is executed in the context of the `call(env)` method.
Therefore we would see a `NoMethodError`s for the `status` and `content_type` method calls because these methods are not
defined in `MyRack` or `RackApp`. We want to direct these method calls to a new class.

This class will serve as a data structure for our HTTP response data. The `status` and `content_type` methods will
return stored instance variables or set them depending on whether the parameter is specified. This is purely syntactic
sugar for the DSL.

{% codeblock lang:rb %}
class HttpResponse
  attr_reader :block

  def initialize(&block)
    @block = block
    @code = 200
    @type = 'text/html'
  end

  def status(code = nil)
    return @code if code.nil?

    @code = code.join
  end

  def content_type(type = nil)
    return @type if type.nil?

    @type = type.join
  end

  def response_headers
    { 'Content-Type' => @type }
  end
end
{% endcodeblock %}

Now let's define the `RackApp` parent class:

{% codeblock lang:rb %}
require 'rack'
require_relative 'http_response'

class RackApp
  def self.call(env)
    @response = @registry[env['REQUEST_PATH']]
    return not_found if @response.nil?

    result = @response.block.call
    [@response.status, @response.response_headers, [result]] unless @response.nil?
  end

  def self.method_missing(name, *args)
    @response.send(name, args)
  end

  def self.not_found
    ['404', {'Content-Type' => 'text/html'}, ['Resource not found']]
  end

  protected

  def self.get(route, &block)
    response = HttpResponse.new(&block)

    registry[route] = response
  end

  def self.registry
    @registry ||= {}
  end
end
{% endcodeblock %}

We return early with a `404` unless `@registry[env['REQUEST_PATH']]` was defined. Otherwise, we call the `block`
stored in our `HttpResponse` instance. Executing this block may result in `status` and `content_type` calls, but in the
context of `RackApp`. The `method_missing` method proxies the message to our response instance. The `name` is the
symbolized name of the method and the `args` are forwarded to this method.

For simplicity, this minimal example does not differentiate between HTTP verbs. We could easily extend the `@registry`
hash to do so by adding nesting for each verb:

{% codeblock lang:rb %}
registry[env['REQUEST_METHOD']][env['REQUEST_PATH']] = response
{% endcodeblock %}

We could add support for processing query string params via `Rack::Request` class. There are numerous possible
improvements for our DSL. However, the goal here was not to recreate a robust DSL like Sinatra, but to show how easy
it is to use Rack to get started along that path.
