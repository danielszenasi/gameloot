import Form from "../../components/Form";
import Container from "@material-ui/core/Container";

const NewListing = ({ games, platforms }) => {
  const listingForm = {
    description: "",
    game_slug: "",
    platform: { name: "", url: "" },
    price: "",
    post_code: "",
  };

  return (
    <Container maxWidth="xs">
      <Form
        formId="add-listing-form"
        listingForm={listingForm}
        games={games}
        platforms={platforms}
      />
    </Container>
  );
};

export default NewListing;

export async function getStaticProps() {
  const gamesResponse = await fetch("https://api-v3.igdb.com/games", {
    method: "POST",
    headers: {
      "user-key": process.env.userKey,
    },
    body: "fields name, slug; limit 10; sort popularity desc;",
  });
  const games = await gamesResponse.json();

  const platformsResponse = await fetch("https://api-v3.igdb.com/platforms", {
    method: "POST",
    headers: {
      "user-key": process.env.userKey,
    },
    body: `fields name, platform_logo; where slug =("ps2","ps3", "playstation-5", "ps4--1", "xbox-series-x", "xboxone", "xbox360");`,
  });
  const platforms = await platformsResponse.json();

  console.log(platforms);
  return {
    props: {
      platforms,
      games,
    },
  };
}
