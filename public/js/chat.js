const socket = io();


const $messageForm = document.querySelector('#message-form');

const $messageFormInput = $messageForm.querySelector('input');

const $messageFormButton = $messageForm.querySelector('button');

socket.on('message',(msg) => {
    console.log(msg);
})
$messageForm.addEventListener('submit',(e) => {
    e.preventDefault();
    $messageFormButton.setAttribute('disabled','disabled');

    const message = e.target.elements.message.value;

    socket.emit('messageNew', message, () => {
        $messageFormButton.removeAttribute('disabled');
        $messageFormInput.value = '';
    });
})


const $location = document.querySelector('#location');

$location.addEventListener('click',() => {
    $location.setAttribute('disabled','disabled');

    if(!navigator.geolocation){
        alert("Geolocation not supported by your browser");
        $location.removeAttribute('disabled')
    }else{
        navigator.geolocation.getCurrentPosition((position) => {
            socket.emit("send-loc",{
                "latitude": position.coords.latitude,
                "longitude": position.coords.longitude
            },() => {
                $location.removeAttribute('disabled');
                console.log('location shared')
            })
        })
    }
})