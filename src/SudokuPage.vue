<template>
    <div id="sudoku-main">
        <div id="status-bar">
            <span>
                Status:
            </span>
            <span id="connection-status" :class="connectionClass">
            </span>
            <span>
                Connections:
            </span>
            <span v-for="ip in connections" :key="ip">
                {{ ip }}
            </span>
        </div>
        <div id="content" class="pure-g">
            <div class="pure-u-1 pure-u-xl-2-3">
                <sudoku :socket="socket" ref="sudoku"></sudoku>
            </div>
            <div class="pure-u-1 pure-u-xl-1-3">
                <chat :socket="socket" ref="chat"></chat>
            </div>
        </div>
    </div>
</template>

<script>
import Sudoku from './Sudoku.vue';
import Chat from './Chat.vue';
import 'purecss/build/pure-min.css';
import 'purecss/build/grids-responsive-min.css';

export default {
    data() {
        return {
            socket: null,
            connectionClass: 'connection-bad',
            connections: [],
        }
    },
    methods: {
        getConnectionClass() {
            if (this.socket.readyState == 1) {
                return 'connection-good';
            } else {
                return 'connection-none';
            }
        },
        startSocket() {
            this.socket = new WebSocket(`ws://${window.location.host}/socket`);
            this.$refs.sudoku.startSocket(this.socket);
            this.$refs.chat.startSocket(this.socket);

            this.socket.addEventListener('message', (event) => {
                var message = JSON.parse(event.data);
                if (message.type === 'ips') {
                    this.connections = message.ips;
                }
            });
        }
    },
    components: {
        'sudoku': Sudoku,
        'chat': Chat,
    },
    mounted() {
        this.startSocket();
        setInterval(() => {
            this.connectionClass = this.getConnectionClass();
        }, 100);
        setInterval(() => {
            this.connectionClass = this.getConnectionClass();
            if (this.socket.readyState == 3) {
                this.startSocket();
            }
        }, 1000);
    }
};
</script>

<style>
#connection-status {
    border-radius: 50%;
    width: 1em;
    height: 1em;
}

#status-bar span {
    margin-left: 0.5em;
}

.connection-good {
    background-color: green;
}

.connection-bad {
    background-color: #F0E020;
}

.connection-none {
    background-color: red;
}

#status-bar {
    width: 100%;
    height: 2em;
    display: flex;
    flex-direction: row;
    align-items: center;
}

#sudoku-main {
    display: flex;
    flex-direction: column;
}
</style>
