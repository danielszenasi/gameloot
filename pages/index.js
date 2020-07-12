import Layout from "../components/layout";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Link from "next/link";

export default ({ games }) => (
  <Layout games={games}>
    <Grid container direction="row" justify="space-around" spacing={2}>
      {games.map((game) => {
        return (
          <Grid item key={game.id}>
            <img src={game.cover.url} width="264" height="352"></img>
            <Box>
              <Link href={`/games/[slug]`} as={`/games/${game.slug}`}>
                <a>{game.name}</a>
              </Link>
            </Box>
          </Grid>
        );
      })}
    </Grid>
  </Layout>
);

export async function getStaticProps() {
  const response = await fetch("https://api-v3.igdb.com/games", {
    method: "POST",
    headers: {
      "user-key": process.env.userKey,
    },
    body: "fields name, slug, cover.url; limit 10; sort popularity desc;",
  });
  const games = await response.json();

  return {
    props: {
      games: games.map((game) => ({
        ...game,
        cover: { url: game.cover.url.replace("t_thumb", "t_cover_big") },
      })),
    },
  };
}
