import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import { Box, Button, Tooltip, Typography } from "@mui/material";
//import logo from "../../illustrations/logo.png";
import { Link } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
import HomeIcon from "@mui/icons-material/Home";
import EmailIcon from "@mui/icons-material/Email";
import dataAxleLogo from "../../Resources/dataaxlelogo.png";

export const MuiNavbar = () => {
  //   const handleLogout = () => {
  //     localStorage.removeItem("email");
  //     window.location.reload();
  //   };
  const isDashboardRoute = window.location.pathname == "/";

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: "#C5C5C5", //#8b9dc3
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          borderBottom: 1,
          borderColor: "#C5C5C5",
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
            <Tooltip title="Add Business Unit" cursor="pointer">
              <Link
                to="/newBusinessUnit"
                style={{
                  textDecoration: "none",
                  color: "black",
                  fontWeight: "bold",
                  fontSize: "16px",
                }}
              >
                Add Business Unit
              </Link>
            </Tooltip>

            <Tooltip title="Add new service" cursor="pointer">
              <Link
                to="/newSubBusinessUnit"
                style={{
                  textDecoration: "none",
                  color: "black",
                  fontWeight: "bold",
                  fontSize: "16px",
                  marginLeft: "15px",
                }}
              >
                Add Sub-Business Unit
              </Link>
            </Tooltip>
            <Tooltip title="Monitor a new service" cursor="pointer">
              <Link
                to="/newService"
                style={{
                  textDecoration: "none",
                  color: "black",
                  fontWeight: "bold",
                  fontSize: "16px",
                  marginLeft: "15px",
                }}
              >
                Monitoring
              </Link>
            </Tooltip>
            <Tooltip title="View the Detailed Dashboard Here" cursor="pointer">
              <Link
                to="/"
                style={{
                  textDecoration: "none",
                  color: "black",
                  fontWeight: "bold",
                  fontSize: "16px",
                  marginLeft: "15px",
                }}
              >
                Dashboard
              </Link>
            </Tooltip>
            
            <Tooltip title="Connect with US" cursor="pointer">
              <Link
                to="/"
                style={{
                  textDecoration: "none",
                  color: "black",
                  fontWeight: "bold",
                  fontSize: "16px",
                  marginLeft: "15px",
                }}
              >
                Need Help?
              </Link>
            </Tooltip>
          </>

          <Link to="/login" style={{ textDecoration: "none" }}>
            <Button
              size="medium"
              sx={{
                borderRadius: "15px",
                color: "#ffffff",
                padding: "5px",
                backgroundColor: "black",
                fontFamily: "Lato",
                marginLeft: "20px",
                marginRight: "20px",
                marginBottom: "5px",
                "&:hover": {
                  backgroundColor: "#555444",
                },
              }}
            >
              Sign Out
            </Button>
          </Link>

          <Tooltip title="Logout" cursor="pointer">
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
