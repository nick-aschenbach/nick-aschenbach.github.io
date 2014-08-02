---
layout: post
title: "Popularity Trends in Programming Languages"
date: 2014-08-02 11:18:06 -0700
comments: true
categories: languages
---
Full disclosure: I am a Ruby and Java developer. 

Everyone has their favorite pet languages (myself included) and I realize that this is a topic that evokes some feelings among my peers. In recent years, I strove to be more agnostic about tools and languages. While I try to be careful about making predictions, the languages and tools that are relevant now may fall out of favor in the industry in a few years. I'll try stick to what I discovered, but I realize that my perception is colored by my experience.

I reviewed several indexes and articles including [TIOBE](http://www.tiobe.com/index.php/content/paperinfo/tpci/index.html), [Transparent Language Popularity Index](http://lang-index.sourceforge.net/), [IEEE Spectrum: Top Programming Languages](http://spectrum.ieee.org/static/interactive-the-top-programming-languages), [PopularitY of Programming Language Index](https://sites.google.com/site/pydatalog/pypl/PyPL-PopularitY-of-Programming-Language), [RedMonk Programming Language Rankings](http://redmonk.com/sogrady/2014/01/22/language-rankings-1-14/), [Programming Language Popularity Chart](http://langpop.corger.nl/) and [GitHub Language Trends and Fragmenting Landscape](http://redmonk.com/dberkholz/2014/05/02/github-language-trends-and-the-fragmenting-landscape/)

While there was correlation between highly ranked languages between the indexes, none of them were the same. Several metrics were used including number of open source projects, number of lines of code, number of tracked bugs / issues, number of tutorials and numbers of search engine searches. The list goes on and on. How these metrics were weighted had a big impact on the overall ranking results. 

{% img left http://dberkholz-media.redmonk.com/dberkholz/files/2014/05/github_new_users_repos_issues_multiplot_composite_simple.png 450 auto New GitHub Repos %}

In alphabetical order some of the most highly ranked languages are C, C#, C++, Java, JavaScript, Objective-C, PHP, Perl, Python, Ruby and Visual Basic. About half the indexes I reviewed had C and Java in the top two spots. 

<!-- more -->

Because there is no objective measurement of programming language popularity, the exact rank seemed less important to me than how things [change over time](http://redmonk.com/dberkholz/2014/05/02/github-language-trends-and-the-fragmenting-landscape/) (see graph). Another approach that I liked was the use of [scatter plots](http://sogrady-media.redmonk.com/sogrady/files/2014/01/lang-rank-114-wm.png).

I found Donnie Berkholz's analysis of programming language use on GitHub particularly insightful. He looks at new GitHub repos, new issues and new users as a function of time. Before we go deeper into the numbers, it is important to mention that GitHub was embraced by the Ruby community early on and the apparent drop in Ruby projects actually indicates that GitHub was adopted by the developer community at large over the past five years. 

Overall language trends (looking at GitHub issues):

- While JavaScript issues are increasing, the trend is decelerating. It may stabilize at around 25% of total issues on GitHub
- Ruby has seen a big decline and appears to be reaching 10% of issues
- Java and PHP have stabilized at 10% of issues
- Python has dropped from 15% to about 10% of issues since 2008/2009. It's unclear if this number has stabilized.

He also points out that C# and Objective-C are widely used, but do not show up in his data because developers from those communities have not embraced GitHub to the same degree as some others. This is corroborated by [data](http://langpop.corger.nl/) that indicates while C# is discussed widely on Stack Overflow, it is not correlated as strongly with lines of code on GitHub as are other languages like Java and JavaScript:

Language    | Stack Overflow | GitHub          | Ratio
----------- | -------------- | ----------------|-------
C#          | 679,776        | 2,469,334,797   | 3,632
Java        | 687,426        | 7,090,897,887   | 10,315
JavaScript  | 676,383        | 15,664,918,541  | 23,160
<br/>

The ratio is the number of lines of code on GitHub relative to the number of Stack Overflow comments. All three languages have a similar number of comments on Stack, but have very different ratios. 

The article closes by suggesting that we have moved towards an increasingly fragmented programming language landscape. With the rise of domain specific languages and the increasing reliance on web technologies, it will be fascinating to see what programming languages will dominate in the future.
