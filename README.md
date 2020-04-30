1. /location/:key
<pre>
Key definition:
STR: US WISC UWMAD MSHUM F001 2250x
LEN: 2    4         5             5            4       5

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

2. /utility:
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

3. /verification:
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
