import PropTypes from "prop-types";
import Grid from "@mui/material/Grid";
import PageLayout from "examples/LayoutContainers/PageLayout";
import Header from "examples/Header";
import PublicFooter from "examples/PublicFooter";

function BasicLayout({ image, children }) {
  return (
    <PageLayout>
      <Header />
      <div className="flex flex-col gap-4" style={{ marginTop: 100, marginBottom: 200 }}>
        <Grid container justifyContent="center" alignItems="center" height="100%">
          {children}
        </Grid>
      </div>
      <PublicFooter light />
    </PageLayout>
  );
}

// Typechecking props for the BasicLayout
BasicLayout.propTypes = {
  image: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default BasicLayout;
