import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";

const LOCAL_STORAGE_KEY = "ship-sale-default-cc";

const defaultCcAddresses = atomWithStorage<string[]>(LOCAL_STORAGE_KEY, []);
const useDefaultCcAddresses = () => useAtom(defaultCcAddresses);

export default useDefaultCcAddresses;
