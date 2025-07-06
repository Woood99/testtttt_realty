import { getLastOnline } from '../../../../../helpers/changeDate';
import isEmptyArrObj from '../../../../../helpers/isEmptyArrObj';

const LastMessageTimeLayout = ({ data }) => {
   if (!(data.last_message && !isEmptyArrObj(data.last_message))) return;

   return <span className="min-w-max text-dark">{getLastOnline(data.last_message.created_at)}</span>;
};

export default LastMessageTimeLayout;
