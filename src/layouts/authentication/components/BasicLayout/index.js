import PropTypes from "prop-types";
import Grid from "@mui/material/Grid";
import PageLayout from "examples/LayoutContainers/PageLayout";
import Header from "examples/Header";
import PublicFooter from "examples/PublicFooter";

function BasicLayout({ image, children, styles = true }) {
  return (
    <PageLayout>
      <Header />
      <div className="flex flex-col gap-4" style={{ marginTop: 70, marginBottom: styles ? 20 : 0 }}>
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
  children: PropTypes.node.isRequired,
  styles: PropTypes.bool,
};

export default BasicLayout;
