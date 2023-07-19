# Unique Colors

<br />

- Unique colors are pulled from [here](http://mkweb.bcgsc.ca/colorblind/distinct.colors.mhtml#projecthome).
- To utilize them, we run this regex find/replace to convert to a csv of RGB color codes.
- find: i +\d+ +(\d+) +(\d+) +(\d+).\*
- replace: rgb($1, $2, $3),
