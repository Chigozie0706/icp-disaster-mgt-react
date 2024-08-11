import React from "react";
import PropTypes from "prop-types";
import { Button, Modal, Form, FloatingLabel } from "react-bootstrap";

const RegisterDisasterReport = ({
  save,
  reporterName,
  setReporterName,
  contact,
  setContact,
  email,
  setEmail,
  disasterType,
  setDisasterType,
  imgUrl,
  setImgUrl,
  latitude,
  setLatitude,
  longitude,
  setLongitude,
  city,
  setCity,
  state,
  setState,
  date,
  setDate,
  severity,
  setSeverity,
  impact,
  setImpact,
  show,
  handleClose,
  handleShow,
  isFormFilled,
}) => {
  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude.toString());
          setLongitude(position.coords.longitude.toString());
        },
        (error) => {
          console.error(error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  return (
    <>
      <Button onClick={handleShow} variant="dark" className="mt-4">
        Report Disaster
      </Button>
      <Modal show={show} onHide={handleClose} centered backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: 12 }}>
            Create Disaster Report
          </Modal.Title>
        </Modal.Header>
        <Form>
          <Modal.Body>
            <h3>Personal Information</h3>
            <FloatingLabel
              controlId="reporterName"
              label="ReporterName"
              className="mb-3"
            >
              <Form.Control
                type="text"
                value={reporterName}
                onChange={(e) => {
                  setReporterName(e.target.value);
                }}
                placeholder="Enter your name"
              />
            </FloatingLabel>
            <FloatingLabel controlId="contact" label="Contact" className="mb-3">
              <Form.Control
                type="text"
                value={contact}
                onChange={(e) => {
                  setContact(e.target.value);
                }}
                placeholder="Enter contact number"
              />
            </FloatingLabel>
            <FloatingLabel controlId="email" label="Email" className="mb-3">
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                placeholder="Enter email address"
              />
            </FloatingLabel>

            <h3>Disaster Information</h3>

            <FloatingLabel
              controlId="disasterType"
              label="Type of Disaster"
              className="mb-3"
            >
              <Form.Select onChange={(e) => setDisasterType(e.target.value)}>
                <option value=""></option>
                <option value="earthquake">Earthquake</option>
                <option value="flood">Flood</option>
                <option value="fire">Fire</option>
                <option value="hurricane">Hurricane</option>
                <option value="tornado">Tornado</option>
              </Form.Select>
            </FloatingLabel>

            <FloatingLabel
              controlId="imgUrl"
              label="Image URL"
              className="mb-3"
            >
              <Form.Control
                type="text"
                value={imgUrl}
                onChange={(e) => {
                  setImgUrl(e.target.value);
                }}
                placeholder="Enter image URL"
              />
            </FloatingLabel>

            <FloatingLabel
              controlId="latitude"
              label="Latitude"
              className="mb-3"
            >
              <Form.Control
                type="text"
                value={latitude}
                onChange={(e) => {
                  setLatitude(e.target.value);
                }}
                placeholder="Enter latitude"
              />
            </FloatingLabel>
            <FloatingLabel
              controlId="longitude"
              label="Longitude"
              className="mb-3"
            >
              <Form.Control
                type="text"
                value={longitude}
                onChange={(e) => {
                  setLongitude(e.target.value);
                }}
                placeholder="Enter longitude"
              />
            </FloatingLabel>

            <Button
              variant="outline-dark"
              onClick={getLocation}
              className="mb-3"
            >
              Get Current Location
            </Button>

            <FloatingLabel controlId="city" label="City" className="mb-3">
              <Form.Control
                type="text"
                value={city}
                onChange={(e) => {
                  setCity(e.target.value);
                }}
                placeholder="Enter city"
              />
            </FloatingLabel>
            <FloatingLabel controlId="state" label="State" className="mb-3">
              <Form.Control
                type="text"
                value={state}
                onChange={(e) => {
                  setState(e.target.value);
                }}
                placeholder="Enter state"
              />
            </FloatingLabel>
            <FloatingLabel controlId="date" label="Date" className="mb-3">
              <Form.Control
                type="date"
                value={date}
                onChange={(e) => {
                  setDate(e.target.value);
                }}
                placeholder="Enter date"
              />
            </FloatingLabel>

            <h3>Severity and Impact</h3>
            <FloatingLabel
              controlId="severity"
              label="Severity Level"
              className="mb-3"
            >
              <Form.Select onChange={(e) => setSeverity(e.target.value)}>
                <option value=""></option>
                <option value="minor">Minor</option>
                <option value="moderate">Moderate</option>
                <option value="severe">Severe</option>
              </Form.Select>
            </FloatingLabel>

            <FloatingLabel controlId="impact" label="Impact" className="mb-3">
              <Form.Control
                as="textarea"
                value={impact}
                onChange={(e) => {
                  setImpact(e.target.value);
                }}
                placeholder="Enter impact details"
              />
            </FloatingLabel>
          </Modal.Body>
        </Form>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={handleClose}>
            Close
          </Button>

          <Button
            variant="dark"
            disabled={!isFormFilled()}
            onClick={() => {
              save({
                reporterName,
                contact,
                email,
                disasterType,
                imgUrl,
                latitude,
                longitude,
                city,
                state,
                date,
                severity,
                impact,
              });
              handleClose();
            }}
          >
            Create Report
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

RegisterDisasterReport.propTypes = {
  save: PropTypes.func.isRequired,
  reporterName: PropTypes.string.isRequired,
  setReporterName: PropTypes.func.isRequired,
  contact: PropTypes.string.isRequired,
  setContact: PropTypes.func.isRequired,
  email: PropTypes.string.isRequired,
  setEmail: PropTypes.func.isRequired,
  disasterType: PropTypes.string.isRequired,
  setDisasterType: PropTypes.func.isRequired,
  imgUrl: PropTypes.string.isRequired,
  setImgUrl: PropTypes.func.isRequired,
  latitude: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  setLatitude: PropTypes.func.isRequired,
  longitude: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  setLongitude: PropTypes.func.isRequired,
  city: PropTypes.string.isRequired,
  setCity: PropTypes.func.isRequired,
  state: PropTypes.string.isRequired,
  setState: PropTypes.func.isRequired,
  date: PropTypes.string.isRequired,
  setDate: PropTypes.func.isRequired,
  severity: PropTypes.string.isRequired,
  setSeverity: PropTypes.func.isRequired,
  impact: PropTypes.string.isRequired,
  setImpact: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleShow: PropTypes.func.isRequired,
  isFormFilled: PropTypes.func.isRequired,
};

export default RegisterDisasterReport;
