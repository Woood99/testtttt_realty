import cn from 'classnames';
import { EmptyTextBlock } from '../../components/EmptyBlock';

const WalletHistory = ({ className }) => {
   return (
      <div className={cn(className)}>
         <h2 className="title-2 mb-6">История операций</h2>
         <EmptyTextBlock block={false} imageVisible={false}>
            <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="120" height="90">
               <defs>
                  <path d="M0 2h16l-.545 2.18a7.685 7.685 0 0 1-14.91 0L0 2Z" id="a" />
               </defs>
               <g fill="none" fillRule="evenodd">
                  <rect stroke="#242629" strokeWidth="2" fill="#F2F4F6" x="19" y="20" width="82" height="58" rx="4" />
                  <path
                     d="M58.916 73.916 27.908 29.464 67.916 6.366A4 4 0 0 1 73.38 7.83l23 39.837a4 4 0 0 1-1.464 5.464l-36 20.785Z"
                     stroke="#242629"
                     strokeWidth="2"
                     fill="#53B374"
                  />
                  <path
                     d="M19 26v54.556A3.444 3.444 0 0 0 22.444 84h75.112A3.444 3.444 0 0 0 101 80.556V29.444A3.444 3.444 0 0 0 97.556 26H19Z"
                     stroke="#242629"
                     strokeWidth="2"
                     fill="#F2F4F6"
                  />
                  <g transform="translate(41 40)">
                     <path d="M4.5 11C6.985 11 9 8.186 9 4.714 9 1.243 6.985 0 4.5 0S0 1.243 0 4.714C0 8.186 2.015 11 4.5 11Z" fill="#242629" />
                     <ellipse fill="#FFF" cx="2.7" cy="2.75" rx="2.7" ry="2.75" />
                  </g>
                  <g transform="translate(70 40)">
                     <path d="M4.5 11C6.985 11 9 8.186 9 4.714 9 1.243 6.985 0 4.5 0S0 1.243 0 4.714C0 8.186 2.015 11 4.5 11Z" fill="#242629" />
                     <ellipse fill="#FFF" cx="2.7" cy="2.75" rx="2.7" ry="2.75" />
                  </g>
                  <g transform="translate(52 59)" fillRule="nonzero">
                     <use fill="#FF6A59" xlinkHref="#a" />
                     <rect fill="#242629" width="16" height="4" rx="2" />
                  </g>
                  <path d="M91 49a8 8 0 1 0 0 16h13a1 1 0 0 0 1-1V50a1 1 0 0 0-1-1H91Z" stroke="#242629" strokeWidth="2" fill="#FFF" />
                  <circle fill="#242629" cx="90" cy="57" r="2" />
               </g>
            </svg>
            <h3 className="title-3 mt-4 mb-12">Операций пока нет</h3>
         </EmptyTextBlock>
      </div>
   );
};

export default WalletHistory;
