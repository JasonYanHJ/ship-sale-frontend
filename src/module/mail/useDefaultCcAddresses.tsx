import { useEffect, useState } from "react";

const LOCAL_STORAGE_KEY = "ship-sale-default-cc";

function loadStorage() {
  const cc = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!cc) return [];
  return JSON.parse(cc);
}

function setStorage(cc: string[]) {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cc));
}

const useDefaultCcAddresses = () => {
  const [defaultCcAddresses, setDefaultCcAddresses] =
    useState<string[]>(loadStorage);

  useEffect(() => {
    setStorage(defaultCcAddresses);
  }, [defaultCcAddresses]);

  return { defaultCcAddresses, setDefaultCcAddresses };
};

export default useDefaultCcAddresses;
