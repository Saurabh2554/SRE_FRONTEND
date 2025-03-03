import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import { Box, Tooltip } from "@mui/material";
import { Link } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
import dataAxleLogo from "../../Resources/dataaxlelogo.png";

export const MuiNavbar = () => {

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="fixed"
        sx={{
          backgroundColor:"#C5C5C5", //#8b9dc3
          //display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          //borderBottom: 1,
          borderColor:"white",// "#C5C5C5",
        }}
      >
        <Link to="/" style={{ textDecoration: "none" }}>
        <Toolbar>
          <Link to="/" style={{ textDecoration: "none" }}>
          <img
              src={dataAxleLogo}
              alt="Data Axle Logo"
              style={{ height: "50px" }} // Adjust the height as needed
            />
          </Link>
        </Toolbar>
        </Link>

        <div style={{ marginTop: "-15px" }}>
          <>
            <Tooltip title="Add Business Unit" >
              <Link
                to="/newBusinessUnit"
                style={{
                  textDecoration: "none",
                  color: "black",
                  fontWeight: "bold",
                  fontSize: "16px",
                  cursor:"pointer"
                }}
              >
                Add Business Unit
              </Link>
            </Tooltip>

            <Tooltip title="Add new service" >
              <Link
                to="/newSubBusinessUnit"
                style={{
                  textDecoration: "none",
                  color: "black",
                  fontWeight: "bold",
                  fontSize: "16px",
                  marginLeft: "15px",
                  cursor: 'pointer'
                }}
              >
                Add Sub-Business Unit
              </Link>
            </Tooltip>
            <Tooltip title="Monitor a new service" >
              <Link
                to="/newService"
                style={{
                  textDecoration: "none",
                  color: "black",
                  fontWeight: "bold",
                  fontSize: "16px",
                  marginLeft: "15px",
                  cursor: 'pointer'
                }}
              >
                Monitoring
              </Link>
            </Tooltip>
            <Tooltip title="View the Detailed Dashboard Here" >
              <Link
                to="/"
                style={{
                  textDecoration: "none",
                  color: "black",
                  fontWeight: "bold",
                  fontSize: "16px",
                  marginLeft: "15px",
                  cursor: 'pointer'
                }}
              >
                Dashboard
              </Link>
            </Tooltip>
            
            <Tooltip title="Connect with US" >
              <Link
                to="/help"
                style={{
                  textDecoration: "none",
                  color: "black",
                  fontWeight: "bold",
                  fontSize: "16px",
                  marginLeft: "15px",
                  cursor: 'pointer'
                }}
              >
                Need Help?
              </Link>
            </Tooltip>
          </>

          <Tooltip title="Logout"  >
            <LogoutIcon
              //onClick={handleLogout}
              style={{
                marginTop: "18px",
                marginRight: "20px",
                marginLeft: "40px",
                cursor: "pointer",
                color: "#000000",
              }}
              fontSize="large"
            />
          </Tooltip>
        </div>
      </AppBar>
    </Box>
  );
};
