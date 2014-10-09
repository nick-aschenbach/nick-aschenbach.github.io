---
layout: post
title: "Time Lapse at 8,600 feet"
date: 2014-10-09 08:47:58 -0600
comments: true
categories: terrain
---

While on vacation near [Devil's Thumb Ranch](https://www.google.com/maps/place/Devils+Thumb+Ranch+Resort+%26+Spa/@39.9662913,-105.7840392,17z/data=!3m1!4b1!4m2!3m1!1s0x876a334c90923d2f:0xa2ca7e1ac5aa7ad9) I decided to try some time lapse photography. I wrote a bash script that took pictures on a laptop a few years ago. I ran this script using cron, but was looking for something with finer grained control. I found a [Tenderlovemaking post](http://tenderlovemaking.com/2014/03/26/webcam-photos-with-ruby.html) that shows how to take web cam photos using Ruby with the AVCapture framework. Note that this appears to only work on OSX. 

I modified the script from Tenderlove's `av_capture` gem's [github page](https://github.com/tenderlove/av_capture):

{% codeblock lang:rb %}
require 'av_capture'

session = AVCapture::Session.new
dev     = AVCapture.devices.find(&:video?)

session.run_with(dev) do |connection|
  10000.times do |i|
    counter = i.to_s.rjust(4, "0")
    File.open("img_#{counter}.jpg", 'wb') do |f|
      f.write connection.capture
    end
    sleep 5
  end
end
{% endcodeblock %}

I left fill with zeros so that the files will be `img_0000.jpg`, `img_0001.jpg` ... If you want to increase the number of times we take photos (let's call it N) then change the `4` on line 8 to be `log_10(N).ceil`. So if we want to take 15,000 photos:

{% codeblock lang:rb %}
    counter = i.to_s.rjust(5, "0")
{% endcodeblock %}

Now that we ran the script and generated a ton of sequentially numbered photos, how do we turn them into a movie? I used FFMPEG on a few projects in graduate school a few years ago and figured that it would be the right tool for the job.

To install it on OSX (requires brew):

```
brew install ffmpeg
```

Now to turn the photos into a movie:

```
ffmpeg -r 60 -i img_%04d.jpg output.mp4
```

The `-r 60` flag sets the video frame rate to 60 frames per second.

I ran this script for about 3.5 hours starting in the early afternoon on October 6th facing towards Devil's Thumb, a local geological feature. Here is the result:

{% youtube k9uW1tmKZTo %}

I started with 30 second intervals, but found that there was too much movement between frames. I changed the script to use a 5 second delay, which seemed to result in smoother transitions. Also I used YouTube's image stabilization post-processing feature. This is why the video appears to pan around a little. Occasionally the web cam took pictures that appeared to be too light. These appear as a white flash in the video. I identified these and copied the next image in the sequence over the white image.