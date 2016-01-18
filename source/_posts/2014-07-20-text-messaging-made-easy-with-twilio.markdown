---
layout: post
title: "Text Messaging Made Easy with Twilio"
date: 2014-07-20 21:01:23 -0700
comments: true
categories: communication
description: A quick integration with Twilio using Sinatra
keywords: sms text messaging twilio sinatra
---
A few months ago I was determined to find out how to send and receive SMS text messages programmatically. After some research, I found that [Twilio](https://www.twilio.com) has a range of communication tools for developers for SMS / MMS, voice, mobile and web. They take care of low level details which facilitates the process of focusing on the core app. Their [documentation](https://www.twilio.com/docs) is excellent and you can experiment with their tools for free. 

When using a trial account, you can set up a phone number for free in just a few minutes. To get a number, click on the 'NUMBERS' tab and then click the link 'Get it now', which should show a page like the following:

{% img left /assets/2014-07-20-text-messaging-made-easy-with-twilio/images/get-number.png Get a Twilio number %}

Click the 'Get started' button. Note that you will have to enter in a number (e.g. your cell phone number) that you want to communicate with for the trial account to work. A short verification process is required. However, this limitation is removed if you upgrade to a paid account. Try out the test drive page that allows you to send a SMS message to yourself to ensure it is working.

<!-- more -->

Now if you click on the 'NUMBERS' tab, you should see the number that was set up in the previous step. Note the 'Request URLs' associated with this phone number. We are going to modify the 'Messaging' link in a few minutes. This requires that we set up a publically available server on the internet.

I used [Heroku](https://www.heroku.com/) as a hosting service for this project at no cost. There are several alternatives. I have some experience using [Rackspace](http://www.rackspace.com/), [Microsoft Azure](http://azure.microsoft.com/) and [Amazon Web Services](https://aws.amazon.com/). If you use Heroku, please make sure to install the Heroku Toolbelt command line tools. For the rest of this post, I will assume that you are using Heroku.

Let's start with an application that echos back what is sent in the body of a text message. We are going to write a simple little [Sinatra](http://www.sinatrarb.com/) app for this purpose. There are instructions for how to deploy Sinatra apps to Heroku [here](https://devcenter.heroku.com/articles/rack). Note the URL for the app when running `heroku create`. We'll need to configure Twilio to use this URL in a minute.

Here is a simple echo SMS server:

{% codeblock lang:rb %}
require 'sinatra'

get '/' do
  body = params[:Body]
  content_type 'text/xml'
  xml(body)
end

def xml(message)
  <<-XML
<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Message>#{message}</Message>
</Response>
  XML
end
{% endcodeblock %}

Note that the app takes a query string parameter 'Body' that comes from Twilio. There are several other query string parameters that are sent by Twilio. These can be viewed via the `heroku logs` command after a request is made (including 'From' (number), 'FromZip', 'FromState', 'FromCountry' and 'SmsStatus'). Now we need to set up Twilio to use our server. 

The SMS message triggers Twilio to issue a HTTP request to our server. The response from our Sinatra app is then parsed by Twilio and then sent back to the number that initially sent the text message. 

Let's configure Twilio by clicking the 'NUMBERS' tab and then clicking on our phone number. Change the request type from a POST to a GET and then enter in the URL displayed when running `heroku create`. If you did not write it down, you can always open the app via the `heroku open` command. Note that the Gemfile and config.ru files <strong>must</strong> be present when deploying to heroku.

Assuming that the app is deployed and Twilio is configured correctly, try to send a message from your phone to the number created in Twilio. Here is a screen shot from my phone showing the results:

{% img left /assets/2014-07-20-text-messaging-made-easy-with-twilio/images/hello-world.png Echo message %}

This application is trivial, so let's work on something a little more useful and fun. Word games like Scrabble&reg; or Words with Friends&reg; can be a lot of fun, but some people need a little help finding what words can be created with their letters. 

Let's write a little application that generates all letter permutations and compares these against a dictionary. We will extend the Sinatra app we wrote earlier and add a little helper Permutator class:

{% codeblock lang:rb %}
require 'set'
require 'sinatra'

class Permutator
  def self.init
    @@words = Set.new
    File.open('dictionary.txt', 'r') do |f|
      f.each_line { |word| @@words.add(word.chomp) }
    end
  end

  def self.find_words(letters)
    letter_array = []
    letters.each_char { |letter| letter_array << letter }
    words_found = Set.new

    (1..letter_array.size).each do |length|
      letter_array.permutation(length).each do |perm|
        candidate = perm.join
        words_found.add(candidate) if @@words.include?(candidate)
      end
    end
    words_found.to_a.join("\n")
  end
end

configure do
  Permutator::init
end

get '/' do
  begin
    content_type 'text/xml'
    letters = params[:Body][0..7].downcase
    results = Permutator::find_words(letters)
    xml("Permutations for #{letters}:\n#{results}")
  rescue Exception => e
    xml('Could not process input')
  end
end

def xml(message)
  <<-XML
<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Message>#{message}</Message>
</Response>
  XML
end
{% endcodeblock %}

This helper will generate all permutations using from one to the number of letters passed into the 'find_words' method. The class method 'init' is just called once when the application fires up. To see the results check the image at the bottom of the post.

I ran into a couple of issues using Twilio. The response message length needs to be kept less than 1600 characters. This limit can be exceeded with the permutator app we wrote. Also Twilio limits sending SMS to one message per second. 

I found the [App monitor](https://www.twilio.com/user/account/developer-tools/app-monitor) to be very useful when diagnosing what went wrong with my application. The 'Request Inspector' keeps track of HTTP request and response details that is helpful for debugging.

Twilio also supports sending SMS and MMS messages. Twilio supports a 'twilio-ruby' gem that can also be used for messaging. This gem can be used to send the same message to a number of recipients, for example. [Here](https://www.twilio.com/docs/quickstart/ruby/sms/sending-via-rest) is a Ruby code example using that gem.

Here are the results when I sent a text message with a body of 'pots' given our little word scramble app:

{% img /assets/2014-07-20-text-messaging-made-easy-with-twilio/images/permutations.png Permutations %}