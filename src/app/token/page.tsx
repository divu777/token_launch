import React from "react";
import TokenForm from "../components/TokenForm";
import AppBar from "../components/AppBar";
const CreateTokenPage = () => {
  return (
    <div className="container mx-auto p-4">
      <AppBar />
      <h1 className="text-2xl font-bold mb-4">Create New Token</h1>
      <TokenForm />
    </div>
  );
};

export default CreateTokenPage;
