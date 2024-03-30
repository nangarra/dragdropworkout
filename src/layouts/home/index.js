import BasicLayout from "layouts/authentication/components/BasicLayout";
import bgImage from "assets/images/basic-bg.jpg";
import { Card } from "@mui/material";

const Home = () => {
  return (
    <BasicLayout image={bgImage}>
      <Card className="p-8">
        <div className="grid w-full h-full justify-center items-center">COMING SOON</div>
      </Card>
    </BasicLayout>
  );
};

export default Home;
