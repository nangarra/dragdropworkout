import PropTypes from "prop-types";
import Link from "@mui/material/Link";
import Icon from "@mui/material/Icon";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import typography from "assets/theme/base/typography";

function PublicFooter({ company, links, className }) {
  const { href, name } = company;
  const { size } = typography;

  return (
    <MDBox
      width="100%"
      variant="gradient"
      bgColor="primary"
      coloredShadow="primary"
      className="fixed bottom-0"
    >
      <div className="flex items-center justify-between container mx-auto h-[200px]">
        <MDBox
          display="flex"
          justifyContent="center"
          alignItems="center"
          flexWrap="wrap"
          color="white"
          fontSize={size.sm}
        >
          &copy; {new Date().getFullYear()}, made with
          <MDBox fontSize={size.md} color="white" mb={-0.5} mx={0.25}>
            <Icon color="inherit" fontSize="inherit">
              favorite
            </Icon>
          </MDBox>
          by
          <Link target="_blank">
            <MDTypography variant="button" fontWeight="medium">
              &nbsp;Nick&nbsp;
            </MDTypography>
          </Link>
          for a better web.
        </MDBox>
      </div>
    </MDBox>
  );
}

// Setting default values for the props of PublicFooter
PublicFooter.defaultProps = {
  company: { href: "/", name: "Creative Tim" },
  links: [
    { href: "/", name: "Creative Tim" },
    { href: "/", name: "About Us" },
    { href: "/", name: "Blog" },
    { href: "/", name: "License" },
  ],
};

// Typechecking props for the PublicFooter
PublicFooter.propTypes = {
  company: PropTypes.objectOf(PropTypes.string),
  links: PropTypes.arrayOf(PropTypes.object),
};

export default PublicFooter;
