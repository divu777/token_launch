import TokenCard from "../components/TokenCard";
import Tag from "./../components/Tag";
import { CarouselDemo } from "../components/Carousel";
import AppBar from "../components/AppBar";

const Landing = () => {
  return (
    <div>
      <AppBar />

      {/* Hero Section */}
      <div className="flex h-[120vh] justify-evenly items-center p-10  ">
        <div className="flex flex-col justify-center items-start bg-green-500">
          <h1 className="text-9xl font-bold w-[800px]">
            Add Value to your TOken Collection
          </h1>
          <h3 className="text-4xl font-semibold">
            SPL Token marketplace for your community
          </h3>
        </div>

        <TokenCard className=" " />
        <TokenCard className="absolute right-44 top-44" />
      </div>

      {/* 2nd Section */}
      <div className="bg-black text-white h-screen flex flex-col items-center justify-evenly relative py-10">
        <h3 className="text-3xl text-pink-500 uppercase font-bold">
          Coming SOON
        </h3>
        <p className="text-5xl text-center w-2/3 font-semibold">
          Qwero marketplace is a platform where individuals can buy, sell, and
          trade non-fungible tokens (NFTs). NFTs are unique digital assets that
          are verified on a blockchain network, making them secure and
          tamper-proof.
        </p>

        {/* Tags Section */}
        <div className="flex justify-center items-center relative  w-screen py-20">
          {/* Scattered Tags */}
          <Tag text={"creative"} className="rotate-[-30deg] absolute left-80" />
          <Tag
            text={"music"}
            className="rotate-[-20deg] absolute left-[47%] "
          />
          <Tag text={"meme"} className="rotate-[30deg] absolute right-[47%] " />
          <Tag
            text={"virtual"}
            className="rotate-[35deg] absolute right-80  "
          />
        </div>

        {/* Collections */}
        <div className="flex justify-center items-center h-screen w-full bg-slate-500 my-10">
          <CarouselDemo />
        </div>

        {/* footer */}
      </div>
    </div>
  );
};

export default Landing;
