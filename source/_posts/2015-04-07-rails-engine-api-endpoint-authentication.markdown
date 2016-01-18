---
layout: post
title: "Rails Engine API Endpoint Authentication using Rack Middleware"
date: 2015-04-07 22:28:10 -0700
comments: true
categories: engine 
description: How to do authentication for a rails engine using rack middleware
keywords: rails engine rack middleware authentication ruby
---

At work, we recently discussed how best to authenticate an API endpoint that we needed from a rails engine. In the host
application, we require that clients use tokens for API authentication. In a parent class before filter, we call a
remote web service to validate these tokens. We all agreed that it was a bad idea to copy this code over from the host
into the engine.

There were a couple of reasons for this. Not only would the code be duplicated, but we felt like it would be a better
separation of concerns to keep authentication out of the engine. Another argument is that we would not want
to impose an authentication system from the gem on the host application. Ryan Bigg expands on this in a
[blog post](http://ryanbigg.com/2012/03/engines-and-authentication/) on Forem.

<!-- more -->

We investigated a handful of approaches. The simplest, least invasive approach seemed to be to use Rack middleware.
First, we register the middleware with an array of endpoints to validate:

{% codeblock lang:rb application.rb %}
config.middleware.use Middleware::TokenAuthorizer, ['api/accounts/']
{% endcodeblock %}

Then we define the middleware:

{% codeblock lang:rb token_authorizer.rb %}
module Middleware
  class TokenAuthorizer
    def initialize(app, validation_endpoints)
      @app = app
      @validation_endpoints = validation_endpoints
    end

    def call(env)
      return unauthorized if need_to_validate?(env['PATH_INFO']) && invalid_token?(env['HTTP_AUTHORIZATION'])

      @app.call(env)
    end

    private

    def need_to_validate?(request_path)
      @validation_endpoints.each do |validation_endpoint|
        return true if request_path.include?(validation_endpoint)
      end
      false
    end

    def invalid_token?(token)
      return true if token.nil?
      !WebServices::TokenAuth.new(token).is_valid_token?
    end

    def unauthorized
      [401, {}, ['Unauthorized']]
    end
  end
end
{% endcodeblock %}

In most cases, we will just end up executing calling the host application (via `@app.call(env)`). However if the
`PATH_INFO` matches an initialized endpoint and we pass in an invalid token, then we will return a `401` HTTP status
code.

There are a few drawbacks to this approach:

- We do not take into the HTTP verb into account and may match more endpoints than we intend (e.g. api/accounts/:account_identifier)
- The middleware runs for all requests, even ones where we have a separate authentication mechanism