import { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';

import { usePopper } from 'react-popper';

import stylesTooltip from './Tooltip.module.scss';
import { IconClose } from '../Icons';
import { useSelector } from 'react-redux';
import { getIsDesktop, getWindowSize } from '../../redux/helpers/selectors';
import ModalWrapper from '../Modal/ModalWrapper';
import Modal from '../Modal';

const getCoords = (tooltipRef, targetRef, position, gap) => {
   const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
   const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

   const tooltip = tooltipRef.current.getBoundingClientRect();
   const target = targetRef.current.getBoundingClientRect();
   let top = 0;
   let left = 0;

   switch (position) {
      case 'top':
         top = target.top + scrollTop - tooltip.height - gap;
         left = target.left + (target.width - tooltip.width) / 2;
         break;
      case 'bottom':
         top = target.top + scrollTop + target.height + gap;
         left = target.left + (target.width - tooltip.width) / 2;
         break;
      case 'left':
         top = target.top + scrollTop;
         left = target.left - tooltip.width - gap;
      default:
         break;
   }

   return { top, left };
};

export const Tooltip = ({
   ElementTarget = () => <></>,
   children,
   color = 'dark',
   offset = [0, 5],
   placement = 'bottom',
   close = false,
   classNameTarget = '',
   classNameRoot = '',
   classNameTargetActive = '',
   classNameContent = '',
   event = 'move',
   value = null,
   onChange = null,
   mobile = false,
   mobileDefault = false,
   onClose,
}) => {
   const isDesktop = useSelector(getIsDesktop);
   const [showPopper, setShowPopper] = useState(false);

   if (!mobile && !isDesktop && showPopper) {
      setShowPopper(false);
      return;
   }

   return (
      <TooltipBody
         ElementTarget={ElementTarget}
         children={children}
         color={color}
         offset={offset}
         placement={placement}
         close={close}
         classNameTarget={classNameTarget}
         classNameRoot={classNameRoot}
         classNameTargetActive={classNameTargetActive}
         classNameContent={classNameContent}
         event={isDesktop ? event : 'click'}
         showPopper={value !== null ? value : showPopper}
         setShowPopper={onChange !== null ? onChange : setShowPopper}
         mobile={mobile}
         mobileDefault={mobileDefault}
         onClose={onClose}
      />
   );
};

const TooltipBody = ({
   ElementTarget,
   children,
   color = 'dark',
   offset = [0, 5],
   placement = 'bottom',
   close = false,
   classNameTarget = '',
   classNameRoot = '',
   classNameTargetActive = '',
   classNameContent = '',
   event = 'move',
   showPopper = false,
   setShowPopper = () => {},
   mobile = false,
   mobileDefault = false,
   onClose,
}) => {
   const isDesktop = useSelector(getIsDesktop);
   const [referenceEl, setReferenceEl] = useState(null);
   const [popperEl, setPopperEl] = useState(null);
   const { styles, attributes } = usePopper(referenceEl, popperEl, {
      placement: placement,
      modifiers: [
         {
            name: 'offset',
            options: {
               offset: [0, 0],
            },
         },
      ],
   });

   const handleOpen = () => {
      setShowPopper(true);
   };

   const handleClose = () => {
      setShowPopper(false);
      onClose?.();
   };

   useEffect(() => {
      const close = e => {
         if (!showPopper) return;
         if (popperEl && !popperEl.contains(e.target) && referenceEl && !referenceEl.contains(e.target)) {
            handleClose();
         }
      };
      document.addEventListener('click', close, {
         capture: true,
      });

      return () => {
         document.removeEventListener('click', close, {
            capture: true,
         });
      };
   }, [showPopper, popperEl]);

   return (
      <>
         <div
            ref={setReferenceEl}
            onMouseEnter={event === 'move' ? handleOpen : null}
            onMouseLeave={event === 'move' ? handleClose : null}
            onClick={event === 'click' ? () => setShowPopper(prev => !prev) : null}
            className={`${classNameTarget} ${showPopper ? classNameTargetActive : ''}`}>
            {Boolean(ElementTarget) && <ElementTarget />}
         </div>
         <>
            {Boolean(!isDesktop && mobile) && (
               <ModalWrapper condition={showPopper}>
                  <Modal
                     condition={showPopper}
                     set={setShowPopper}
                     options={{ overlayClassNames: '_full _bottom !z-[99999]', modalContentClassNames: '!px-5' }}>
                     <div className={`${classNameContent}`}>{children}</div>
                  </Modal>
               </ModalWrapper>
            )}
            {showPopper &&
               (isDesktop || mobileDefault) &&
               createPortal(
                  <div
                     className={`z-[9999] ${classNameRoot}`}
                     ref={setPopperEl}
                     style={{
                        ...styles.popper,
                        padding: `${offset[1]}px ${offset[0]}px`,
                     }}
                     {...attributes.popper}
                     onMouseEnter={event === 'move' ? handleOpen : null}
                     onMouseLeave={event === 'move' ? handleClose : null}>
                     <div
                        className={`${stylesTooltip.TooltipRoot} ${
                           color === 'dark' ? stylesTooltip.TooltipRootDark : color === 'white' ? stylesTooltip.TooltipRootWhite : ''
                        } ${classNameContent}`}>
                        {Boolean(close) && (
                           <button className="absolute top-4 right-4" onClick={handleClose}>
                              <IconClose width={20} height={20} className="fill-blue" />
                           </button>
                        )}
                        {children}
                     </div>
                  </div>,
                  document.getElementById('overlay-wrapper')
               )}
         </>
      </>
   );
};

export const Notification = ({ time = 5000, refTarget, children, position = 'top', gap = 5, closeBtn = false }) => {
   const [visible, setVisible] = useState(true);
   const tooltipRef = useRef(null);

   useEffect(() => {
      if (!(visible && tooltipRef.current && refTarget.current)) return;
      const coords = getCoords(tooltipRef, refTarget, position, gap);

      tooltipRef.current.style.top = `${coords.top}px`;
      tooltipRef.current.style.left = `${coords.left}px`;

      const timer = setTimeout(() => {
         if (!tooltipRef.current) return;
         setVisible(false);
      }, time);

      return () => clearTimeout(timer);
   }, []);

   const onHandlerClose = () => {
      setVisible(false);
   };

   useEffect(() => {
      const handleDocumentClick = event => {
         if (!tooltipRef.current) return;

         if (!tooltipRef.current.contains(event.target)) {
            setVisible(false);
         }
      };

      document.addEventListener('click', handleDocumentClick);

      return () => {
         document.removeEventListener('click', handleDocumentClick);
      };
   }, []);

   if (!visible) {
      return null;
   }

   return createPortal(
      <>
         <div ref={tooltipRef} className={stylesTooltip.TooltipText}>
            {closeBtn && (
               <button onClick={onHandlerClose} className="absolute top-4 right-4 pointer-events-auto">
                  <IconClose className="fill-blue" />
               </button>
            )}
            {children}
         </div>
      </>,
      document.getElementById('overlay-wrapper')
   );
};

export const NotificationTimer = ({
   show,
   set,
   onClose,
   classListRoot = '',
   style = {},
   children,
   time = 5000,
   visibleProgressBar = true,
   position = 'top-right',
   color = 'dark',
}) => {
   const currentColor = color === 'dark' ? stylesTooltip.NotificationTimerDark : color === 'white' ? stylesTooltip.NotificationTimerWhite : '';
   const currentPosition = position === 'top-right' ? 'top-6 right-6' : position === 'bottom-right' ? 'bottom-6 right-6' : '';

   useEffect(() => {
      if (show) {
         const timer = setTimeout(() => {
            if (set) {
               set(false);
            } else if (onClose) {
               onClose();
            }
         }, time);
         return () => clearTimeout(timer);
      }
   }, [show]);

   return (
      <div className={`${stylesTooltip.NotificationTimer} ${currentPosition} ${currentColor} ${classListRoot}`} style={style}>
         {children}
         {Boolean(visibleProgressBar) && (
            <div className={stylesTooltip.NotificationTimerProgressBar}>
               <span style={{ animationDuration: `${time / 1000}s` }} />
            </div>
         )}

         <button onClick={onClose} className="absolute top-4 right-4">
            <IconClose className="fill-white" />
         </button>
      </div>
   );
};

export const NotificationEl = ({
   children,
   startValue = false,
   target,
   placement = 'auto-start',
   variant = 'white',
   className = '',
   offset = [0, 5],
   closeBtn = false,
   arrow = true,
   updateEl = [true],
   initMs = 300,
}) => {
   if (!target) return;
   const [popperEl, setPopperEl] = useState(null);
   const [showPopper, setShowPopper] = useState(startValue);
   const [arrowElement, setArrowElement] = useState(null);
   const [isInit, setIsInit] = useState(false);

   useEffect(() => {
      setTimeout(() => {
         setIsInit(true);
      }, initMs);
   }, []);

   const classVariant = () => {
      switch (variant) {
         case 'white':
            return stylesTooltip.TooltipElement;
         case 'dark':
            return `${stylesTooltip.TooltipElement} ${stylesTooltip.TooltipElementDark}`;
         default:
            return '';
      }
   };

   const { styles, attributes, update } = usePopper(target, popperEl, {
      placement,
      modifiers: [
         { name: 'arrow', options: { element: arrowElement } },
         {
            name: 'offset',
            options: {
               offset,
            },
         },
      ],
   });

   useEffect(() => {
      const close = e => {
         if (e.target.closest('[data-popper-placement]')) return;
         setShowPopper(false);
      };
      document.addEventListener('click', close);

      return () => {
         document.removeEventListener('click', close);
      };
   }, []);

   useEffect(() => {
      const close = () => {
         setShowPopper(false);
      };

      document.addEventListener('scroll', close);

      return () => {
         document.removeEventListener('scroll', close);
      };
   }, []);

   useEffect(() => {
      if (update && isInit) {
         update();
      }
   }, [target, update, showPopper, ...updateEl]);

   return (
      <>
         {showPopper && isInit
            ? createPortal(
                 <div ref={setPopperEl} className={`${classVariant()} ${className}`} style={styles.popper} {...attributes.popper}>
                    {closeBtn && (
                       <button onClick={() => setShowPopper(false)} className="absolute top-4 right-4">
                          <IconClose className="fill-white" />
                       </button>
                    )}
                    {arrow && <div ref={setArrowElement} className={stylesTooltip.TooltipElementArrow} style={styles.arrow} />}
                    {children}
                 </div>,
                 document.getElementById('overlay-wrapper')
              )
            : ''}
      </>
   );
};
