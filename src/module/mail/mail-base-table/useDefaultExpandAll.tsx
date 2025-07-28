import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";

const LOCAL_STORAGE_KEY = "ship-sale-default-expand-all";

const defaultExpandAll = atomWithStorage(LOCAL_STORAGE_KEY, false);
const useDefaultExpandAll = () => useAtom(defaultExpandAll);

export default useDefaultExpandAll;
