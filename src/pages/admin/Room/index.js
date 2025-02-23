import { useEffect } from "react";
import TableRoom from "../../../components/admin/TableRoom";

function Rooms() {
  useEffect(() => {
    document.title = "Quản lý phòng";
  }, []);

  return (
    <>
      <TableRoom />
    </>
  );
}

export default Rooms;
