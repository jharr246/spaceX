import React, { useEffect, useState } from "react";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import { makeStyles } from "@material-ui/core/styles";
import "./App.css";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import logo from "./assets/sxlogo.jpeg";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: "1.5rem",
    width: "50vw",
  },
  media: {
    height: 240,
  },
  root: {
    maxWidth: 345,
    margin: "3rem 0 3rem 0",
  },
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100vw",
  },
  select: {
    backgroundColor: "#fff",
  },
  label: {
    color: "#fff",
  },
  header: {
    backgroundColor: "black",
    width: "100vw",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
}));

const LAUNCHES_QUERY = `{
  launches {
    launch_date_local
    launch_site {
      site_name
    }
    launch_success
    launch_year
    mission_name
    rocket {
      rocket_name
      rocket_type
    }
    details
    links {
      flickr_images
    }
  }
}`;

function App() {
  const classes = useStyles();
  const [launches, setLaunches] = useState([]);
  const [mission, setMission] = useState("");
  const [missionDetails, setMissionDetails] = useState("");
  const [missionImg, setMissionImg] = useState("");

  console.log(launches);

  const handleSelect = (event) => {
    setMission(event.target.value);
  };

  const DETAILS_QUERY = `{
    launches(find: {mission_name: "${mission}"}) {
      details
      launch_date_unix
      links {
        flickr_images
      }
      launch_success
      launch_site {
        site_name_long
      }
    }
  }`;

  // format unix time

  const milliseconds = missionDetails?.launch_date_unix * 1000;
  const dateObject = new Date(milliseconds);
  const friendlyDate = dateObject.toLocaleString();

  useEffect(() => {
    fetch("https://api.spacex.land/graphql/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: LAUNCHES_QUERY }),
    })
      .then((response) => response.json())
      .then((data) => setLaunches(data.data.launches));

    // mission details

    if (mission) {
      fetch("https://api.spacex.land/graphql/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: DETAILS_QUERY }),
      })
        .then((response) => response.json())
        .then((data) => {
          setMissionDetails(data.data.launches[0]);
        });
    }
  }, [mission]);

  console.log(missionDetails);
  return (
    <div className={classes.container}>
      <header className={classes.header}>
        <img src={logo} alt="spaceX" height="150" />
        <FormControl className={classes.formControl}>
          <Select
            className={classes.select}
            value={mission}
            onChange={handleSelect}
            id="mission"
          >
            {launches?.map((launch) => {
              return (
                <MenuItem value={launch.mission_name}>
                  {launch.mission_name}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </header>
      {mission ? (
        <Card className={classes.root}>
          <CardActionArea>
            <CardMedia
              className={classes.media}
              image={missionDetails?.links?.flickr_images[0]}
              title="Contemplative Reptile"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                {mission}
              </Typography>
              <Typography gutterBottom variant="h6" component="h2">
                {friendlyDate}
              </Typography>
              <Typography gutterBottom variant="h7" component="h2">
                {missionDetails?.launch_site?.site_name_long}
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                {missionDetails?.details}
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      ) : (
        <></>
      )}
    </div>
  );
}

export default App;
