# Traffic Map Berlin

Traffic Map Berlin is an application for visualizing and analyzing traffic disruptions within Berlin. This includes construction sites, road closures, accidents, and other disturbances. The corresponding data is provided by the [traffic information center VMZ](https://daten.berlin.de/datensaetze/baustellen-sperrungen-und-sonstige-storungen-von-besonderem-verkehrlichem-interesse) and can be filtered by time period and cause.

![Map Demo](/img/TrafficMapDemo.mp4)

This project was created during the summer semester 2020 as part of the "C72 Software Development Project" course at the University of Applied Sciences Berlin. It was developed by a student team consisting of one backend developer and two frontend developers without significant prior experience in web development. As one of the frontend developers, I designed the home-page including the map visualization using OpenStreetMaps and Leaflet and implemented the filtering logic, while collaborating with the backend team to integrate the REST API.
Appart from the frontend and backend components, the project also included continuous integration with Jenkins and testing with Sonar. The database containing the traffic disruption data was provided by the supervising professors.

## Project Status

This project is **archived** and was developed for educational purposes during a 2020 university course. Key limitations:

- **Dependency conflicts**: Angular CLI 9.1.3 and outdated libraries prevent modern builds.
- **Security warnings**: The Docker workaround uses deprecated OpenSSL providers.
- **Datasets**: The database used for this project is not available anymore.

Use this codebase as a reference for:

- Legacy Angular/Spring integration
- Leaflet map visualization
- CI/CD with Jenkins/Sonar

## Components

The landing page consist of a home-page displaying a map with traffic disruptions overlayed as Leaflet markers. There is an additional option menu, which allows the user to filter the displayed events by category and timeframe.

The statistics page includes three different types of diagrams displaying the traffic disruptions by category for each of Berlins districts. A forth diagram displays the durations of traffic disruptions by district with the time axis being fully customizable in the amount and size of bins.

![Frontend Components](/img/frontend_architecture.png)

## Lessons Learned

At the beginning of the project, I decided with my group to divide into a frontend and backend team to cleanly devide the tasks. We used issue tracking to assign tasks and monitor progress throughout the entire project, aiding the group to make continuous progress.

As this was my first frontend project without any prior experience, I have learned of invaluable good documentation for development tools can be. The Tutorials, Guides and References of Angular CLI and Angular Material have proved to be an excellent resource to self-teach frontend development skills by building a first project.
Starting to get familiar with the framework through documentation and tutorials early in the project phase provided us with the knowledge needed to design a fitting component architecture and allowed me to start developing effectively once we settled on a design.

Inconsistencies in the datasets have been a challenge, specifically for the statistics page, which needed a clear categorization by districts. However, with a structured approach we were able to handle datasets with ambigous district entries effectively.

## Frameworks

The frontend was developed with [Angular CLI](https://github.com/angular/angular-cli) 9.1.4 and uses:

- [Leaflet library](https://leafletjs.com/) with [Markercluster plugin](https://github.com/Leaflet/Leaflet.markercluster) for the map
- [Chart.js](https://www.chartjs.org/) for statistics
- [Angular Material](https://material.angular.io/) for the UI

The backend was developed in Java using:

- [Spring Data MongoDB](https://spring.io/projects/spring-data-mongodb) for data retrieval
- [Spring Data REST](https://spring.io/projects/spring-data-rest) to provide processed data through a REST API

## Usage

### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

**Note:** Since this is an old project, there are a lot of dependency conflicts pretending the build to complete.

### Development server

Run `ng serve` for a dev server. Navigate to [`http://localhost:4200/`](http://localhost:4200/). The app will automatically reload if you change any of the source files.

### Run in Docker

To quickly deploy the current git version of the frontend in a [Docker](https://www.docker.com/) container, build the image and run the container with the provided [Dockerfile](Dockerfile).
The website will be available at [`http://localhost:4200/`](http://localhost:4200/).

**Warning:** The image uses the node option `NODE_OPTIONS="--openssl-legacy-provider"` to build despite dependency issues. Using a legacy OpenSSL provider may expose vulnerabilities.

Run `docker build -t traffic_map_berlin .` to build the Docker image.

Run `docker run -it -p 4200:4200 traffic_map_berlin` to start the container.

### Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

### Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
