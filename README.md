1. /location/:key
<hr>

<pre>
key definition:
STR: US WISC UWMAD MSHUM F001 2250x
LEN: 2    4         5             5            4       5

eg:

get all country information:
US{
Country:’United States’,
 States:[‘ALBM’:’Alabama’,’WISC’:’Wisconsin’,...]
}

get a state information:
USWISC{
	Country:’United States’,
State:’Wisconsin’,
 Institutions:[‘UWMAD’:‘University of Wisconsin, Madison’,’UWMIL’:’University of Wisconsin, Milwaukee’,...]
}

get UW-Madison building information
USWISCUWMAD{
Country:’United States’,
State:’Wisconsin’,
Institution:’University of Wisconsin, Madison’, 
Buildings:[‘MSHUM’:‘Moose Humanity’,’HElCW’:’Helen C White’,...]
}
</pre>
