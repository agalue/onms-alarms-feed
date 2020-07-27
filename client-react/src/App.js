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

const handleError = err => {
  console.log(`Unexpected stream error: code = ${err.code}, message = ${err.message}`);
}

function App() {
  const [alarms, setAlarms] = React.useState([]);
  const [showDetail, setShowDetail] = React.useState(false)
  const [selectedAlarm, setSelectedAlarm] = React.useState({})

  const loadAlarms = React.useCallback(() => {
    client.handleAlarmSnapshot(new Empty(), {}, (err, proto) => {
      if (err) {
        handleError(err);
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
    const newOrUpdateStream = client.handleNewOrUpdatedAlarm(new Empty(), {});
    newOrUpdateStream.on('error', handleError);
    newOrUpdateStream.on('data', protoAlarm => {
      const alarm = protoAlarm.toObject();
      setAlarms(prevAlarms => {
        if (prevAlarms.find(a => a.id === alarm.id)) {
          console.log(`Updating alarm ${alarm.reductionKey} with ID ${alarm.id}`);
          return prevAlarms.map(a => a.id === alarm.id ? alarm : a);
        }
        console.log(`Adding alarm ${alarm.reductionKey} with ID ${alarm.id}`);
        return [alarm, ...prevAlarms];
      });
    });
  }, []);

  const handleDeletedAlarm = React.useCallback(() => {
    const deletedStream = client.handleDeletedAlarm(new Empty(), {});
    deletedStream.on('error', handleError);
    deletedStream.on('data', protoAlarm => {
      const alarm = protoAlarm.toObject();
      console.log(`Deleting alarm ${alarm.reductionKey} with ID ${alarm.id}`);
      setAlarms(prevAlarms => prevAlarms.filter(a => a.id !== alarm.id));
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
    console.log('Initialize handlers.');
    loadAlarms();
    handleNewOrUpdatedAlarm();
    handleDeletedAlarm();
  }, [loadAlarms, handleNewOrUpdatedAlarm, handleDeletedAlarm]);

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
