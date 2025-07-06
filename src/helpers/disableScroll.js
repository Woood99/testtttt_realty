const disableScroll = () => {
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = window.innerWidth > 1212 ? '16px' : '0';
};

export default disableScroll;
