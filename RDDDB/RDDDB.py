import os
import sys
import random
# Path for spark source folder
os.environ['SPARK_HOME']="/home/rahul/spark-1.5.1"

# Append pyspark  to Python Path
sys.path.append("/home/rahul/spark-1.5.1/python/")

from pyspark import SparkContext


# RDD consturction. lenRDD acts as a database of point-pairs.
sc = SparkContext('local')
words = sc.parallelize(range(10000000), 8)
lenRDD = words.map(lambda x: (random.random() * 100, random.random() * 100))

# The pointsCache stores the results of the largest query run
pointsCache = []
# The currentRangeQuery stores the query parameters that resulted in pointsCache
currentRangeQuery = (0, 0, 0, 0)


'''
    The crossfilter function takes the minimum and maximum values and first checks
    if the pointsCache has elements matching the ranges. If the ranges are larger
    than what is currently stored in the pointsCache an RDD action is launched
    to re-extract the necessary details.
    Otherwise the pointsCache is queries for faster results.
'''
def crossfilter(xmin, xmax, ymin, ymax, numDisplayed):
    if len(pointsCache) == 0 or currentRangeQuery[0] > xmin or currentRangeQuery[1] < xmax or currentRangeQuery[2] > ymin or currentRangeQuery[3] < ymax :
        global pointsCache
        pointsCache = lenRDD.filter(lambda x: xmax > x[0] > xmin and ymax > x[1] > ymin).collect()
        global currentRangeQuery
        currentRangeQuery = (xmin, xmax, ymin, ymax)

    pairs = filter(lambda x: xmax > x[0] > xmin and ymax > x[1] > ymin, pointsCache)[0:numDisplayed]

    xpoints = []
    ypoints = []
    for (r, g) in pairs:
        xpoints.append(r)
        ypoints.append(g)

    return xpoints, ypoints

