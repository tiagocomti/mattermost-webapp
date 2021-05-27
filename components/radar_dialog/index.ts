export {default} from './radar_dialog';
const mapDispatchToProps = dispatch => ({
    sendMessage: messaga => {
        dispatch(sendMessage(message));
        dispatch(navigateTo({ routeName: 'messagesList' }));
    },
});

export default connect(null, mapDispatchToProps)(MessageSending);
