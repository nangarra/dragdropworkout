import PropTypes from "prop-types";
import MDBox from "components/MDBox";
import PageLayout from "examples/LayoutContainers/PageLayout";
import Footer from "layouts/authentication/components/Footer";
import { NavLink } from "react-router-dom";

const Cover = ({ image }) => (
  <div className="relative h-full">
    <div className="absolute top-0 w-full p-4">
      <NavLink to="/">
        <div className="text-white text-[35px] cursor-pointer bg-none w-full text-center">
          <span className="">Drag</span>
          <span className="font-semibold">Drop</span>
          <span className="font-bold">Workout</span>
        </div>
      </NavLink>
    </div>
    <MDBox
      minHeight="100vh"
      sx={{
        backgroundImage: ({ functions: { linearGradient, rgba }, palette: { gradients } }) =>
          image &&
          `${linearGradient(
            rgba(gradients.dark.main, 0.4),
            rgba(gradients.dark.state, 0.4)
          )}, url(${image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    />
    <Footer light />
  </div>
);
function CoverLayout({ coverHeight, image, children }) {
  return (
    <PageLayout>
      <div className="grid grid-cols-2">
        <div className="relative h-full hidden md:block">
          <div className="absolute top-0 w-full p-4">
            <NavLink to="/">
              <div className="text-white text-[35px] cursor-pointer bg-none w-full text-center">
                <span className="">Drag</span>
                <span className="font-semibold">Drop</span>
                <span className="font-bold">Workout</span>
              </div>
            </NavLink>
          </div>
          <MDBox
            minHeight="100vh"
            sx={{
              backgroundImage: ({ functions: { linearGradient, rgba }, palette: { gradients } }) =>
                image &&
                `${linearGradient(
                  rgba(gradients.dark.main, 0.4),
                  rgba(gradients.dark.state, 0.4)
                )}, url(${image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          />
          <Footer light />
        </div>

        <div className="absolute block md:hidden top-0 right-0 bottom-0 left-0 w-full h-full">
          <Cover image={image} />
        </div>
        <div className="grid items-center h-[100vh] w-full justify-center col-span-2 md:col-span-1">
          {children}
        </div>
      </div>
    </PageLayout>
  );
}

// Setting default props for the CoverLayout
CoverLayout.defaultProps = {
  coverHeight: "35vh",
};

// Typechecking props for the CoverLayout
CoverLayout.propTypes = {
  coverHeight: PropTypes.string,
  image: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default CoverLayout;
