---
layout: post
title: "Building a Gem for RubyGems.org"
date: 2014-09-29 18:49:06 -0700
comments: true
categories: gems data-structures
description: A short tutorial to create a gem and publish it to rubygems.org
keywords: gem learning tutorial
---

We are going through some large code refactors at work and are building [rails engines](http://guides.rubyonrails.org/engines.html). This requires creating apps within our main app. Each sub-app resides in its own gem and is typically mounted or consumed in some way by the host application. While I work on several gems for different projects at work, I had never developed one from scratch and submitted it to [RubyGems](http://rubygems.org/). I took some previous work on a [SMS Scrabble cheater app](/blog/2014/07/20/text-messaging-made-easy-with-twilio/) to help motivate the project. 

Developing the skeleton for a gem is extremely easy:

<!-- more -->

```
bundle gem foobar
```

Several files are created:

```
create  foobar/Rakefile
create  foobar/LICENSE.txt
create  foobar/README.md
create  foobar/.gitignore
create  foobar/foobar.gemspec
create  foobar/lib/foobar.rb
create  foobar/lib/foobar/version.rb
Initializing git repo in /Users/sela/workspace/foobar
```

Let's take a look at the gemspec file:

{% codeblock lang:rb %}
# coding: utf-8
lib = File.expand_path('../lib', __FILE__)
$LOAD_PATH.unshift(lib) unless $LOAD_PATH.include?(lib)
require 'foobar/version'

Gem::Specification.new do |spec|
  spec.name          = "foobar"
  spec.version       = Foobar::VERSION
  spec.authors       = ["Nick Aschenbach"]
  spec.email         = ["nick.aschenbach@gmail.com"]
  spec.summary       = %q{TODO: Write a short summary. Required.}
  spec.description   = %q{TODO: Write a longer description. Optional.}
  spec.homepage      = ""
  spec.license       = "MIT"

  spec.files         = `git ls-files -z`.split("\x0")
  spec.executables   = spec.files.grep(%r{^bin/}) { |f| File.basename(f) }
  spec.test_files    = spec.files.grep(%r{^(test|spec|features)/})
  spec.require_paths = ["lib"]

  spec.add_development_dependency "bundler", "~> 1.6"
  spec.add_development_dependency "rake"
end
{% endcodeblock %}

Also a handy `README.md` file is created that shows users how to install the gem using bundler. 

```
TODO: Write a gem description

## Installation

Add this line to your application's Gemfile:

    gem 'foobar'

And then execute:

    $ bundle

Or install it yourself as:

    $ gem install foobar

## Usage

TODO: Write usage instructions here

## Contributing

1. Fork it ( https://github.com/[my-github-username]/foobar/fork )
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create a new Pull Request
```

I used this template for my `scrabble_score` gem. The full source code is available on [Github](https://github.com/nick-aschenbach/scrabble-score). The project is extremely simple and has the following structure:

```
.
├── Gemfile
├── Gemfile.lock
├── LICENSE.txt
├── README.md
├── assets
│   └── dictionary.txt
├── lib
│   ├── scrabble_score
│   │   ├── dictionary.rb
│   │   ├── letters.rb
│   │   ├── version.rb
│   │   └── word_finder.rb
│   └── scrabble_score.rb
├── scrabble_score.gemspec
└── spec
    ├── assets
    │   └── dictionary.txt
    ├── lib
    │   └── scrabble_score
    │       ├── dictionary_spec.rb
    │       ├── letters_spec.rb
    │       └── word_finder_spec.rb
    └── spec_helper.rb

7 directories, 16 files
```

After getting my specs green and playing around with the code a bit, I went to generate the gem. First, let's upgrade to the latest RubyGems version:

```
gem update --system
```

Now, let's build the gem:

```
gem build scrabble_score.gemspec
```

The first time I ran this tool I received a handful of warnings:

```
WARNING:  no homepage specified
WARNING:  open-ended dependency on rspec (>= 0, development) is not recommended
  if rspec is semantically versioned, use:
    add_development_dependency 'rspec', '~> 0'
WARNING:  open-ended dependency on simplecov (>= 0, development) is not recommended
  if simplecov is semantically versioned, use:
    add_development_dependency 'simplecov', '~> 0'
WARNING:  See http://guides.rubygems.org/specification-reference/ for help
  Successfully built RubyGem
  Name: scrabble_score
  Version: 0.1.0
  File: scrabble_score-0.1.0.gem
```

For the homepage I used the project's Github repository. I also added versions to the development dependencies:

```
spec.add_development_dependency 'bundler', '~> 1.6'
spec.add_development_dependency 'rspec', '3.0.0'
spec.add_development_dependency 'simplecov', '0.9.1'
```

I deleted the `scrabble_score-0.1.0.gem` file and ran the `gem build` command again. Here is the output:

```
  Successfully built RubyGem
  Name: scrabble_score
  Version: 0.1.0
  File: scrabble_score-0.1.0.gem
```

Everything looks good, so I proceeded with the last step by running:

```
gem push scrabble_score-0.1.0.gem 
```

Which created the following output:

```
Enter your RubyGems.org credentials.
Don't have an account yet? Create one at https://rubygems.org/sign_up
   Email:   nick.aschenbach@gmail.com
Password:   

Signed in.
Pushing gem to https://rubygems.org...
Successfully registered gem: scrabble_score (0.1.0)
```

My experience creating a gem for RubyGems was a pleasant one. Please do a quick search to ensure that your gem name is unique before you get started. There are many guides out there for how to write gems. It is a good idea to take a look at one or two of these before getting started.

Happy gem cutting!
