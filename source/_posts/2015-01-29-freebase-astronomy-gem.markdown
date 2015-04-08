---
layout: post
title: "Freebase Astronomy Gems"
date: 2015-01-29 20:34:04 -0800
comments: true
categories: gems astronomy learning engine
---

With 47 million topics and 2.7 billion facts, Freebase has an imposing amount of community curated data.
Unfortunately, they are [closing up shop](https://plus.google.com/109936836907132434202/posts/bu3z2wVqcQc) by mid 2015.
Their plan is to help support the up and coming Wikimedia Foundation's project [Wikidata](http://www.wikidata.org/) by
assisting in transferring their data to this project. Given the short amount of time they are online, I wanted
to do a small project using their data sets.

I am interested in astronomy, but found the Freebase JSON data a little unwieldy. I decided to write a pair gems:

- The `astronomy` gem facilitates browsing and search of astronomical phenomena. Each topic includes a name,
description, an array of image URLs and a link to the original detailed Freebase data via Google APIs.
- The `astronomy_engine` wraps the `astronomy` gem and has a web interface and can easily be included
in a Rails project:

[{% img /assets/2015-01-29-freebase-astronomy-gem/images/astronomy_engine.jpg auto auto %}](/assets/2015-01-29-freebase-astronomy-gem/images/astronomy_engine.jpg)

<!-- more -->

Add the following to your `config/routes.rb` in your rails app:

```ruby
Rails.application.routes.draw do
  mount AstronomyEngine::App => '/astronomy'
```

This adds the web page at the root and adds a few additional routes.

Request the list of categories:

```bash
curl {APPLICATION_ROOT}/astronomy/categories
```

Request all topics for a given category:

```bash
curl {APPLICATION_ROOT}/astronomy/categories/Star/topics
```

Search all topic names and descriptions:

```bash
curl {APPLICATION_ROOT}/astronomy/topics?q=cluster
```

I have a [sample web app](http://astronomy-engine.herokuapp.com/) on Heroku available if you want to take a look.
Here are the Github pages for the [astronomy](https://github.com/nick-aschenbach/astronomy) gem and
[astronomy_engine](https://github.com/nick-aschenbach/astronomy-engine) gem.

Resources:

- Amazon makes a handful of [Freebase Data Dumps](https://aws.amazon.com/search?searchQuery=freebase) freely available.
Also they several other [public data sets](https://aws.amazon.com/datasets/).
- Wikidata [data dumps](http://dumps.wikimedia.org/) are also available.