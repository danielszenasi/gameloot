import React, { Fragment } from "react";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";
import ListItemText from "@material-ui/core/ListItemText";
import Layout from "../../components/layout";
import useSWR from "swr";
import { useRouter } from "next/router";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import ListSubheader from "@material-ui/core/ListSubheader";
const { Translate } = require("@google-cloud/translate").v2;
import Carousel from "react-multi-carousel";
import Image from "../../components/image";

const useStyles = makeStyles((theme) => ({
  bg: {
    height: "35vh",
    backgroundSize: "cover",
    backgroundPosition: "center center",
    filter: "blur(8px)",
  },
  bgText: {
    height: "225px",
    display: "flex",
    alignItems: "center",
  },
  content: {
    position: "relative",
    marginTop: "-200px",
    marginBottom: "24px",
    flexWrap: "nowrap",
  },
  offers: {
    backgroundColor: theme.palette.background.paper,
  },
  inline: {
    display: "inline",
  },
  root: {
    textAlign: "center",
  },
  title: {
    maxWidth: 400,
    margin: "auto",
    marginTop: 10,
  },
}));

const fetcher = (url) =>
  fetch(url)
    .then((res) => res.json())
    .then((json) => json.data);

export default function Games({ game, games }) {
  const classes = useStyles();
  if (!game) {
    return <div>Not found</div>;
  }
  const coverBig = game.cover.url.replace("t_thumb", "t_cover_big");
  const screenshot = game.screenshots[0].url;
  const screenshotBig = screenshot.replace("t_thumb", "t_screenshot_big");

  const router = useRouter();
  const { slug } = router.query;
  const { data: listing, error } = useSWR(`/api/listings/${slug}`, fetcher);

  const images = game.screenshots.map((screenshot) => screenshot.url);
  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };
  console.log("game", game);

  return (
    <Layout games={games}>
      <Box
        className={classes.bg}
        style={{ backgroundImage: `url(${screenshotBig})` }}
      ></Box>
      <Container maxWidth="md">
        <Grid className={classes.content} container spacing={2}>
          <Grid item>
            <img src={coverBig} width="264" height="352"></img>
          </Grid>
          <Grid item>
            <Typography className={classes.bgText} component="h2" variant="h2">
              {game.name}
            </Typography>

            <Typography variant="subtitle2" gutterBottom>
              Műfaj: {game.genres}
            </Typography>

            <Typography variant="subtitle2" gutterBottom>
              Platformok:{" "}
              {game.platforms.map((platform) => platform.name).join(", ")}
            </Typography>

            <Typography variant="body1" gutterBottom>
              {game.summary}
            </Typography>
            <List
              aria-labelledby="hirdetesek"
              subheader={
                <ListSubheader component="div" id="hirdetesek">
                  Hirdetések
                </ListSubheader>
              }
              className={classes.offers}
            >
              {listing &&
                listing.map((listing, index) => (
                  <Fragment key={listing._id}>
                    <ListItem alignItems="flex-start">
                      <ListItemAvatar>
                        <Avatar
                          alt={listing.owner.email}
                          src="/static/images/avatar/1.jpg"
                        />
                      </ListItemAvatar>
                      <ListItemText
                        primary={listing.owner.email}
                        secondary={
                          <React.Fragment>
                            <Typography
                              component="span"
                              variant="body2"
                              className={classes.inline}
                              color="textPrimary"
                            >
                              {listing.description}
                            </Typography>
                            <br />
                            {listing.post_code}
                          </React.Fragment>
                        }
                      />
                      <ListItemSecondaryAction>
                        {listing.price} Ft
                      </ListItemSecondaryAction>
                    </ListItem>
                    {index > listing.length && (
                      <Divider variant="inset" component="li" />
                    )}
                  </Fragment>
                ))}
            </List>
          </Grid>
        </Grid>
      </Container>
      <div className={classes.root}>
        <Carousel
          responsive={responsive}
          ssr
          showDots={false}
          slidesToSlide={1}
          infinite
          containerClass="container-with-dots"
          itemClass="image-item"
          deviceType={""}
        >
          {images.map((image) => {
            return <Image url={image} alt={image} />;
          })}
        </Carousel>
      </div>
    </Layout>
  );
}

export async function getStaticPaths() {
  const response = await fetch("https://api-v3.igdb.com/games", {
    method: "POST",
    headers: {
      "user-key": process.env.userKey,
    },
    body: "fields name, slug, cover.url; limit 10; sort popularity desc;",
  });
  const games = await response.json();

  const paths = games.map((game) => ({
    params: { slug: game.slug },
  }));

  return { paths, fallback: true };
}

export async function getStaticProps({ params }) {
  console.log("params", params);
  if (!params.slug) {
    return null; // TODO check why slug is null
  }
  const response = await fetch("https://api-v3.igdb.com/games", {
    method: "POST",
    headers: {
      "user-key": process.env.userKey,
    },
    body: `fields name, slug, summary, cover.url, genres.name, platforms.name, platforms.platform_logo.url, screenshots.url, screenshots.height, screenshots.width; where slug = "${params.slug}";`,
  });
  const games = await response.json();

  const translate = new Translate({
    projectId: "games-1593943154529",
  });
  const target = "hu";

  console.log("games[0]", games);
  const [summary] = await translate.translate(games[0].summary, target);
  const [genres] = await translate.translate(
    games[0].genres.map((genre) => genre.name).join(", "),
    target
  );

  const allGamesResponse = await fetch("https://api-v3.igdb.com/games", {
    method: "POST",
    headers: {
      "user-key": process.env.userKey,
    },
    body: "fields name, slug; limit 10; sort popularity desc;",
  });
  const allGames = await allGamesResponse.json();

  return {
    props: {
      games: allGames,
      game: {
        ...games[0],
        summary,
        genres,
        screenshots: games[0].screenshots.map((screenshot) => ({
          ...screenshot,
          url: screenshot.url.replace("t_thumb", "t_cover_big"),
        })),
      },
    },
  };
}
