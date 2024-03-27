const socket = io();

      const roomButton = document.querySelector('#joinRoom');
      roomButton.addEventListener('click', ()=> {
        let roomName = document.querySelector('#roomInput').value;
        console.log(`Called join room named ${roomName}`);
        socket.emit('joinRoom', roomName )

        document.querySelector('#userWelcome').innerHTML += `<h3>Joined room: ${roomName}! </h3>`;
        document.querySelector('#messageRoomBtn').classList.remove('d-none');
        document.querySelector('#roomInput').classList.add('d-none');
        document.querySelector('#joinRoom').classList.add('d-none');
      })

      document.querySelector('#roomForm').addEventListener('submit', () => {
        event.preventDefault();
        const input = document.getElementById('messageInput');
        socket.emit('roomMessage', {user: socket.user, message: input.value});
        input.value = '';
      });

      socket.on('roomMessaged', data => {
        console.log('Put room message to screen');
        const myDiv = document.querySelector('#myDiv');
        myDiv.innerHTML += `<p>${data.room} ~ ${data.user}: ${data.message}</p>`
      });


      document.querySelector('#userNameForm').addEventListener('submit', () => {
        event.preventDefault();
        const name = document.getElementById('userName').value
        document.querySelector('#chat').classList.remove("d-none");
        document.querySelector('#setUserName').classList.add("d-none");
        document.querySelector('#userWelcome').innerHTML += `<h1>WELCOME ${name}! </h1>`;
        document.querySelector('#myDiv').classList.remove('d-none');
        socket.user = name;
      });

      socket.on('setUserName', data => {
        const input = document.getElementById('messageInput');
        const message = input.value.trim();

        if (message !== '') {
          socket.emit('chat message', { user: socket.user, message });
          input.value = '';
        }
      });

      const mybtn = document.querySelector('#myButton');
      mybtn.addEventListener('click', () => {
        socket.emit('yo', 'SEAN')
      });

      socket.on('YAAAAAAAYYYYYYYY', data => {
        const da = document.querySelector('#myDiv');
        da.innerHTML += `<p>${data}</p>`;
      });

      // Handle incoming chat messages
      socket.on('chat message', (data) => {
        const messages = document.getElementById('messages');
        const li = document.createElement('li');
        li.textContent = `${data.user}: ${data.message}`;
        messages.appendChild(li);
      });

      // Handle form submission
      document.getElementById('messageForm').addEventListener('submit', (e) => {
        e.preventDefault();
        //const recipentname = document.getElementById('recipentName');
        //const recipentName = recipentname.value.trim();
        socket.emit('userEnteredName')
      });
