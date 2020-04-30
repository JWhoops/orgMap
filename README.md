URL:http://172.220.7.76:8888/

endpoints:

<h4>1. /location/:key</h4>
<pre>
Key definition:
STR: US WISC UWMAD MSHUM F001 2250x
LEN: 2    4    5     5    4     5

eg:

Get all country information:
US{
Country:’United States’,
 States:[‘ALBM’:’Alabama’,’WISC’:’Wisconsin’,...]
}

Get a state information:
USWISC{
	Country:’United States’,
State:’Wisconsin’,
 Institutions:[‘UWMAD’:‘University of Wisconsin, Madison’,’UWMIL’:’University of Wisconsin, Milwaukee’,...]
}

Get UW-Madison building information
USWISCUWMAD{
Country:’United States’,
State:’Wisconsin’,
Institution:’University of Wisconsin, Madison’, 
Buildings:[‘MSHUM’:‘Moose Humanity’,’HElCW’:’Helen C White’,...]
}
</pre>

<h4>2. /utility:</h4>
<pre>
How to insert an utility to building:
1. Get building keys first.
2. POST to /utility with body format like:
<code>
{
    "type": "Printer",
    "description": "This is a test Printer",
    "key": "USWISCUWMADMSHMB" // building key
}
</code>
Utility will be in database, by it will need to be verified.
</pre>

<h4>3. /verification:</h4>
<pre>
How to verify an utility:
1. Get building keys first.
2. POST to /verification with body format like:
<code>
{
    "utility": {
        "type": "printer",
        "description": "this is a test printer"
    },
    "key": "USWISCUWMADMSHMB"
}
</code>
Utility in database will be verified if return success
</pre>

<h4>4. /get_code:</h4>
<pre>
How to get email verification code:
POST to /get_code with body format like:
<code>
{
    "email": "q835771840@gmail.com"
}
</code>
code will be sent to the email, and the response will be:
<code>
{
    "email":"q835771840@gmail.com",
    "message":"code has sent"
}
</code>
</pre>

<h4>5. /verify_code:</h4>
<pre>
How to get email verification code:
POST to /verify_code with body format like:
<code>
{
    "email":"q835771840@gmail.com",
    "code": "366493"
}
</code>
if the code is match, return will be 
<code>
{
    "success":true,
    "verified":true
}
</code>
</pre>
