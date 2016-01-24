---
layout: post
title: "Workflow: Ruby on Windows with Vagrant"
date: 2016-01-24 10:00:58 -0800
comments: true
categories: learning vagrant workflow
description: Learn to develop Ruby where the target platform operating system differs from the host
keywords: vagrant ruby workflow windows osx virtualbox development platform
---

I wanted to share a workflow that I use to do Ruby development on Windows using Vagrant. I should mention that I always 
prefer to do Ruby development on a Mac or running Linux, but this workflow might work well for someone doing both .NET
and Ruby development. 

This general approach should work in most cases where the development environment does not match the 
deployment platform. As a first step, I suggest trying out the [Ruby Installer](http://rubyinstaller.org/) for Windows. 
I've found that this works for small projects, but have trouble with larger projects especially with a large number of 
gem dependencies. 

The workflow involves using your native environment to launch a virtual machine that more closely matches the one use to 
deploy your code in production. You get the benefits of the windowing system tools (Sublime Text, RubyMine, Notepad++, etc) 
with the benefits of running specs and code in an environment closer to production.

<!-- more -->

** Dependencies **

To get started, we are going to need to install a few tools:

- [VirtualBox](https://www.virtualbox.org/wiki/Downloads)
- [Vagrant](https://www.vagrantup.com/downloads.html)
- [Git](https://git-scm.com/downloads)

I like using Git bash shell, however this is optional. I love that it is bundled with a SSH client because I find it
easier to use than Putty.

We are going to create a folder for our `Vagrantfile` and workspace. The `Vagrantfile` is a description of your virtual 
machine. We are going to create an Ubuntu VM, but you can choose an environment that is appropriate for you. Check out 
the [public catalog of boxes](https://atlas.hashicorp.com/boxes/search) for a list.

** Getting Started **
 
After everything is installed, let's open up a Git bash shell:

{% codeblock lang:bash %}
mkdir ruby-image
cd ruby-image
mkdir workspace
{% endcodeblock %}

We need to create a `Vagrantfile` in the `ruby-image` directory. You can create a stock one using `vagrant init .` or
just create a new file with the following contents:

{% codeblock lang:rb Vagrantfile %}
# -*- mode: ruby -*-
# vi: set ft=ruby :

# Basic Ruby box configured with RVM
Vagrant.configure(2) do |config|
  # Ubuntu 12.04
  config.vm.box = "hashicorp/precise64" 

  # Create a forwarded port mapping which allows access to a specific port
  # within the machine from a port on the host machine. In the example below,
  # accessing "localhost:8080" will access port 80 on the guest machine.
  # config.vm.network "forwarded_port", guest: 80, host: 8080

  # Create a private network, which allows host-only access to the machine
  # using a specific IP.
  config.vm.network "private_network", ip: "192.168.33.10"

  # Use insecure key
  config.ssh.insert_key = false
  
  # Proxy configuration
  #if Vagrant.has_plugin?("vagrant-proxyconf")
  #  config.proxy.http     = "http://your-company-proxy.com:8080"
  #  config.proxy.https    = "http://your-company-proxy.com:8080"
  #  config.proxy.no_proxy = "localhost,127.0.0.1"
  #end

  # Provision a few tools
  config.vm.provision "shell", inline: <<-SHELL
    sudo apt-get update
    sudo apt-get install -y git build-essential vim curl nodejs libxml2-dev redis-server
    # user commands
    sudo -H -u vagrant bash -c 'gpg --keyserver hkp://keys.gnupg.net --recv-keys 409B6B1796C275462A1703113804BB82D39DC0E3'
    # Proxy version
    #sudo -H -u vagrant bash -c 'gpg --keyserver hkp://keys.gnupg.net --keyserver-options http-proxy="http://web-proxy.vcd.hp.com:8080" --recv-keys 409B6B1796C275462A1703113804BB82D39DC0E3'
    sudo -H -u vagrant bash -c 'curl -sSL https://get.rvm.io | bash -s stable'
    sudo -H -u vagrant bash -c 'source /home/vagrant/.rvm/scripts/rvm && rvm install ruby-2.2.0'
    sudo -H -u vagrant bash -c 'ln -s /vagrant/workspace /home/vagrant/workspace'
  SHELL
end
{% endcodeblock %}

** Proxy Configuration **

You may notice that I commented out a number of lines related to proxy configuration. If you are behind a web proxy at
work, then you may find the Vagrant [proxyconf plugin](http://tmatilai.github.io/vagrant-proxyconf/) useful. To install 
it from the command line:

{% codeblock lang:bash %}
vagrant plugin install vagrant-proxyconf
{% endcodeblock %}

Then you can change the proxy configuration to match your network setup. You need to comment in lines 22-26 and 35.
You should comment out line 33. Proxies can be frustrating and this may take a little tinkering. One of the beautiful
things about Vagrant is that you can create and destroy reusable development environments really easily. 

** Start the VM **

Let's fire up our VM:

{% codeblock lang:bash %}
vagrant up
{% endcodeblock %}

The first time you run this command, it will take several minutes to download the box image. On subsequent runs, it 
should take much less time. The provisioning takes a few minutes for me, but your milage may vary. 

You may notice that I added [RVM](https://rvm.io/) during provisioning to help manage our ruby version and gemsets. Feel 
free to use [rbenv](https://github.com/rbenv/rbenv) or other tools as you see fit. I also installed ruby version
2.2.0, but feel free to modify this.
 
Now, your virtual machine should be up and running. If it is not, then read through the error messages and address the
issues. Let's SSH into the box:
 
{% codeblock lang:bash %}
vagrant ssh
{% endcodeblock %}

You should see the typical bash prompt. You may need to source the `rvm` file and install a particular Ruby version:

{% codeblock lang:bash %}
source ~/.rvm/scripts/rvm
{% endcodeblock %}

** Databases **

I intentionally left out a database from the `Vagrantfile`. Choose whatever database technology works for you (or none
at all).

To install a MySQL database:  

{% codeblock lang:bash %}
sudo apt-get install mysql-server mysql-client libmysqlclient-dev
{% endcodeblock %}

To install a PostgreSQL:

{% codeblock lang:bash %}
sudo apt-get install postgresql postgresql-contrib libpq-dev
{% endcodeblock %}

You may need additional dependencies. Typically you will see failures when running bundle install.

** Create a Rails App **

Make sure you are logged into the VM. Let's create a new empty rails app:

{% codeblock lang:bash %}
cd ~/workspace
rvm gemset create hello_world
rvm 2.2.0@hello_world
gem install rails
rails new hello_world
{% endcodeblock %}

Creating the gemset should result in output like the following:

```
ruby-2.2.0 - #gemset created /home/vagrant/.rvm/gems/ruby-2.2.0@hello_world
ruby-2.2.0 - #generating hello_world wrappers..........
```

The `rvm 2.2.0@hello_world` tells rvm to use Ruby version 2.2.0 with our newly created gemset `hello_world`.

Bundle install might take a while depending on your machine and network connection. At this stage, it is not uncommon
to still be missing dependencies. Usually a quick google search can resolve these. 

The gem documentation also takes a while to install. You can prevent this by creating a file in your home directory 
called `.gemrc` with the following contents:

{% codeblock ~/.gemrc %}
gem: --no-document
{% endcodeblock %}

Let's fire up the Rails server:

{% codeblock lang:bash %}
cd hello_world
rails s -b 192.168.33.10
{% endcodeblock %}

We are telling rails server to bind to the IP we specified in the `Vagrantfile`. This is so that we can connect to
the server from the Windows host.

From here it is easy to connect to the shared workspace folder in Windows and use git bash to run commands from the
command line and use a browser to connect to your application: 

{% img /assets/2016-01-24-running-ruby-on-windows-with-vagrant/images/windows_dev_rails.jpg auto auto %}

You might consider adding some memory available to the VM. You can do this by shutting down the VM via `vagrant halt`
and then opening up the VirtualBox program. I usually give the VM about 50% of the host machine's RAM.

That's it for this week. Happy hacking!