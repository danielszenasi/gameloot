import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/client";
import AppBar from "@material-ui/core/AppBar";
import { fade, makeStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import useAutocomplete from "@material-ui/lab/useAutocomplete";
import SearchIcon from "@material-ui/icons/Search";
import InputBase from "@material-ui/core/InputBase";
import { useRouter } from "next/router";

import styles from "./header.module.css";

const useStyles = makeStyles((theme) => ({
  toolbar: {
    zIndex: 1,
    position: "relative",
  },
  wrapper: {
    display: "flex",
    justifyContent: "space-between",
  },
  label: {
    display: "block",
  },
  input: {
    width: 200,
  },
  listbox: {
    width: 356,
    margin: 0,
    padding: 0,
    zIndex: 1,
    position: "absolute",
    listStyle: "none",
    backgroundColor: theme.palette.background.paper,
    overflow: "auto",
    maxHeight: 200,
    border: "1px solid rgba(0,0,0,.25)",
    '& li[data-focus="true"]': {
      backgroundColor: "#4a8df6",
      color: "white",
      cursor: "pointer",
    },
    "& li:active": {
      backgroundColor: "#2977f5",
      color: "white",
    },
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },

    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "auto",
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inputRoot: {
    color: "inherit",
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: 300,
    },
  },
}));

// The approach used in this component shows how to built a sign in and sign out
// component that works on pages which support both client and server side
// rendering, and avoids any flash incorrect content on initial page load.
export default ({ games }) => {
  const classes = useStyles();
  const [session, loading] = useSession();
  const router = useRouter();

  const {
    getRootProps,
    getInputLabelProps,
    getInputProps,
    getListboxProps,
    getOptionProps,
    groupedOptions,
  } = useAutocomplete({
    id: "use-autocomplete-demo",
    options: games,
    getOptionLabel: (option) => option.name,
    blurOnSelect: true,
    clearOnEscape: true,
    onChange: (e, game) => {
      router.push(`/games/${game.slug}`);
    },
  });

  return (
    <div className={classes.toolbar}>
      <AppBar position="static">
        <Toolbar className={classes.wrapper}>
          <div>
            <div className={classes.search} {...getRootProps()}>
              <div className={classes.searchIcon} {...getInputLabelProps()}>
                <SearchIcon />
              </div>
              <InputBase
                placeholder="Search…"
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput,
                }}
                inputProps={{ "aria-label": "search", ...getInputProps() }}
              />
            </div>

            {groupedOptions.length > 0 ? (
              <ul className={classes.listbox} {...getListboxProps()}>
                {groupedOptions.map((option, index) => (
                  <li {...getOptionProps({ option, index })}>{option.name}</li>
                ))}
              </ul>
            ) : null}
          </div>
          <noscript>
            <style>{`.nojs-show { opacity: 1; top: 0; }`}</style>
          </noscript>
          <div className={styles.signedInStatus}>
            <p
              className={`nojs-show ${
                !session && loading ? styles.loading : styles.loaded
              }`}
            >
              {!session && (
                <>
                  <span className={styles.notSignedInText}>
                    You are not signed in
                  </span>
                  <a
                    href={`/api/auth/signin`}
                    className={styles.buttonPrimary}
                    onClick={(e) => {
                      e.preventDefault();
                      signIn();
                    }}
                  >
                    Sign in
                  </a>
                </>
              )}
              {session && (
                <>
                  <span
                    style={{ backgroundImage: `url(${session.user.image})` }}
                    className={styles.avatar}
                  />
                  <span className={styles.signedInText}>
                    <small>Signed in as</small>
                    <br />
                    <strong>{session.user.email || session.user.name}</strong>
                  </span>
                  <a
                    href={`/api/auth/signout`}
                    className={styles.button}
                    onClick={(e) => {
                      e.preventDefault();
                      signOut();
                    }}
                  >
                    Sign out
                  </a>
                </>
              )}
            </p>
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );

  // const [ session, loading ] = useSession()

  // return (
  //   <header>
  //     <noscript>
  //       <style>{`.nojs-show { opacity: 1; top: 0; }`}</style>
  //     </noscript>
  //     <div className={styles.signedInStatus}>
  //       <p className={`nojs-show ${(!session && loading) ? styles.loading : styles.loaded}`}>
  //         {!session && <>
  //           <span className={styles.notSignedInText}>You are not signed in</span>
  //           <a
  //               href={`/api/auth/signin`}
  //               className={styles.buttonPrimary}
  //               onClick={(e) => {
  //                 e.preventDefault();
  //                 signIn();
  //               }}
  //             >
  //               Sign in
  //             </a>
  //         </>}
  //         {session && <>
  //           <span style={{backgroundImage: `url(${session.user.image})` }} className={styles.avatar}/>
  //           <span className={styles.signedInText}>
  //             <small>Signed in as</small><br/>
  //             <strong>{session.user.email || session.user.name}</strong>
  //             </span>
  //           <a
  //               href={`/api/auth/signout`}
  //               className={styles.button}
  //               onClick={(e) => {
  //                 e.preventDefault();
  //                 signOut();
  //               }}
  //             >
  //               Sign out
  //             </a>
  //         </>}
  //       </p>
  //     </div>

  //   </header>
  // )
};

const top100Films = [
  { title: "The Shawshank Redemption", year: 1994 },
  { title: "The Godfather", year: 1972 },
  { title: "The Godfather: Part II", year: 1974 },
  { title: "The Dark Knight", year: 2008 },
  { title: "12 Angry Men", year: 1957 },
  { title: "Schindler's List", year: 1993 },
];
