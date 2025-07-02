import { useCallback, useMemo, useState } from "react";
import { User } from "../auth/User";
import { Select } from "antd";
import { apiRequest, withMessage } from "../../service/api-request/apiRequest";

function SelectDispatcher({
  dispatchers,
  dispatcher_id,
  emailId,
}: {
  dispatchers: User[];
  dispatcher_id: number | null;
  emailId: number;
}) {
  const [currentDispatcher, setCurrentDispatcher] = useState<number | null>(
    dispatcher_id
  );
  const [loading, setLoading] = useState(false);

  const options = useMemo(
    () => dispatchers.map((d) => ({ label: d.name, value: d.id })),
    [dispatchers]
  );
  const handleChange = useCallback(
    (value: number) => {
      setLoading(true);
      withMessage(
        apiRequest(`/emails/${emailId}/dispatch`, { dispatcher_id: value })
      )
        .then(() => setCurrentDispatcher(value))
        .finally(() => setLoading(false));
    },
    [emailId]
  );

  return (
    <Select
      value={currentDispatcher}
      onChange={handleChange}
      options={options}
      style={{ width: 160 }}
      loading={loading}
    />
  );
}

export default SelectDispatcher;
