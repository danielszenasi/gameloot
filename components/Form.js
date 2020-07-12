import { useState } from "react";
import { useRouter } from "next/router";
import { mutate } from "swr";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import InputAdornment from "@material-ui/core/InputAdornment";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles((theme) => ({
  form: {
    height: "35vh",
    backgroundSize: "cover",
    backgroundPosition: "center center",
    filter: "blur(8px)",
  },
}));

const Form = ({
  formId,
  listingForm,
  games,
  platforms,
  forNewListing = true,
}) => {
  const router = useRouter();
  const contentType = "application/json";
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const classes = useStyles();

  const [form, setForm] = useState({
    description: listingForm.description,
    game_slug: listingForm.game_slug,
    platform: listingForm.platform,
    price: listingForm.price,
    post_code: listingForm.post_code,
  });

  /* The PUT method edits an existing entry in the mongodb database. */
  const putData = async (form) => {
    const { id } = router.query;

    try {
      const res = await fetch(`/api/listings/${id}`, {
        method: "PUT",
        headers: {
          Accept: contentType,
          "Content-Type": contentType,
        },
        body: JSON.stringify(form),
      });
      const { data } = await res.json();

      mutate(`/api/listings/${id}`, data, false); // Update the local data without a revalidation
      router.push("/");
    } catch (error) {
      setMessage("Failed to update pet");
    }
  };

  /* The POST method adds a new entry in the mongodb database. */
  const postData = async (form) => {
    try {
      await fetch("/api/listings", {
        method: "POST",
        headers: {
          Accept: contentType,
          "Content-Type": contentType,
        },
        body: JSON.stringify(form),
      });
      router.push("/");
    } catch (error) {
      setMessage("Failed to add listing");
    }
  };

  const handleChange = (e) => {
    const target = e.target;
    const value =
      target.name === "poddy_trained" ? target.checked : target.value;
    const name = target.name;

    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = formValidate();
    if (Object.keys(errs).length === 0) {
      console.log(form);
      // forNewListing ? postData(form) : putData(form);
    } else {
      setErrors({ errs });
    }
  };

  /* Makes sure pet info is filled for pet name, owner name, species, and image url*/
  const formValidate = () => {
    let err = {};
    // if (!form.name) err.name = "Name is required";
    // if (!form.owner_name) err.owner_name = "Owner is required";
    // if (!form.species) err.species = "Species is required";
    // if (!form.image_url) err.image_url = "Image URL is required";
    return err;
  };

  return (
    <>
      <form id={formId} onSubmit={handleSubmit}>
        <Box paddingY={1}>
          <Autocomplete
            id="combo-box-demo"
            options={games}
            getOptionLabel={(option) => option.name}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Jaték"
                name="game_slug"
                onChange={handleChange}
                value={form.game_slug}
                required
                variant="outlined"
              />
            )}
          />
        </Box>
        <Box paddingY={1}>
          <TextField
            id="outlined-multiline-flexible"
            label="Leírás"
            multiline
            rowsMax={4}
            style={{ width: "100%" }}
            name="description"
            required
            value={form.description}
            onChange={handleChange}
            variant="outlined"
          />
        </Box>
        <Box paddingY={1}>
          <FormControl variant="outlined" style={{ width: "100%" }}>
            <InputLabel htmlFor="outlined-age-native-simple">
              Platform
            </InputLabel>
            <Select
              native
              value={form.platform.name}
              onChange={handleChange}
              label="Platform"
              required
              inputProps={{
                name: "platform",
                id: "outlined-age-native-simple",
              }}
            >
              <option aria-label="None" value="" />
              {platforms.map((platform) => (
                <option value={platform}>{platform.name}</option>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Box paddingY={1}>
          <FormControl fullWidth variant="outlined">
            <InputLabel htmlFor="outlined-adornment-amount">Ár</InputLabel>
            <OutlinedInput
              id="outlined-adornment-amount"
              value={form.price}
              name="price"
              type="number"
              style={{ width: "100%" }}
              required
              onChange={handleChange}
              endAdornment={<InputAdornment position="end">Ft</InputAdornment>}
              labelWidth={60}
            />
          </FormControl>
        </Box>
        <Box paddingY={1}>
          <TextField
            type="number"
            name="post_code"
            style={{ width: "100%" }}
            value={form.post_code}
            onChange={handleChange}
            id="outlined-basic"
            label="Irányítószám"
            variant="outlined"
          />
        </Box>

        <Button type="submit" variant="contained" color="primary">
          Mentés
        </Button>
      </form>
      <p>{message}</p>
      <Box>
        {Object.keys(errors).map((err, index) => (
          <li key={index}>{err}</li>
        ))}
      </Box>
    </>
  );
};

export default Form;
