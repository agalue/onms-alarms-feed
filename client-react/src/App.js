import React from 'react';

import './App.css';
import { Empty } from './protobuf/oia/model_pb';
import { AlarmLifecycleListenerClient } from "./protobuf/oia/alarms_grpc_web_pb";

const client = new AlarmLifecycleListenerClient('http://localhost:8000')

function App() {
  const [alarms, setAlarms] = React.useState([]);

  const getAlarm = React.useCallback(() => {
    const stream = client.handleNewOrUpdatedAlarm(new Empty(), {});
    stream.on('data', alarm => {
      console.log(alarm);
      const a = {
        id: alarm.getId(),
        reductionKey: alarm.getReductionKey(),
      };
      console.log(a);
      setAlarms(prevAlarms => ([...prevAlarms, a]));
    });
    stream.on('error', (err) => {
      console.log(`Unexpected stream error: code = ${err.code}, message = ${err.message}`);
    });
  }, []);
  
  React.useEffect(() => {
    getAlarm();
  }, [getAlarm]);

  return (
    <div className="App">
      <h1>OpenNMS Alarm Feeder</h1>
      <ul>
        { alarms.map(a => <li key={a.id}>Reduction Key = {a.reductionKey}, ID = {a.id}</li>)}
      </ul>
    </div>
  );
}

export default App;
