import React from 'react';

import * as moment from 'moment';

import './App.css';
import { Empty } from './protobuf/oia/model_pb';
import { AlarmLifecycleListenerClient } from "./protobuf/oia/alarms_grpc_web_pb";

const client = new AlarmLifecycleListenerClient('http://localhost:8000')

function App() {
  const [alarms, setAlarms] = React.useState([]);

  const getAlarm = React.useCallback(() => {
    const stream = client.handleNewOrUpdatedAlarm(new Empty(), {});
    stream.on('data', alarm => {
      setAlarms(prevAlarms => ([alarm.toObject(), ...prevAlarms]));
    });
    stream.on('error', (err) => {
      console.log(`Unexpected stream error: code = ${err.code}, message = ${err.message}`);
    });
  }, []);
  
  React.useEffect(() => {
    getAlarm();
  }, [getAlarm]);

  const alarmList = alarms.map(a => (
    <li key={a.id}>
      <p>ID {a.id}, UEI = {a.lastEvent.uei}, Severity = {a.severity}</p>
      <p>received {moment(a.lastEventTime * 1000).fromNow()}</p>
    </li>
  ));

  return (
    <div className="App">
      <h1>OpenNMS Alarm Feeder</h1>
      <ul>{ alarmList }</ul>
    </div>
  );
}

export default App;
