import numpy as np
import time
from bokeh.plotting import figure, show
from bokeh.io import output_notebook
import RDDDB
import math

'''
 Takes as input a range query that consists of the
 minimum and maximum x and y values, as well as the
 number of elements to be displayed.

 TODO : Need to auto-adjust the size
'''
def render(xmin, xmax, ymin, ymax, numDisplayed):
    start_time = time.time()
    (xpoints, ypoints) = RDDDB.crossfilter(xmin, xmax, ymin, ymax, numDisplayed)
    x = np.random.random(size=numDisplayed) * 100
    y = np.random.random(size=numDisplayed) * 100

    displayArea = (xmax - xmin) * (ymax - ymin)
    radii = math.sqrt(.1 * displayArea/600)
    print "Radii size = " + str(radii)
    colors = ["#%02x%02x%02x" % (r, g, 100) for r, g in zip(np.floor(50 + 2 * x), np.floor(30 + 2 * y))]

    # output to static HTML file (with CDN resources)
    # output_file("color_scatter.html", title="color_scatter.py example", mode="cdn")

    TOOLS = "resize,crosshair,pan,wheel_zoom,box_zoom,reset,box_select,lasso_select"
    # set output to notebook widget environment
    output_notebook()
    # create a new plot with the tools above, and explicit ranges
    p = figure(tools=TOOLS, x_range=(xmin, xmax), y_range=(ymin, ymax))

    # add a circle renderer with vecorized colors and sizes
    p.circle(xpoints, ypoints, radius=radii, fill_color=colors, fill_alpha=0.6, line_color=None)
    end_time = time.time()
    print "Time taken to render : " + str(end_time - start_time)
    show(p)
    # show the results


