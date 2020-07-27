import React from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import ListGroup from 'react-bootstrap/ListGroup';
import Modal from 'react-bootstrap/Modal';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import * as moment from 'moment';

import { Empty } from './protobuf/oia/model_pb';
import { AlarmLifecycleListenerClient } from "./protobuf/oia/alarms_grpc_web_pb";

const client = new AlarmLifecycleListenerClient('http://localhost:8000')

const severityColors = [
  '#ffffff', // Not used
  '#ebebcd', // 1: Indeterminate
  '#eeeeee', // 2: Cleared
  '#d7e1cd', // 3: Normal
  '#fff5cd', // 4: Warning
  '#ffebcd', // 5: Minor
  '#ffd7cd', // 6: Major
  '#f5cdcd', // 7: Critical
];

function App() {
  const [alarms, setAlarms] = React.useState([]);
  const [showDetail, setShowDetail] = React.useState(false)
  const [selectedAlarm, setSelectedAlarm] = React.useState({})

  const getAlarm = React.useCallback(() => {
    const stream = client.handleNewOrUpdatedAlarm(new Empty(), {});
    stream.on('data', alarm => {
      const a = alarm.toObject();
      console.log(a);
      setAlarms(prevAlarms => ([a, ...prevAlarms]));
    });
    stream.on('error', (err) => {
      console.log(`Unexpected stream error: code = ${err.code}, message = ${err.message}`);
    });
  }, []);

  const handleViewAlarm = alarm => {
    setSelectedAlarm(alarm);
    setShowDetail(true);
  };

  const handleClose = () => {
    setShowDetail(false);
  };

  React.useEffect(() => {
    getAlarm();
  }, [getAlarm]);

  const alarmList = alarms.map(a => {
    const m = moment(a.lastEventTime * 1000);
    const style = { backgroundColor: severityColors[a.severity] };
    return (
    <ListGroup.Item key={a.id}>
      <Card>
        <Card.Header style={style}>At {m.format()}, received {m.fromNow()}</Card.Header>
        <Card.Body>
          <Card.Title>{a.lastEvent.uei} (ID: {a.id})</Card.Title>
          <Card.Subtitle className="mb-2 text-muted">from node {a.node.label}</Card.Subtitle>
          <Card.Text>
            {a.logMessage}
          </Card.Text>
          <Card.Link href="#" onClick={() => handleViewAlarm(a)}>Details</Card.Link>
        </Card.Body>
      </Card>
    </ListGroup.Item>
    )
  });

  return (
    <Container fluid>
      <Navbar bg="dark" variant="dark">
        <Navbar.Brand>OpenNMS Alarm Feeder</Navbar.Brand>
      </Navbar>
      <Modal show={showDetail} onHide={handleClose}>
        <Modal.Header closeButton style={{backgroundColor: severityColors[selectedAlarm.severity]}}>
          <Modal.Title>Alarm Detail (ID={selectedAlarm.id})</Modal.Title>
        </Modal.Header>
        <Modal.Body>{selectedAlarm.description}</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <ListGroup variant="flush">{ alarmList }</ListGroup>
    </Container>
  );
}

export default App;
