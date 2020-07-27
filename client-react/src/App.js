import React from 'react';
import Container from 'react-bootstrap/Container';
import Jumbotron from 'react-bootstrap/Jumbotron';
import ListGroup from 'react-bootstrap/ListGroup';
import Card from 'react-bootstrap/Card';
import * as moment from 'moment';

import { Empty } from './protobuf/oia/model_pb';
import { AlarmLifecycleListenerClient } from "./protobuf/oia/alarms_grpc_web_pb";

const client = new AlarmLifecycleListenerClient('http://localhost:8000')

function App() {
  const [alarms, setAlarms] = React.useState([]);

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
  
  React.useEffect(() => {
    getAlarm();
  }, [getAlarm]);

  const alarmList = alarms.map(a => {
    const m = moment(a.lastEventTime * 1000);
    return (<ListGroup.Item key={a.id}>
      <Card>
        <Card.Header>At {m.format()}, received {m.fromNow()}</Card.Header>
        <Card.Body>
          <Card.Title>{a.lastEvent.uei} (ID: {a.id})</Card.Title>
          <Card.Subtitle className="mb-2 text-muted">from node {a.node.label}</Card.Subtitle>
          <Card.Text>
            {a.logMessage}
          </Card.Text>
          <Card.Link href="#">Details</Card.Link>
        </Card.Body>
      </Card>
    </ListGroup.Item>)
  });

  return (
    <Container>
      <Jumbotron>
        <h1>OpenNMS Alarm Feeder</h1>
      </Jumbotron>
      <ListGroup variant="flush">{ alarmList }</ListGroup>
    </Container>
  );
}

export default App;
