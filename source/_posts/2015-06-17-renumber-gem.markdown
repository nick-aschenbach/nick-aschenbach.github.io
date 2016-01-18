---
layout: post
title: "Renumber Filenames Sequentially"
date: 2015-06-17 20:07:04 -0700
comments: true
categories: gems utilities
description: A little open source utility that renames files in a directory so that they sequentially ordered.
keywords: gem bash utilities renumber file open source ruby
---

`renumber` is a small command line utility that renames files in a single directory. Files are sorted in
lexicographic order and then renamed with sequential numbers. It is possible to specify a prefix and suffix - these are
optional parameters. There are a couple of examples of usage below.

The code is open source and available on [GitHub](https://github.com/nick-aschenbach/renumber).

**Command Line Usage**

    $ renumber <directory> <prefix> <suffix>

<!-- more -->

**Installation**

The tool requires that Ruby is installed. If so, install `renumber` with the following command:

    $ gem install renumber

**Use case**

I developed `renumber` so that I could renumber thousands images from a digital camera for use in a time lapse movie.
The tool I used to stitch these images together into a movie (called [ffmpeg](https://www.ffmpeg.org/)) died if the file
names had a gap (e.g. ..., IMG2047, IMG2049, IMG2050, ...).

The `renumber` tool solved this problem by renumbering the files to not have gaps.

**Simple Usage**

Let's take a directory with several non-sequential files:

```
drwxr-xr-x  15 troy  staff  510 Jun 17 20:12 .
drwx------+  7 troy  staff  238 Jun 17 20:06 ..
-rw-r--r--   1 troy  staff    3 Jun 17 20:12 03.txt
-rw-r--r--   1 troy  staff    3 Jun 17 20:12 04.txt
-rw-r--r--   1 troy  staff    3 Jun 17 20:12 07.txt
-rw-r--r--   1 troy  staff    3 Jun 17 20:12 09.txt
-rw-r--r--   1 troy  staff    3 Jun 17 20:12 10.txt
-rw-r--r--   1 troy  staff    3 Jun 17 20:12 11.txt
-rw-r--r--   1 troy  staff    3 Jun 17 20:12 13.txt
-rw-r--r--   1 troy  staff    3 Jun 17 20:12 15.txt
-rw-r--r--   1 troy  staff    3 Jun 17 20:12 17.txt
-rw-r--r--   1 troy  staff    3 Jun 17 20:12 19.txt
-rw-r--r--   1 troy  staff    3 Jun 17 20:12 20.txt
-rw-r--r--   1 troy  staff    3 Jun 17 20:12 22.txt
-rw-r--r--   1 troy  staff    3 Jun 17 20:12 99.txt
```

Let's change to that directory and run the following:

    $ renumber .

Here's the directory listing after running the command:

```
drwxr-xr-x  15 troy  staff  510 Jun 17 20:14 .
drwx------+  7 troy  staff  238 Jun 17 20:06 ..
-rw-r--r--   1 troy  staff    3 Jun 17 20:12 00
-rw-r--r--   1 troy  staff    3 Jun 17 20:12 01
-rw-r--r--   1 troy  staff    3 Jun 17 20:12 02
-rw-r--r--   1 troy  staff    3 Jun 17 20:12 03
-rw-r--r--   1 troy  staff    3 Jun 17 20:12 04
-rw-r--r--   1 troy  staff    3 Jun 17 20:12 05
-rw-r--r--   1 troy  staff    3 Jun 17 20:12 06
-rw-r--r--   1 troy  staff    3 Jun 17 20:12 07
-rw-r--r--   1 troy  staff    3 Jun 17 20:12 08
-rw-r--r--   1 troy  staff    3 Jun 17 20:12 09
-rw-r--r--   1 troy  staff    3 Jun 17 20:12 10
-rw-r--r--   1 troy  staff    3 Jun 17 20:12 11
-rw-r--r--   1 troy  staff    3 Jun 17 20:12 12
```

**Prefix and Suffix**

Let's take the same initial file list as the above example. Let's add a prefix and suffix:

    $ renumber . foo .text

Here's the directory listing after running the command:

```
drwxr-xr-x  15 troy  staff  510 Jun 17 20:17 .
drwx------+  7 troy  staff  238 Jun 17 20:06 ..
-rw-r--r--   1 troy  staff    3 Jun 17 20:16 foo00.text
-rw-r--r--   1 troy  staff    3 Jun 17 20:16 foo01.text
-rw-r--r--   1 troy  staff    3 Jun 17 20:16 foo02.text
-rw-r--r--   1 troy  staff    3 Jun 17 20:16 foo03.text
-rw-r--r--   1 troy  staff    3 Jun 17 20:16 foo04.text
-rw-r--r--   1 troy  staff    3 Jun 17 20:16 foo05.text
-rw-r--r--   1 troy  staff    3 Jun 17 20:16 foo06.text
-rw-r--r--   1 troy  staff    3 Jun 17 20:16 foo07.text
-rw-r--r--   1 troy  staff    3 Jun 17 20:16 foo08.text
-rw-r--r--   1 troy  staff    3 Jun 17 20:16 foo09.text
-rw-r--r--   1 troy  staff    3 Jun 17 20:16 foo10.text
-rw-r--r--   1 troy  staff    3 Jun 17 20:16 foo11.text
-rw-r--r--   1 troy  staff    3 Jun 17 20:16 foo12.text
```