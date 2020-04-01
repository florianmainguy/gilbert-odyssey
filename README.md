Gilbert Odyssey is an interactive visualisation of the 5 Monuments of cycling<br/><br/>

Named after Philippe Gilbert, whose dedication for winning all Monuments is outstanding.<br/>
One last Monument win with Milan-Sanremo would make him join the elite club of Rik Van Looy, 
Eddy Merckx and Roger de Vlaeminck.<br/><br/>

Try it here: https://dry-beach-86777.herokuapp.com/

![quick view around]()

## Development Stack

**React** app using **Mapbox** for the map style and API
- App created with the popular node module **Create-React-App**
- Added back end with **node.js** and **Express** framework
- Database created with **MongoDB** and populated manually
- **Mapbox-Gl-JS** for the javascript library that uses WebGL for rendering

## Features

On the **Home** view, you can see the focus on the map. It shows the 5 Monument races, and asks the user to choose a race or search for a cyclist. You can also use the map and click on a race.
/* home view */

There are 2 main views, the **Race** view and the **Cyclist** view. 
The **Race** view zooms on the race and the interface shows data about the overall best winners, the full history and the elevation profile. From then you can click towards another race with the arrows, or click on a cyclist name. 
The **Cyclist** view shows a picture of the cyclist, its Monument wins and a summary of its wins with icons you can click on, that bring different color for better visualisation. From then you can click on a race name or search for another cyclist through the search box.
/* race and cyclist view*/

There is a **About** icon at the bottom that brings a pop-up for information about the app, and a link the /*github*/ repo.
There is also a **FullScreen** icon, that allows to see the map in full screen and interract with it.


