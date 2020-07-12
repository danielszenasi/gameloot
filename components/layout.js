import Header from "../components/header";
import Footer from "../components/footer";

export default ({ children, games }) => (
  <>
    <Header games={games} />
    <main>{children}</main>
    <Footer />
  </>
);
