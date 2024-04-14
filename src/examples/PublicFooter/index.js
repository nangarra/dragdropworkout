import PropTypes from "prop-types";
import MDBox from "components/MDBox";
import typography from "assets/theme/base/typography";
import { useLocation } from "react-router-dom";

function PublicFooter({ company, links, className }) {
  const { href, name } = company;
  const { size } = typography;

  const location = useLocation();

  return (
    <MDBox
      width="100%"
      variant="gradient"
      bgColor="primary"
      coloredShadow="primary"
      className={location.pathname === "/" ? "fixed bottom-0" : ""}
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
          DragDropWorkout: Your free workout planner that simplifies planning and executing workouts
          within minutes.
        </MDBox>
        <MDBox
          display="flex"
          justifyContent="center"
          alignItems="center"
          flexWrap="wrap"
          color="white"
          fontSize={size.sm}
        >
          Copyright © Nangarra Inc {new Date().getFullYear()}.
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
