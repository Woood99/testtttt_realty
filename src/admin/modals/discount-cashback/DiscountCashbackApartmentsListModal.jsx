import { useEffect, useState } from 'react';
import Modal from '../../../ui/Modal';
import ModalHeader from '../../../ui/Modal/ModalHeader';
import { sendPostRequest } from '../../../api/requestsApi';
import { IconEdit, IconTrash } from '../../../ui/Icons';

import stylesDragDropItems from '../../../components/DragDrop/DragDropItems.module.scss';
import Button from '../../../uiForm/Button';
import ModalWrapper from '../../../ui/Modal/ModalWrapper';
import DiscountCashbackApartmentsFormModal from './DiscountCashbackApartmentsFormModal';
import numberReplace from '../../../helpers/numberReplace';
import dayjs from 'dayjs';

const DiscountCashbackApartmentsListModal = ({ condition, set, options = {} }) => {
   const [data, setData] = useState([]);

   const [isOpenModalCreate, setIsOpenModalCreate] = useState(false);
   const [isOpenModalEdit, setIsOpenModalEdit] = useState(false);
   const [isLoadingData, setIsLoadingData] = useState(true);

   const fetchDataList = async () => {
      setIsLoadingData(true);
      const url = options.type === 'discount' ? '/admin-api/building-discount/all' : '/admin-api/building-cashback/all';
      const {
         data: { result },
      } = await sendPostRequest(url, { building_id: options.id });
      setData(result.map(item => ({ ...item, item_type: options.type })));

      setIsLoadingData(false);
   };

   useEffect(() => {
      if (!condition) return;
      fetchDataList();
   }, [condition]);

   const deleteItem = async id => {
      const url = options.type === 'discount' ? '/admin-api/building-discount/delete' : '/admin-api/building-cashback/delete';
      if (options.type === 'discount') {
         await sendPostRequest(url, {
            discount_id: id,
            building_id: options.id,
         });
      }
      if (options.type === 'cashback') {
         await sendPostRequest(url, {
            cashback_id: id,
            building_id: options.id,
         });
      }
      fetchDataList();
   };

   return (
      <>
         <ModalWrapper condition={condition}>
            <Modal
               condition={Boolean(condition)}
               set={set}
               options={{ modalClassNames: 'HeaderSticky', modalContentClassNames: 'flex flex-col !py-0 !px-10 md1:!px-4' }}
               style={{
                  '--modal-space': '40px',
                  '--modal-height': 'calc(var(--vh) - 80px)',
                  '--modal-width': '1100px',
               }}
               closeBtn={false}
               ModalHeader={() => (
                  <ModalHeader set={set} className="px-10 py-6 mb-8">
                     <h2 className="title-2">{options.type === 'discount' ? 'Скидки на квартиры' : 'Кешбэк на квартиры'}</h2>
                  </ModalHeader>
               )}
               ModalFooter={() => (
                  <>
                     {!isLoadingData && (
                        <div className="px-14 py-6 grid grid-cols-[1fr_max-content] gap-2">
                           <Button onClick={() => setIsOpenModalCreate(true)} className="w-full">
                              Добавить {options.type === 'discount' ? 'скидку' : 'кешбэк'}
                           </Button>
                        </div>
                     )}
                  </>
               )}>
               {isLoadingData && <div className="text-primary400">Загрузка...</div>}
               {!isLoadingData && (
                  <>
                     {data.length === 0 && (
                        <span className="text-primary400">
                           Вы пока не добавили ни {options.type === 'discount' ? 'одной скидки' : 'одного кешбэка'}
                        </span>
                     )}
                     {data.length > 0 && (
                        <div className="grid grid-cols-3 gap-3">
                           {data.map(item => {
                              return (
                                 <article key={item.id} className="rounded-lg bg-primary700 h-[150px] p-6 group relative">
                                    <div className="CardLinkElement" onClick={() => setIsOpenModalEdit(item.id)} />
                                    <div className="flex flex-col gap-4">
                                       <div className="flex flex-col gap-1">
                                          <p>Тип: {item.item_type === 'discount' ? 'Скидка' : 'Кешбэк'}</p>
                                          <p>Количество квартир: {numberReplace(item.apartments?.length || 0)}</p>
                                       </div>
                                       <div className="flex flex-col gap-1">
                                          <p>Начало: {dayjs(item.start_date).format('DD.MM.YYYY')}</p>
                                          <p>Конец: {dayjs(item.end_date).format('DD.MM.YYYY')}</p>
                                       </div>
                                    </div>
                                    <button
                                       type="button"
                                       className={`${stylesDragDropItems.DragDropImageIcon} top-4 right-14 group-hover:opacity-100 group-hover:visible`}
                                       onClick={() => setIsOpenModalEdit(item.id)}>
                                       <IconEdit width={15} height={15} className="stroke-blue" />
                                    </button>
                                    <button
                                       type="button"
                                       className={`${stylesDragDropItems.DragDropImageIcon} top-4 right-4 group-hover:opacity-100 group-hover:visible`}
                                       onClick={() => deleteItem(item.id)}>
                                       <IconTrash width={15} height={15} className="stroke-red" />
                                    </button>
                                 </article>
                              );
                           })}
                        </div>
                     )}
                  </>
               )}
            </Modal>
         </ModalWrapper>
         <ModalWrapper condition={isOpenModalCreate}>
            <DiscountCashbackApartmentsFormModal
               condition={isOpenModalCreate}
               set={setIsOpenModalCreate}
               options={options}
               fetchData={fetchDataList}
            />
         </ModalWrapper>
         <ModalWrapper condition={isOpenModalEdit}>
            <DiscountCashbackApartmentsFormModal
               condition={isOpenModalEdit}
               set={setIsOpenModalEdit}
               options={{ ...options, is_edit: true }}
               fetchData={fetchDataList}
            />
         </ModalWrapper>
      </>
   );
};

export default DiscountCashbackApartmentsListModal;
