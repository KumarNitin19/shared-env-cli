#!/usr/bin/env node

const getData = async () => {
  try {
    const resp = await fetch("http:127.0.0.1:7000/cli/get-env-varaibles/");
    const data = await resp.json();
    return data;
  } catch (error) {
    console.log("Error : ", error);
  }
};

getData();

// getENVData();
