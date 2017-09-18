# Instructions to get started

* Download and install anaconda (this will install python 3 and relevant packages)
* download and install postgresql (brew install postgres) 
* download and install pgadmin
* download all necessary flight data files from http://stat-computing.org/dataexpo/2009/
* ensure pg admin is up and running
* create a new database in postgres called "FlightData"
* Clone the repository 
* in your working directory create a folder called "FlightData" and place all necessary flight data (CSVs) (intentionally excluded from this repository due to its size) - http://stat-computing.org/dataexpo/2009/supplemental-data.html 
* Extract the .gz/zip files for the year 2000 as well as the flight and carrier data files.
* start the juputer notebook (if mac open a terminal and type "jupyter notebook")
* open the Assignment2DataLoad.ipynb and run through the code (NOTE: The process might take a while to finish depending ony your hardware)
* once loaded close the notebook and open the 2nd notebook (FlightDataAnalaysis.ipynb) 


## initial visualisation 

* locate the .graphml file in the root folder of the repository
* Copy and paste it another folder and open using gephi/yEd/D3. 

### initial visualisation in d3 

* open a terminal/cmd prompt and move to "<PATH>/FlightDataVisualisation/VisualisationsD3" directory
* start the python webserver (python -m http.server 8888)
* open a browser and go to http://localhost:8888/DailyFlightHeatmap.html

## Ground rules 

* no dodgy commits
* no dodgy overwrites
* DO NOT OVERRRIDE THE GITIGNORE file. 