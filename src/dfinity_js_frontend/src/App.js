import React, { useEffect, useCallback, useState } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import DisasterReports from "./components/marketplace/DisasterReports";
import DisasterReportDetails from "./components/marketplace/DisasterReportDetails";
import "./App.css";
import Wallet from "./components/Wallet";
import coverImg from "./assets/img/dis.jpg";
import { login, logout as destroy } from "./utils/auth";
import { balance as principalBalance } from "./utils/ledger";
import Cover from "./components/utils/Cover";
import { Notification } from "./components/utils/Notifications";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

const App = function AppWrapper() {
  const isAuthenticated = window.auth.isAuthenticated;
  const principal = window.auth.principalText;

  const [balance, setBalance] = useState("0");

  const getBalance = useCallback(async () => {
    if (isAuthenticated) {
      setBalance(await principalBalance());
    }
  });

  useEffect(() => {
    getBalance();
  }, [getBalance]);

  return (
    <>
      <Notification />
      {isAuthenticated ? (
        <>
          <Navbar bg="dark" variant="dark" expand="lg">
            <Container>
              <Navbar.Brand href="#">DisasterGuard</Navbar.Brand>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="ms-auto">
                  <Nav.Item>
                    <Wallet
                      principal={principal}
                      balance={balance}
                      symbol={"ICP"}
                      isAuthenticated={isAuthenticated}
                      destroy={destroy}
                    />
                  </Nav.Item>
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>

          <Container>
            <Router>
              <Routes>
                <Route path="/" element={<DisasterReports />} />
                <Route
                  path="/disaster_report/:disasterId"
                  element={<DisasterReportDetails />}
                />
              </Routes>
            </Router>
          </Container>
        </>
      ) : (
        <Cover name="GymFusion" login={login} coverImg={coverImg} />
      )}
    </>
  );
};

export default App;
