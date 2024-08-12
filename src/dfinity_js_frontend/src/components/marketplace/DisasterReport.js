import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";
import { Card, Button, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./DisasterCard.css";

const DisasterReport = ({ report }) => {
  const { city, state, date, imgUrl, disasterId } = report;
  const navigate = useNavigate();

  return (
    <>
      <Col key={disasterId}>
        <Card className="custom-card" style={{ fontSize: 12 }}>
          <Card.Header className="card-header">
            Disaster ID: {disasterId}
          </Card.Header>
          <Card.Img variant="top" src={imgUrl} className="card-image" />
          <Card.Body>
            <Card.Text className="card-text text-capitalize">
              Location: {city}, {state}
            </Card.Text>
            <Card.Footer className="card-footer text-muted">
              Date: {date}
            </Card.Footer>
            <Button
              variant="dark"
              className="view-details-button mt-3"
              onClick={() => navigate(`/disaster_report/${disasterId}`)}
            >
              View Details
            </Button>
          </Card.Body>
        </Card>
      </Col>
    </>
  );
};

DisasterReport.propTypes = {
  report: PropTypes.instanceOf(Object).isRequired,
};

export default DisasterReport;
