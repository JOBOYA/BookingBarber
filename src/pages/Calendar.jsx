import React, { useState, useEffect } from 'react';
import { ScheduleComponent, ViewsDirective, ViewDirective, Day, Week, WorkWeek, Month, Agenda, Inject, Resize, DragAndDrop } from '@syncfusion/ej2-react-schedule';
import { DatePickerComponent } from '@syncfusion/ej2-react-calendars';
import axios from 'axios';
import { scheduleData } from '../data/dummy';
import { Header } from '../components';

const Scheduler = () => {
  const [scheduleObj, setScheduleObj] = useState(null);
  const [data, setData] = useState(scheduleData); // Set initial data

  useEffect(() => {
    axios.get('http://localhost:3000/schedule')
      .then((response) => {
        // Map server data to the structure expected by the Schedule component
        const serverData = response.data.map(item => ({
          Id: item.id,
          Subject: item.subject,
          StartTime: new Date(item.startTime),
          EndTime: new Date(item.endTime),
          IsAllDay: false,
        }));
        setData(serverData);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  

  const change = (args) => {
    if (scheduleObj) {
      scheduleObj.selectedDate = args.value;
      scheduleObj.dataBind();
    }
  };

  const onActionComplete = (args) => {
    const { requestType, addedRecords, changedRecords, deletedRecords } = args;
    
    const formatEvent = (event) => {
      return {
        id: event.Id,
        subject: event.Subject,
        startTime: event.StartTime,
        endTime: event.EndTime
      }
    }
  
    // Si un événement est créé
    if (requestType === 'eventCreated') {
      axios.post('http://localhost:3000/schedule', formatEvent(addedRecords[0]))
        .then((response) => {
          console.log(response.data);
          setData([...data, response.data]); // Mettre à jour l'état local avec les nouvelles données
        })
        .catch((error) => {
          console.log(error);
        });
    }
  
    // Si un événement est modifié
    if (requestType === 'eventChanged') {
      axios.put(`http://localhost:3000/schedule/${changedRecords[0].Id}`, formatEvent(changedRecords[0]))
        .then((response) => {
          console.log(response.data);
          const updatedData = data.map(item => item.Id === response.data.Id ? response.data : item);
          setData(updatedData); // Mettre à jour l'état local avec les nouvelles données
        })
        .catch((error) => {
          console.log(error);
        });
    }
  
    // Si un événement est supprimé
    if (requestType === 'eventRemoved') {
      axios.delete(`http://localhost:3000/schedule/${deletedRecords[0].Id}`)
        .then((response) => {
          console.log(response.data);
          const updatedData = data.filter(item => item.Id !== deletedRecords[0].Id);
          setData(updatedData); // Mettre à jour l'état local avec les nouvelles données
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };
  

  
  
  const onDragStart = (arg) => {
    arg.navigation.enable = true;
  };

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <Header category="App" title="RDV" />
      <ScheduleComponent
        actionComplete={onActionComplete}
        height="650px"
        ref={(schedule) => setScheduleObj(schedule)}
        selectedDate={new Date(2021, 0, 10)}
        eventSettings={{ dataSource: data }} // Use local state data instead of scheduleData
        dragStart={onDragStart}
      >
        <ViewsDirective>
          {['Day', 'Week', 'WorkWeek', 'Month', 'Agenda'].map((item) => <ViewDirective key={item} option={item} />)}
        </ViewsDirective>
        <Inject services={[Day, Week, WorkWeek, Month, Agenda, Resize, DragAndDrop]} />
      </ScheduleComponent>
      <div className="mt-5">
        <table style={{ width: '100%', background: 'white' }}>
          <tbody>
            <tr style={{ height: '50px' }}>
              <td style={{ width: '100%' }}>
                <DatePickerComponent
                  value={new Date(2021, 0, 10)}
                  showClearButton={false}
                  placeholder="Current Date"
                  floatLabelType="Always"
                  change={change}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Scheduler;
