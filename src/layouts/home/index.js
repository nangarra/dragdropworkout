import BasicLayout from "layouts/authentication/components/BasicLayout";
import bgImage from "assets/images/basic-bg.jpg";
import { Card } from "@mui/material";
import MDButton from "components/MDButton";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const goToBuilder = () => {
    navigate("/workout-builder");
  };

  return (
    <BasicLayout styles={false}>
      <div
        className="w-full md:h-[80vh] lg:h-[100vh]"
        style={{ background: "url(/img/drag_drop_background.jpeg)", backgroundSize: "cover" }}
      >
        <div className="px-4 md:px-0 container mx-auto text-white">
          <h1 className="text-[30px] md:text-[50px] lg:text-[80px] font-bold">
            Workouts in Minutes:
          </h1>
          <h1 className="text-[30px] md:text-[50px] lg:text-[80px] font-bold">
            Create & Share For Free.
          </h1>
          <div className="flex flex-col gap-8 mt-8">
            <div className="grid sm:grid-cols-3">
              <p className="text-[14px] md:text-md lg:text-[20px]" style={{ textAlign: "justify" }}>
                Simply drag and drop to create your custom workout-ready to share and use on your
                phone, anytime, anywhere. Whether you love yoga, strength training, or any other
                fitness discipline, choose from over 100+ exercises. <b>No signup</b> required and{" "}
                <b>completely free!</b>
              </p>
            </div>

            <div className="flex w-full justify-center md:justify-start my-4">
              <div
                className="rounded-md text-[30px] text-[#7560C5] bg-white w-fit flex justify-center cursor-pointer hover:bg-gray-100 transition duration-300 ease-in-out"
                style={{ padding: "20px 60px" }}
                onClick={goToBuilder}
              >
                <b>Build Now</b>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 md:px-0 container mx-auto text-black" style={{ marginTop: 100 }}>
        <motion.h1
          initial={{ opacity: 0, x: -100 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="text-[70px] font-bold text-center w-full"
        >
          The best part is, it's Free
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
        >
          <p className="text-[20px] w-full text-center">
            Unleash your creativity with our fast, tree, and easy-to-use drag-and-drop Workout
            Builder.
          </p>
          <p className="text-[20px] w-full text-center">
            Effortlesslv customize our workouts in detail without an registration required.
          </p>
          <p className="text-[20px] w-full text-center">
            Simply drag and drop exercises to create your perfect routine-no signup needed!
          </p>
        </motion.div>
      </div>

      <div className="px-4 md:px-0 container mx-auto text-black" style={{ marginTop: 100 }}>
        <div className="grid lg:grid-cols-2 gap-8 justify-center">
          <motion.img
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            src="/img/drag_drop_tool.gif"
            className="rounded-lg shadow-lg"
          />
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="flex flex-col gap-2"
          >
            <h1 className="text-[40px] font-bold w-full">Fast and Easy Drag-n-Drop Tool</h1>
            <p className="text-[20px] w-full">
              Experience ultimate convenience with our free, user-friendlv Workout Builder. Quickl
              create custom routines tor vourselt or Cll- ents by dragging and dropping trom over
              100 exercises. No registration need ec-lust seamess, Inurve workout cus- tomization.
              Get started now and see how easy It IS!
            </p>
          </motion.div>
        </div>
      </div>

      <div className="px-4 md:px-0 container mx-auto text-black" style={{ marginTop: 100 }}>
        <div className="grid lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="flex flex-col gap-2"
          >
            <h1 className="text-[40px] font-bold w-full">Easy-to-Follow Animations</h1>
            <p className="text-[20px] w-full">
              Forget long instructional videos! Our work- outs teature simple animations and
              easy-to-understand Glrs that make It er. tortess to tollow alona. We believe in the
              importance of doing the workout rathe than fixating on perfect execution. For those
              who need detalled instructions each exercise comes with comprenensivE Intormation. Get
              moving guickly and easill with our straighttorward approach
            </p>
          </motion.div>

          <motion.img
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            src="/img/animation_.gif"
            className="rounded-lg shadow-lg"
          />
        </div>
      </div>

      <div
        className="px-4 md:px-0 container mx-auto flex justify-center"
        style={{ marginTop: 100, marginBottom: 100 }}
      >
        <div
          className="rounded-md bg-[#7560C5] text-[30px] text-white w-fit flex justify-center cursor-pointer hover:bg-[#7560C5]/80 transition duration-300 ease-in-out"
          style={{ padding: "20px 60px" }}
          onClick={goToBuilder}
        >
          <b>Build Now</b>
        </div>
      </div>
    </BasicLayout>
  );
};

export default Home;
