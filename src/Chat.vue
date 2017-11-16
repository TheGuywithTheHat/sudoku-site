<template>
    <div id="chat">
        <input class="chat-form" type="text" v-model="name" placeholder="Name" />
        <div id="messages">
            <p v-for="(message, index) in messages" :key="index" :title="message.origin">
                {{ message.name }}: {{ message.text }}
            </p>
        </div>
        <input class="chat-form" type="text" v-model="text" placeholder="Message" @keyup.enter="sendMessage"/>
    </div>
</template>

<script>
export default {
    props: ['socket'],
    data() {
        return {
            name: '',
            text: '',
            messages: [],
        }
    },
    methods: {
        startSocket(socket) {
            this.socket = socket;
            this.socket.addEventListener('message', (event) => {
                var message = JSON.parse(event.data);
                if (message.type == 'chat-message') {
                    this.messages.push({ name: message.name, text: message.text, origin: message.origin });
                }
            });
        },
        sendMessage() {
            if (this.name === '' || this.text === '') {
                alert('bruh');
                return;
            }
            this.socket.send(JSON.stringify({
                broadcast: true,
                text: this.text,
                name: this.name,
                type: 'chat-message',
            }));
            this.text = '';
        },
    }
};
</script>

<style>
#chat {
    display: flex;
    flex-direction: column;
    height: 100%;
}

#messages {
    flex-grow: 1;
    overflow: auto;
}
</style>
