import React, { memo } from 'react';

import styles from './Tabs.module.scss';
import TabsControlsTitle from './TabsControlsTitle';

const TabsControls = memo(
   ({
      data,
      activeTab = 0,
      setActiveTab,
      children,
      bodyContent,
      editNameHandler = () => {},
      deleteFieldHandler = () => {},
      editModeIndex,
      setEditModeIndex,
      additionalTab,
   }) => {
      const onClickButton = index => {
         setActiveTab(index);
      };

      return (
         <div>
            <nav className={styles.tabsNavControls}>
               {data.map((item, index) => {
                  return (
                     <div key={index}>
                        <TabsControlsTitle
                           data={item}
                           onClick={e => onClickButton(index)}
                           editNameHandler={editNameHandler}
                           deleteFieldHandler={deleteFieldHandler}
                           activeTab={activeTab === index}
                           editModeIndex={editModeIndex}
                           setEditModeIndex={setEditModeIndex}
                        />
                     </div>
                  );
               })}
               {additionalTab && (
                  <div>
                     <TabsControlsTitle
                        data={additionalTab.structureTab}
                        onClick={e => onClickButton(additionalTab.structureTab.id)}
                        activeTab={activeTab === additionalTab.structureTab.id}
                        controls={false}
                     />
                  </div>
               )}
            </nav>
            <div className={`mt-6`}>
               {data.map((item, index) => {
                  return activeTab === index && <div key={index}>{item.body}</div>;
               })}

               {additionalTab && activeTab === additionalTab.structureTab.id && (
                  <div key={additionalTab.structureTab.id}>{additionalTab.structureTab.body}</div>
               )}
               {bodyContent}
            </div>
            {children}
         </div>
      );
   }
);

export default TabsControls;
