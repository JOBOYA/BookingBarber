import React, { useEffect, useState } from 'react';
import {
  GridComponent,
  ColumnsDirective,
  ColumnDirective,
  Page,
  Selection,
  Inject,
  Edit,
  Toolbar,
  Sort,
  Filter,
} from '@syncfusion/ej2-react-grids';
import axios from 'axios';
import { Header } from '../components';

const Customers = () => {
  const [customersData, setCustomersData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const selectionSettings = {
    type: 'Multiple',
    mode: 'Row',
    checkboxOnly: true,
    persistSelection: true,
  };
  const toolbarOptions = ['Add', 'Delete', 'Search'];
  const editingSettings = {
    allowDeleting: true,
    allowEditing: true,
    allowAdding: true,
    newRowPosition: 'Top',
  };

  const formatData = (data) => ({
    id: data.id,
    nom: data.nom,
    prenom: data.prenom,
    telephone: data.telephone,
    email: data.email,
    fidelite: data.fidelite,
  });

  const actionComplete = (args) => {
    if (args.requestType === 'save' && args.action === 'edit') {
      setIsLoading(true);
      axios
        .put(`https://formen.onrender.com/customer/${args.data.id}`, formatData(args.data))
        .then((response) => {
          setCustomersData((prevCustomersData) => prevCustomersData.map((item) => (item.id === response.data.id ? response.data : item)));
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.log(error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }

    if (args.requestType === 'delete') {
      setIsLoading(true);
      axios
        .delete(`https://formen.onrender.com/customer/${args.data[0].id}`)
        .then(() => {
          const updatedData = customersData.filter((item) => item.id !== args.data[0].id);
          setCustomersData(updatedData);
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.log(error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  const actionBegin = (args) => {
    const newArgs = { ...args };
    if (newArgs.requestType === 'save' && newArgs.action === 'add') {
      newArgs.cancel = true;
      setIsLoading(true);
      axios
        .post('https://formen.onrender.com/customer', formatData(args.data))
        .then((response) => {
          setCustomersData((prevCustomersData) => [...prevCustomersData, response.data]);
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.log(error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  useEffect(() => {
    setIsLoading(true);
    axios
      .get('https://formen.onrender.com/customer')
      .then((response) => {
        setCustomersData(response.data);
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.log(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <Header category="Page" title="clients" />
      {isLoading ? (
        <div>Chargement...</div>
      ) : (
        <GridComponent
          dataSource={customersData}
          enableHover={false}
          allowPaging
          pageSettings={{ pageCount: 5 }}
          selectionSettings={selectionSettings}
          toolbar={toolbarOptions}
          editSettings={editingSettings}
          allowSorting
          allowFiltering
          actionComplete={actionComplete}
          actionBegin={actionBegin}
        >
          <ColumnsDirective>
            <ColumnDirective type="checkbox" width="50" allowEditing={false} />
            <ColumnDirective field="id" headerText="ID" width="100" isPrimaryKey />
            <ColumnDirective field="nom" headerText="Nom" width="100" />
            <ColumnDirective field="prenom" headerText="Prénom" width="100" />
            <ColumnDirective field="telephone" headerText="Téléphone" width="100" />
            <ColumnDirective field="email" headerText="Email" width="100" />
            <ColumnDirective field="fidelite" headerText="Fidelité" width="100" />
          </ColumnsDirective>
          <Inject services={[Page, Selection, Edit, Toolbar, Sort, Filter]} />
        </GridComponent>
      )}
    </div>
  );
};

export default Customers;
