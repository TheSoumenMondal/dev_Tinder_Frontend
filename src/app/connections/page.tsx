"use client";

import { connectionApi } from "@/apis/connection-api";
import { connectionType } from "@/types";
import axiosInstance from "@/utils/axios-instance";
import React, { useEffect } from "react";
import ConnectionCard from "@/components/custom/connection-card";

const ConnectionsPage = () => {
  const [connections, setConnections] = React.useState<connectionType[]>([]);
  const getMyConnectionRequests = async () => {
    try {
      const res = await axiosInstance.get(connectionApi.getUserConnections);
      console.log(res.data)
      setConnections(res.data.data);
    } catch (error) {}
  };

  useEffect(() => {
    getMyConnectionRequests();
  }, []);

  return (
    <div className="space-y-3 p-4 pt-20 mx-auto max-w-4xl">
      {connections.map((connection) => (
        <ConnectionCard key={connection._id} data={connection} />
      ))}
    </div>
  );
};

export default ConnectionsPage;
