To use tools from the virtualenv, 
run $source env.sh.
This ports all python aliases to point to the appropriate execution files under .env/bin

Notes :

The current implementation relies on two classes.
The Renderer and RDDDB.

Renderer 
    - consists of basic functionality to render a scatter plot using bokeh.
      Bokeh is a python library for generating interactive visualizations. 
      The Bokeh site can be found here : http://bokeh.pydata.org/en/latest/
      
      The Renderer class consists of the renderer function which takes a range query
      and outputs a bokeh scatter plot. The scatter plot consists of circular elements.
      These elements need to be adjusted based on the number of elements on the scatterplot
      and the dimensions of the query. For example a query of (1,1,1,1) is a 1 by 1 box.
      However a plot with elements of size 1 take up the entire space.
      
      The Renderer runs the range queries on top of the RDDDB
      
RDDDB
    - consists of the spark RDD. 
       For this particular example the RDD consists of 10 million randomly
       generated pairs of numbers between 0 and 100.
       
       The RDDDB class also persists a local cache of point-pairs based on
       the largest query run to date. The problem however is that when running
       a large enough query the collect call on the RDD could extract
       all the datapoints. Instead what we need to do is take a certain number
       of elements from an RDD as memory permits.
       
       RDDDB has a function called crossfilter. The crossfilter function takes the 
       minimum and maximum values and first checks if the pointsCache has elements 
       matching the ranges. If the ranges are larger than what is currently stored 
       in the pointsCache an RDD action is launched to re-extract the necessary details.
       Otherwise the pointsCache is queries for faster results.
       
       Note that the current implementation supports faster results when going from
       a larger query range to a smaller query range. I will need to look into ways
       to either hash results of range queries or do a faster search. For larger
       local memory the search may be slower than in the RDD cache since the search
       is run in parallel.
       

IPython
    - Unfortunately the section of code in the IPython notebook will need to be run again
      with the call to render. While we still take advantage of the pre-loaded RDD and
      local pointcache - I am not able to find a way to do a callback to python code
      to re-populate the data results. Would appreciate help with regard to this.
      Otherwise we achieve filtering of large datasets by running a query on the RDD
      or the local cache and throwing the results into a d3 renderred scatter plot.
      Bokeh constructs this behind the scenes
      

TODO ::
    1. Better caching/query algorithm to support both zoom in's and zoom out's. Currently
       only get benefits of local cache when zooming in.
    2. Interactive utility to callback to the render() function through a javascript button.
    
       