"use client";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useGet } from "@/Hooks/UseGet";
import FullPageLoader from "@/components/Loading";
import { useSelector } from "react-redux";

const FeesDetails = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const { id } = useParams();
  const isLoading = useSelector((state) => state.loader.isLoading);

  const { refetch, loading, data } = useGet({
    url: `${apiUrl}/owner/item/${id}`,
  });

  useEffect(() => {
    refetch();
  }, [refetch]);

  if (isLoading || loading || !data) {
    return <FullPageLoader />;
  }


  return (
    <div className="container !mx-auto !py-6 !px-4">
      
    </div>
  );
};

export default FeesDetails;