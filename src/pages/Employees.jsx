import React, { useEffect, useState } from 'react';
import { GridComponent, ColumnsDirective, ColumnDirective, Page, Selection, Inject, Edit, Toolbar, Sort, Filter } from '@syncfusion/ej2-react-grids';
import { Header } from '../components';
import axios from 'axios';

const Employees = () => {
  const [employeesData, setEmployeesData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const selectionSettings = { type: 'Multiple', mode: 'Row', checkboxOnly: true, persistSelection: true };
  const toolbarOptions = ['Add', 'Delete', 'Search', 'Update', 'Cancel'];
  const editingSettings = { allowDeleting: true, allowEditing: true, allowAdding: true, newRowPosition: 'Top' };

  const formatData = (data) => {
    return {
      id: data.id,
      nom: data.nom,
      prenom: data.prenom,
      telephone: data.telephone,
      email: data.email,
      status: data.status,
    
    }
  }
  

  const actionComplete = (args) => {
    if (args.requestType === 'save' && args.action === 'edit') {
      setIsLoading(true);
      axios.put(`https://formen.onrender.com/employee/${args.data.id}`, formatData(args.data))
        .then((response) => {
          setEmployeesData(prevEmployeesData => prevEmployeesData.map(item => item.id === response.data.id ? response.data : item));
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }

    if (args.requestType === 'delete') {
      setIsLoading(true);
      axios.delete(`https://formen.onrender.com/employee/${args.data[0].id}`)
        .then((response) => {
          const updatedData = employeesData.filter(item => item.id !== args.data[0].id);
          setEmployeesData(updatedData);
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }

  const actionBegin = (args) => {
    if (args.requestType === 'save' && args.action === 'add') {
      args.cancel = true;
      setIsLoading(true);
      axios.post('https://formen.onrender.com/employee', formatData(args.data))
        .then((response) => {
          setEmployeesData(prevEmployeesData => [...prevEmployeesData, response.data]);
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }

  useEffect(() => {
    setIsLoading(true);
    axios.get('https://formen.onrender.com/employee')
      .then((response) => {
        setEmployeesData(response.data);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <Header category="Page" title="Employees" />
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <GridComponent
          dataSource={employeesData}
          enableHover={false}
          allowPaging
          pageSettings={{ pageCount: 5 }}
          selectionSettings={selectionSettings}
          toolbar={toolbarOptions}
          editSettings={editingSettings}
          allowSorting
          allowFiltering={true}
          actionComplete={actionComplete}
          actionBegin={actionBegin}
        >
        <ColumnsDirective>
  <ColumnDirective type="checkbox" width="50" allowEditing={false} />
  <ColumnDirective field="id" headerText="ID" width="100" isPrimaryKey={true} />
  <ColumnDirective field="nom" headerText="Nom" width="100" />
  <ColumnDirective field="prenom" headerText="Prénom" width="100" />
  <ColumnDirective field="telephone" headerText="Téléphone" width="100" />
  <ColumnDirective field="email" headerText="Email" width="100" />
  <ColumnDirective field="status" headerText="Status" width="100" />
  {/* Ajoutez ici tous les autres champs du modèle Employee */}
</ColumnsDirective>


          <Inject services={[Page, Selection, Edit, Toolbar, Sort, Filter]} />
        </GridComponent>
      )}
    </div>
  );
};

export default Employees;