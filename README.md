ExpressMailer
=====
<p>Simple mailer with reCaptcha validation using ExpressJS</p>

Server requirements
----
* NodeJs

Installation
----

#### Clone Github repository

```sh
git clone https://github.com/dim4k/ExpressMailer.git
```
#### Install the dependencies

At the root of your project, run :

```sh
npm install
```

#### Setup the server

Open conf.json-dist, change this configuration file according to your setup and rename it to conf.json

#### Run the server

At the root of your project, run :

```sh
node server.js
```
Call to the mailer
----
Here is a simple example of ajax call to the mailer

```sh
$('.submit-form').click(function(){
        var data = $('.form').serializeArray();
        data.push({'name':'website','value':'your.website'});

        $.ajax({
            data: data,
            type: "POST",
            url: "http://localhost:3000/sendMail",
            success: function(data){
                alert(data.responseDesc);
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(xhr);
            }
        });
});
```
Assuming the form got the following field :
* firstname
* lastname
* email
* message
