import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';
import Modal from 'react-bootstrap/Modal';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import * as moment from 'moment';

import { Empty, InMemoryEvent } from './protobuf/oia/model_pb';
import { AlarmLifecycleListenerClient } from "./protobuf/oia/alarms_grpc_web_pb";
import { EventForwarderClient } from "./protobuf/oia/events_grpc_web_pb";

const alarmsClient = new AlarmLifecycleListenerClient('http://localhost:8000');
const eventsClient = new EventForwarderClient('http://localhost:8000');

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
  const [showAlarmDetail, setShowAlarmDetail] = React.useState(false)
  const [selectedAlarm, setSelectedAlarm] = React.useState({})

  const loadAlarms = React.useCallback(() => {
    alarmsClient.handleAlarmSnapshot(new Empty(), {}, (err, proto) => {
      if (err) {
        console.log(`handleAlarmSnapshot: Unexpected stream error: code = ${err.code}, message = ${err.message}`);
      } else {
        const alarms = proto.getAlarmsList()
          .map(a => a.toObject())
          .sort((a, b) => a.lastEventTime - b.lastEventTime);
        console.log(`Loaded ${alarms.length} alarms.`);
        setAlarms(alarms);
      }
    });
  }, []);

  const handleNewOrUpdatedAlarm = React.useCallback(() => {
    const newOrUpdateStream = alarmsClient.handleNewOrUpdatedAlarm(new Empty(), {});
    newOrUpdateStream.on('error', err => {
      console.log(`handleNewOrUpdatedAlarm: Unexpected stream error: code = ${err.code}, message = ${err.message}`);
    });
    newOrUpdateStream.on('data', protoAlarm => {
      const alarm = protoAlarm.toObject();
      setAlarms(prevAlarms => {
        const idx = prevAlarms.findIndex(a => a.id === alarm.id)
        if (idx < 0) {
          console.log(`Adding alarm ${alarm.reductionKey} with ID ${alarm.id}`);
          console.log(alarm);
          return [alarm, ...prevAlarms];
        }
        console.log(`Updating alarm ${alarm.reductionKey} with ID ${alarm.id}`);
        console.log(alarm);
        return prevAlarms.map(a => a.id === alarm.id ? alarm : a);
      });
    });
  }, []);

  const handleDeletedAlarm = React.useCallback(() => {
    const deletedStream = alarmsClient.handleDeletedAlarm(new Empty(), {});
    deletedStream.on('error', err => {
      console.log(`handleDeletedAlarm: Unexpected stream error: code = ${err.code}, message = ${err.message}`);
    });
    deletedStream.on('data', protoAlarm => {
      const alarm = protoAlarm.toObject();
      console.log(`Deleting alarm ${alarm.reductionKey} with ID ${alarm.id}`);
      setAlarms(prevAlarms => prevAlarms.filter(a => a.id !== alarm.id));
    });
  }, []);

  const handleOpenAlarmModal = alarm => {
    setSelectedAlarm(alarm);
    setShowAlarmDetail(true);
  };

  const handleCloseAlarmModal = () => {
    setShowAlarmDetail(false);
  };

  const handleSendEvent = () => {
    const e = new InMemoryEvent();
    e.setUei("uei.opennms.org/grpc/reactTest");
    e.setSource("ReactJS");
    e.setSeverity(7);
    eventsClient.sendAsync(e);
  }

  React.useEffect(() => {
    console.log('Initialize handlers.');
    loadAlarms();
    handleNewOrUpdatedAlarm();
    handleDeletedAlarm();
  }, [loadAlarms, handleNewOrUpdatedAlarm, handleDeletedAlarm]);

  const alarmList = alarms.map(a => {
    const m = moment(a.lastEventTime);
    const style = { backgroundColor: severityColors[a.severity] };
    const subTitle = a.node ? <Card.Subtitle className="mb-2 text-muted">from node {a.node.label}</Card.Subtitle> : null;
    return (
    <ListGroup.Item key={a.id}>
      <Card>
        <Card.Header style={style}>At {m.format()}, received {m.fromNow()}</Card.Header>
        <Card.Body>
          <Card.Title>{a.lastEvent.uei} (ID: {a.id}, Severity: {a.severity})</Card.Title>
          {subTitle}
          <Card.Text>
            {a.logMessage}
          </Card.Text>
          <Card.Link href="#" onClick={() => handleOpenAlarmModal(a)}>Details</Card.Link>
        </Card.Body>
      </Card>
    </ListGroup.Item>
    )
  });

  return (
    <Container fluid>
      <Navbar bg="dark" variant="dark">
        <Navbar.Brand>OpenNMS Alarm Feeder</Navbar.Brand>
        <Nav className="ml-auto">
          <Form inline>
            <Button variant="success" onClick={handleSendEvent}>Send Event</Button>
          </Form>
        </Nav>
      </Navbar>
      <Modal show={showAlarmDetail} onHide={handleCloseAlarmModal}>
        <Modal.Header closeButton style={{backgroundColor: severityColors[selectedAlarm.severity]}}>
          <Modal.Title>Alarm Detail (ID={selectedAlarm.id}, Severity={selectedAlarm.severity})</Modal.Title>
        </Modal.Header>
        <Modal.Body>{selectedAlarm.description}</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleCloseAlarmModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <ListGroup variant="flush">{ alarmList }</ListGroup>
    </Container>
  );
}

export default App;
