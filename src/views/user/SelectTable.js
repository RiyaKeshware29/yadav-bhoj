import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import Button from "../../component/CustomButton";
import UserComponent from "../../component/UserComponent";
import axios from "axios";

const SelectTable = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const { updateUser } = useUser();
  const navigate = useNavigate();
  const [selectedTable, setSelectedTable] = useState("");
  const [availableTables, setAvailableTables] = useState([]);

  useEffect(() => {
    fetchAvailableTables();
    // eslint-disable-next-line
  }, []);

  const fetchAvailableTables = async () => {
    try {
      const response = await axios.get(`${apiUrl}check-table`);
      const busyTables = response.data
        .filter((table) => !table.available)
        .map((table) => table.table_no);

      const totalTables = Array.from({ length: 10 }, (_, i) => i + 1); // Tables 1 to 10

      const freeTables = totalTables.filter(
        (tableNo) => !busyTables.includes(tableNo)
      );

      setAvailableTables(freeTables);
    } catch (error) {
      console.error("Error fetching table data:", error);
    }
  };

  const handleSelect = () => {
    if (!selectedTable) return alert("Please select a table number.");
    updateUser({ tableNumber: selectedTable });
    navigate("/u/menu");
  };

  return (
    <UserComponent
      title="Great, now just select where you are seated"
      subtitle="Enter table number"
      step={3}
    >
      <select
        className="input"
        value={selectedTable}
        onChange={(e) => setSelectedTable(e.target.value)}
      >
        <option value="">-- Select Table --</option>
        {availableTables.map((tableNo) => (
          <option key={tableNo} value={tableNo}>
            Table {tableNo}
          </option>
        ))}
      </select>

      <Button width="90%" text="Select Table" onClick={handleSelect} />
    </UserComponent>
  );
};

export default SelectTable;
