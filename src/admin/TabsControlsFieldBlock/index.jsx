import React, { useEffect, useState } from 'react';
import BtnBlue from '../../ui/BtnBlue';
import TabsControls from '../../ui/Tabs/TabsControls';
import { useSearchParams } from 'react-router-dom';
import { useQueryParams } from '../../hooks/useQueryParams';

const TabsControlsFieldBlock = ({
   title,
   data,
   setData,
   structureTabs,
   emptyField,
   onChangeParams = {},
   onSubmit = () => {},
   additionalTab = null,
}) => {
   const [activeTab, setActiveTab] = useState(0);
   const [dataTabs, setDataTabs] = useState([]);

   const [_, setSearchParams] = useSearchParams();
   const params = useQueryParams();

   const [editModeIndex, setEditModeIndex] = useState(null);

   useEffect(() => {
      setDataTabs(data.map(item => structureTabs(item)));
   }, [data]);

   useEffect(() => {
      if (!onChangeParams.name) return;
      setSearchParams({ attribute: activeTab + 1 });
   }, [activeTab]);

   useEffect(() => {
      if (!params.attribute || !onChangeParams.name) {
         return;
      }
      setActiveTab(+params[onChangeParams.name] - 1);
   }, []);

   useEffect(() => {
      if (editModeIndex === false) {
         onSubmit(
            data.map(item => {
               if (!item.name) {
                  return {
                     ...item,
                     name: 'Без названия',
                  };
               }
               return item;
            })
         );
      }
   }, [editModeIndex]);

   const editNameHandler = (id, value) => {
      const newFields = data.map(item => {
         if (item.id === id) {
            return { ...item, name: value };
         }
         return item;
      });
      setData(newFields);
   };

   const deleteFieldHandler = id => {
      const newData = data
         .filter(item => item.id !== id)
         .map((item, index) => {
            return { ...item, id: index + 1 };
         });

      setData(newData);
      if (data.length === id) {
         setTimeout(() => setActiveTab(0), 0);
      }

      onSubmit(
         newData.map(item => {
            if (!item.name) {
               return {
                  ...item,
                  name: 'Без названия',
               };
            }
            return item;
         })
      );
   };

   const addNewField = () => {
      const newData = [...data, { ...emptyField, id: data.length + 1 }];
      setData(newData);
      setActiveTab(data.length);
      onSubmit(
         newData.map(item => {
            if (!item.name) {
               return {
                  ...item,
                  name: 'Без названия',
               };
            }
            return item;
         })
      );
      setEditModeIndex(data.length + 1);
   };

   return (
      <>
         <div className="flex justify-between mb-4">
            <h3 className="title-2">{title}</h3>
            <BtnBlue onClick={addNewField}>Добавить новое поле</BtnBlue>
         </div>
         <TabsControls
            data={dataTabs}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            editNameHandler={editNameHandler}
            deleteFieldHandler={deleteFieldHandler}
            editModeIndex={editModeIndex}
            setEditModeIndex={setEditModeIndex}
            additionalTab={additionalTab}
         />
      </>
   );
};

export default TabsControlsFieldBlock;
