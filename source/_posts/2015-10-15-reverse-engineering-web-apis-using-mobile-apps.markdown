---
layout: post
title: "Reverse Engineering Web APIs using Mobile Apps and a Packet Sniffer"
date: 2015-10-15 21:09:30 -0700
comments: true
categories: utilities learning web-api
description: How to reverse engineering a web API using a packet sniffer on an android phone 
keywords: tutorial android weather gem learning
---

Recently I have been having fun using a packet sniffer running on my Android phone to explore non-public APIs. I will
provide a small example using the overstock.com app to look into current Flash Deals. This technique can be used to
monitor a large variety of network traffic running on the phone. The app I used also decrypts SSL packets, which is
useful for viewing HTTPS traffic.

{% img /assets/2015-10-15-reverse-engineering-web-apis-using-mobile-apps/images/packet_capture_install.png 250 auto %}
{% img /assets/2015-10-15-reverse-engineering-web-apis-using-mobile-apps/images/app_screen.png 250 auto %}
{% img /assets/2015-10-15-reverse-engineering-web-apis-using-mobile-apps/images/trust_application.png 250 auto %}

First, I installed [Packet Capture](https://play.google.com/store/apps/details?id=app.greyshirts.sslcapture&hl=en) for
Android. The application requires permission to monitor network traffic when you press the `Play` button. Please do
so at your own risk. Also, this captures a large amount of data, so you might want to limit the length of time it is
running.

{% img /assets/2015-10-15-reverse-engineering-web-apis-using-mobile-apps/images/overstock_install.png 250 auto %}
{% img /assets/2015-10-15-reverse-engineering-web-apis-using-mobile-apps/images/overstock.png 250 auto %}
{% img /assets/2015-10-15-reverse-engineering-web-apis-using-mobile-apps/images/packet_capture.png 250 auto %}

I downloaded the [Overstock.com](https://play.google.com/store/apps/details?id=com.overstock&hl=en) Android application,
started it and then started the packet capture. I tapped `FLASH DEALS` and then stopped the packet capture. The last
image (above right) shows the HTTP request and response that corresponded to my interaction with the application. You may
have to look through a large number of packets to identify the one of interest.

While the response is gzipped, I'm more interested in the HTTP request. The first thing I tried was a simple curl
from the command line to reproduce the application:

    $ curl http://www.overstock.com/api2/flashdeals/current?offset=0&limit=12

In some cases, you may need to use the same HTTP request headers (use the `-H "<HEADER_KEY>: <HEADER_VALUE>"` command
line option) to convince the remote HTTP server that the request was made from their application. However, this was not
needed for the Overstock.com web API. Here is a snippet of the response:

```json
{
   "nextHref":"",
   "currentTime":"2015-10-14T23:37:29.399-06:00",
   "items":[
      {
         "id":30905,
         "offerType":"FIXED_PRICE",
         "startDateTime":"2015-10-14T10:00:00.000-06:00",
         "endDateTime":"2015-10-15T10:00:00.000-06:00",
         "storeId":43,
         "departmentId":454,
         "categoryId":4540,
         "subCategoryId":1399,
         "priority":1,
         "skus":[
            {
               "fixedPrice":124.99,
               "product":{
                  "productHref":{
                     "id":10181037,
                     "href":"http://www.overstock.com/api/product.json?prod_id=10181037"
                  },
                  "productName":"Jennifer Taylor Collection Red Moraccan Cotton 3-piece Duvet Cover Set",
                  "images":{
                     "thumbnail":"http://ak1.ostkcdn.com/images/products/10181037/T17307668.jpg",
                     "medium":"http://ak1.ostkcdn.com/images/products/10181037/P17307668.jpg",
                     "large":"http://ak1.ostkcdn.com/images/products/10181037/Moracan-Collection-3-piece-Cotton-Duvet-Cover-Set-fd47bab9-10f3-49e2-a431-5ae4cf999abf_1000.jpg"
                  },
                  "pricing":{
                     "compareType":"MSRP",
                     "sellingPrice":124.99,
                     "comparePrice":352.00,
                     "onSale":true,
                     "discount":227.01,
                     "savingsPercent":64,
                     "maxPrice":124.99,
                     "minPrice":124.99
                  },
                  "reviewInfo":{
                     "count":0
                  }
               }
            }
         ]
      },
      ...
```

There was a short description, pricing information, image links in three sizes hosted on the CDN and a secondary link:

    $ curl http://www.overstock.com/api/product.json?prod_id=10181037

Here is the full response:

```json
{
   "id":10181037,
   "name":"Jennifer Taylor Collection Red Moraccan Cotton 3-piece Duvet Cover Set",
   "meta":{
      "apiUrl":"http://www.overstock.com/api/product.json?prod_id=10181037",
      "htmlUrl":"http://www.overstock.com/Bedding-Bath/Jennifer-Taylor-Collection-Red-Moraccan-Cotton-3-piece-Duvet-Cover-Set/10181037/product.html",
      "imageBaseUrl":"http://ak1.ostkcdn.com/images/products/"
   },
   "sku":"17307668",
   "imageThumbnail":"10181037/T17307668.jpg",
   "imageLarge":"10181037/L17307668.jpg",
   "imageMedium1":"10181037/P17307668.jpg",
   "priceSet":[
      {
         "label":"MSRP:",
         "formattedPrice":"$352.00",
         "priceType":"COMPARISON_PRICE"
      },
      {
         "label":"",
         "formattedPrice":"$227.01(64%) off",
         "priceType":"DISCOUNTED_AMOUNT"
      },
      {
         "label":"Sale:",
         "formattedPrice":"$124.99",
         "priceType":"CURRENT_PRICE"
      }
   ],
   "messages":[
      {
         "message":"Earn $2.50 (2%) Rewards on this product FREE with Club O Silver",
         "messageType":"JOIN_CLUBO_SILVER"
      }
   ],
   "oViewerImages":[
      {
         "id":"fd47bab9-10f3-49e2-a431-5ae4cf999abf",
         "cdnPath":"10181037/Moracan-Collection-3-piece-Cotton-Duvet-Cover-Set-fd47bab9-10f3-49e2-a431-5ae4cf999abf.jpg",
         "originalWidth":1024,
         "originalHeight":1024,
         "imageSizes":[
            {
               "imagePath":"10181037/Moracan-Collection-3-piece-Cotton-Duvet-Cover-Set-fd47bab9-10f3-49e2-a431-5ae4cf999abf_320.jpg",
               "height":320,
               "width":320
            },
            {
               "imagePath":"10181037/Moracan-Collection-3-piece-Cotton-Duvet-Cover-Set-fd47bab9-10f3-49e2-a431-5ae4cf999abf_600.jpg",
               "height":600,
               "width":600
            },
            {
               "imagePath":"10181037/Moracan-Collection-3-piece-Cotton-Duvet-Cover-Set-fd47bab9-10f3-49e2-a431-5ae4cf999abf_1000.jpg",
               "height":1000,
               "width":1000
            }
         ]
      }
   ],
   "memberPrice":124.99,
   "compareAt":250.27,
   "categoryId":4540,
   "subCategoryId":1399,
   "altSubCategoryId":22240,
   "shortDescription":"This Moracan Collection duvet set is woven of 100 percent cotton for softness and comfort. Rich blues and oranges in a geometric pattern complete the look. ",
   "description":"This reversible duvet cover features a blue and orange geometric design on one side and a solid blue on the other. Crafted of quality cotton, this set is conveniently machine washable.<br><br><ul><li>Includes: 3-piece Set</li><li>Reversible Bedding</li><li>Material: Cotton</li><li>Pattern: Graphic</li><li>Color: Red, Orange, Blue</li><br><br><b>Queen-size dimensions:</b><li>Duvet: 93 inches x 96 inches</li><li>Standard sham: 20 inches x 27 inches</li></ul><br><i>The digital images we display have the most accurate color possible. However, due to differences in computer monitors, we cannot be responsible for variations in color between the actual product and your screen.</i><br>",
   "savingsPercentage":50,
   "basePrice":124.99,
   "hideMAPProductPrice":false,
   "mediaItem":false,
   "mediaReleaseDate":"",
   "clubODiscount":false,
   "nonClubODiscount":true,
   "preRelease":false,
   "priceLabel":"Sale",
   "online":true,
   "options":[
      {
         "optionId":15463578,
         "decription":"N/A",
         "qtyOnHand":31,
         "maxQuantityAllowed":20,
         "price":124.99,
         "comparePrice":352.00,
         "compareType":"MSRP",
         "hideMAPProductPrice":false,
         "savings":227.01,
         "savingPercentage":64,
         "onSale":true,
         "showAmazonPrice":false,
         "priceSet":[
            {
               "label":"MSRP:",
               "formattedPrice":"$352.00",
               "priceType":"COMPARISON_PRICE"
            },
            {
               "label":"",
               "formattedPrice":"$227.01(64%) off",
               "priceType":"DISCOUNTED_AMOUNT"
            },
            {
               "label":"Sale:",
               "formattedPrice":"$124.99",
               "priceType":"CURRENT_PRICE"
            }
         ]
      }
   ],
   "warranties":[

   ],
   "flashDeal":{
      "id":30905,
      "href":"http://www.overstock.com/api2/flashdeals/30905",
      "currentTime":"2015-10-14T23:43:20.413-06:00",
      "startDateTime":"2015-10-14T10:00:00.000-06:00",
      "endDateTime":"2015-10-15T10:00:00.000-06:00"
   },
   "shipDeliveryEstimates":{
      "optionId":15463578,
      "productType":"REGULAR"
   },
   "taxonomy":{
      "store":{
         "id":43,
         "name":"Bedding & Bath",
         "apiUrl":"http://www.overstock.com/api/search.json?taxonomy=sto43",
         "htmlUrl":"http://www.overstock.com/Bedding-Bath/43/store.html"
      },
      "department":{
         "id":454,
         "name":"Fashion Bedding",
         "apiUrl":"http://www.overstock.com/api/search.json?taxonomy=dep454",
         "htmlUrl":"http://www.overstock.com/Bedding-Bath/Fashion-Bedding/454/dept.html"
      },
      "category":{
         "id":4540,
         "name":"Duvet Covers",
         "apiUrl":"http://www.overstock.com/api/search.json?taxonomy=cat4540",
         "htmlUrl":"http://www.overstock.com/Bedding-Bath/Duvet-Covers/4540/cat.html"
      },
      "subCategory":{
         "id":1399,
         "name":"Duvet Covers",
         "apiUrl":"http://www.overstock.com/api/search.json?taxonomy=sto1399",
         "htmlUrl":"http://www.overstock.com/Bedding-Bath/Duvet-Covers/4540/cat.html"
      }
   },
   "originalOptionCount":1
}
```