import { useState } from "react";
import TextField from "@mui/material/TextField";

function App() {
  const [searchText, setSearchText] = useState("");

  return (
    <div style={{ padding: "20px" }}>
      <TextField
        label="Search"
        variant="outlined"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />

      <p>Search text: {searchText}</p>
    </div>
  );
}

export default App;