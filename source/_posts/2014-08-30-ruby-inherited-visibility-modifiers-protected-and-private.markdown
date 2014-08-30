---
layout: post
title: "Protected and private visibility modifiers and inheritance in Ruby"
date: 2014-08-30 09:01:20 -0700
comments: true
categories: inheritance
---

During a recent code review at work, I was surprised by how Ruby handles `private` and `protected` method visibility modifiers in derived classes. The behavior is distinct from visibility modifiers in other languages like Java. Specifically, you can call a private parent class method as is demonstrated by the following code:

{% codeblock lang:rb %}
class A
  private

  def foo
    puts "foobar"
  end
end

class B < A
  def bar
    foo
  end
end
{% endcodeblock %}

I did some experimentation in the irb console. As expected, one may not call the `private` method foo on an instance of A:

{% codeblock lang:rb %}
> A.new.foo
NoMethodError: private method `foo' called for #<A:0x00000102a0b498>
  from (irb):7
  from /Users/sela/.rvm/rubies/ruby-2.1.1/bin/irb:11:in `<main>'
{% endcodeblock %}

What surprised me is that in the child class `B` that we can call `foo` on the parent class. Again, back to irb:

{% codeblock lang:rb %}
> B.new.bar
foobar
 => nil 
{% endcodeblock %}

<!-- more -->

Class B is calling a private method on class A, which seems to break with my expectations about encapsulation.

Time for some digging. I read through a couple of articles and found a draft of the Ruby language specification. Section 13.3.5 discusses method visibility. While not an official spec, here is what it says about private methods:

{% blockquote IPA Ruby Standardization WG Draft, Programming Languages - Ruby %}
A private method cannot be invoked with an explicit receiver, i.e., a private method cannot be invoked if a primary-expression or a chained-method-invocation occurs at the position which corresponds to the method receiver in the method invocation, except for a method invocation of any of the following forms where the primary-expression is a self-expression.

- single-method-assignment
- abbreviated-method-assignment
- single-indexing-assignment
- abbreviated-indexing-assignment
{% endblockquote %}

The way I interpret the spec is that a private method can be called with an implicit receiver (read object). This is why calling `foo` from method `bar` above is allowable. Invoking a method with an explicit receiver is not allowed. This is why `A.new.foo` results in a `NoMethodError`.

The following code may clarify the difference between calling a method with an implicit vs. explicit receiver:

{% codeblock lang:rb %}
class A
  protected

  def baz
    puts "foobaz"
  end

  private

  def foo
    puts "foobar"
  end
end

class B < A
  def bar
    # Implicit
    baz
    foo

    # Explicit
    self.baz
    self.foo    # Results in NoMethodError
  end
end
{% endcodeblock %}

Note that now we see that the `protected` method can be called explicitly, while the `private` method cannot. Let's exercise the above code in irb:

{% codeblock lang:rb %}
> B.new.bar
foobaz
foobar
foobaz
NoMethodError: private method `foo' called for #<B:0x000001019b3460>
  from (irb):23:in `bar'
  from (irb):26
  from /Users/sela/.rvm/rubies/ruby-2.1.1/bin/irb:11:in `<main>'
{% endcodeblock %}

References:

- [Ruby Draft Specification](https://www.ipa.go.jp/osc/english/ruby/)
- [Tenderlovemaking blog](http://tenderlovemaking.com/2012/09/07/protected-methods-and-ruby-2-0.html)