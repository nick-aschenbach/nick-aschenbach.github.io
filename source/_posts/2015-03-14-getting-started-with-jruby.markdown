---
layout: post
title: "jRuby Test Drive"
date: 2015-03-14 09:09:13 -0700
comments: true
categories: jruby languages
description: Building a small application with a user interface using jRuby 
keywords: ruby jruby rvm java ui learning
---

After hearing about jRuby on several Ruby Rogues podcasts and reading posts about it online, I wanted to give it a shot.

Installation is super easy if you use [rvm](https://rvm.io/):

{% codeblock lang:js %}
rvm install jruby
{% endcodeblock %}

This will install several dependencies (like the patch, gawk, g++ and the JDK if you do not already have them
installed). The installation and setup took about seven minutes on a clean Ubuntu 12.04 Vagrant box I spun up for
testing purposes.

Let's say hello in irb:

{% codeblock lang:rb %}
> java.lang.System.out.println 'Hello World!'
Hello World!
{% endcodeblock %}

Specifying the package is a little cumbersome. Importing the `java.lang.System` makes things a little easier:

{% codeblock lang:rb %}
> import java.lang.System
> System.out.println 'Hello World!'
Hello World!
{% endcodeblock %}

<!-- more -->

jRuby provides access to Java's rich API and large number of open source packages. The runtime performance is
approximately the same, however the memory consumption appears to be higher for jRuby programs according to a
[2014 survey](http://benchmarksgame.alioth.debian.org/u64q/benchmark.php?test=all&lang=jruby&lang2=yarv&data=u64q).
It should be noted that the JVM startup time is excluded in these benchmarks so as not to bias the results. However,
it is not inconsequential. I understand that JVM start time for some test suites can take several seconds for larger
projects, which can be painful when running regression tests.

One of the main drawbacks to concurrent programming in MRI Ruby is that threads cannot run in parallel. These are
are useful when blocking on input and output, for example. However, gems that use native C code can provide
multi-threading facilities (e.g. by using POSIX threads). Another issue with MRI Ruby is that a number of data
structures are not thread safe (with the exception of the `Queue` class).

jRuby provides access to `java.lang.Thread` which enables running multiple threads of execution concurrently
on multiple cores. There appear to be some notable drawbacks in jRuby. Because the code runs on the JVM, we are
precluded from using gems with native code. These gems need to be swapped out with
[alternatives](https://github.com/jruby/jruby/wiki/C-Extension-Alternatives). Another issue is that jRuby is several
versions behind MRI Ruby. The latest jRuby release at the time this was written is `1.7.19`, which was to shore up
compatibility with MRI Ruby version `1.9.3`.

Threads are much cheaper to spin up than processes. Access to native threads in jRuby may help developers to scale
applications by better utilizing the hardware. Use of multiple threads of execution is a natural fit for web servers,
which need to handle multiple client connections concurrently.

**Test Drive**

Let's take jRuby out for a spin with a hello world example that utilizes `JFrame`:

{% codeblock lang:rb %}
import javax.swing.JButton
import javax.swing.JFrame

class HelloFrame < JFrame
  def initialize
    super('Hello')
    self.setup_interface
  end

  def setup_interface
    button = JButton.new("Hello")
    button.addActionListener do |e|
      puts 'Hello World'
    end

    self.add(button)

    self.setDefaultCloseOperation(JFrame::EXIT_ON_CLOSE)
    self.setSize(300, 200)
    self.setLocationRelativeTo(nil)
    self.setVisible(true)
  end
end

HelloFrame.new
{% endcodeblock %}

If you save this as a file called `hello.rb` then it can be run from the command line by:

{% codeblock lang:bash %}
ruby hello.rb
{% endcodeblock %}

Here is the app in action:

{% img /assets/2015-03-14-getting-started-with-jruby/images/hello.png 300 200 %}

The action listener `do ... end` Ruby syntax is quite a bit cleaner than the Java alternative using an anonymous inner
class:

{% codeblock lang:java %}
button.addActionListener(new ActionListener() {
  public void actionPerformed(ActionEvent e) {
    System.out.println("Hello World");
  }
});
{% endcodeblock %}

Taking what I learned and hungry for more, I decided to write a minimal web browser using jRuby. The interface is
comprised of a `JTextField` to input the URI and a `JEditorPane` to render the HTML. In addition, I use `BorderLayout`
as the layout manager for the `JFrame`:

{% codeblock lang:rb %}
import javax.swing.JScrollPane
import javax.swing.JTextField
import javax.swing.JEditorPane
import javax.swing.JFrame
import java.awt.BorderLayout

class Browser < JFrame
  def initialize
    super('jRuby Browser')
    self.initialize_interface
  end

  def initialize_interface
    response_body = JEditorPane.new('text/html', nil)

    uri_input = JTextField.new('http://')
    uri_input.add_action_listener do |e|
      response_body.setPage(e.getActionCommand)
    end

    self.setLayout(BorderLayout.new)
    self.add(uri_input, BorderLayout::NORTH)
    self.add(JScrollPane.new(response_body))

    self.setSize(800, 600)
    self.setLocationRelativeTo(nil)
    self.setDefaultCloseOperation(JFrame::EXIT_ON_CLOSE)
    self.setVisible(true)
  end
end

Browser.new
{% endcodeblock %}

While `JEditorPane` HTML support is very limited, we are able to display the webpage data for `example.com`. I resized
the window here to show the scrollbars:

{% img /assets/2015-03-14-getting-started-with-jruby/images/browser.png 800 300 %}