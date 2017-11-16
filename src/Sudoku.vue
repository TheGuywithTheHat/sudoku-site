<template>
    <table id="sudoku-table">
        <tr class="sudoku-row" v-for="(row, y) in cells" :key="row[0].y + 'row'">
            <td class="sudoku-cell" v-for="(cell, x) in row" :key="cell.y * 9 + cell.x + 'cell'">
                <div class="number-list">
                    <div
                    :class="'number number-small ' + (numberToggle ? 'number-on' : 'number-off')"
                    v-for="(numberToggle, index) in cell.numbers"
                    :key="cell.y * 9 + cell.x + index + 'number'"
                    @click="toggle(x, y, index)">
                        {{ index + 1 }}
                    </div>
                </div>
                <div :class="'number number-large ' + (cell.selected ? 'selected' : '')" @keyup="keypress" @click="select(x, y)">
                    {{ cell.number }}
                </div>
            </td>
        </tr>
    </table>
</template>

<script>
export default {
    props: ['socket'],
    data() {
        return {
            cells: [],
            selected: { x: null, y: null },
        };
    },
    methods: {
        sendUpdate() {},
        startSocket(socket) {
            this.socket = socket;
            this.socket.addEventListener('message', (event) => {
                var message = JSON.parse(event.data);
                if (message.cells) {
                    for (var y = 0; y < 9; y++) {
                        for (var x = 0; x < 9; x++) {
                            this.cells[y][x].number = message.cells[y][x].number;
                            for (var digit = 0; digit < 9; digit++) {
                                this.$set(this.cells[y][x].numbers, digit, message.cells[y][x].numbers[digit]);
                            }
                        }
                    }
                } else if (message.write) {
                    console.log(message);
                    if (message.type == 'small-number') {
                        this.$set(this.cells[message.y][message.x].numbers, message.digit, message.set);
                    } else if (message.type == 'large-number') {
                        this.cells[message.y][message.x].number = message.set;
                    }
                }
            });
        },
        toggle(x, y, index) {
            this.$set(
                this.cells[y][x].numbers,
                index, !this.cells[y][x].numbers[index]
            );
            this.socket.send(JSON.stringify({
                broadcast: true,
                write: true,
                x,
                y,
                digit: index,
                set: this.cells[y][x].numbers[index],
                type: 'small-number',
            }));
        },
        select(x, y) {
            if (this.selected.x != null && this.selected.y != null) {
                this.cells[this.selected.y][this.selected.x].selected = false;
            }
            if (x != null) {
                this.selected.x = x;
                this.selected.y = y;
                this.cells[y][x].selected = true;
            } else {
                this.selected.x = null;
                this.selected.y = null;
            }
        },
        keypress(event) {
            if (this.selected.x != null && this.selected.y != null) {
                var value;
                if (event.key >= 1 && event.key <= 9) {
                    value = event.key;
                } else {
                    value = null;
                }

                this.cells[this.selected.y][this.selected.x].number = value;
                this.socket.send(JSON.stringify({
                    broadcast: true,
                    write: true,
                    x: this.selected.x,
                    y: this.selected.y,
                    set: value,
                    type: 'large-number',
                }));
            }
            this.select(null);
        }
    },
    created() {
        window.addEventListener('keyup', this.keypress);
        for (var y = 0; y < 9; y++) {
            this.$set(this.cells, y, []);
            for (var x = 0; x < 9; x++) {
                this.$set(this.cells[y], x, {
                    x,
                    y,
                    number: null,
                    numbers: [],
                    selected: false
                });
                for (var digit = 0; digit < 9; digit++) {
                    this.$set(this.cells[y][x].numbers, digit, false);
                }
            }
        }
    }
};
</script>

<style scoped>
table {
    margin: 1em auto;
}
.sudoku-cell {
    height: 5em;
    width: 5em;
    border: 1px solid;
    text-align: center;
    vertical-align: top;
    position: relative;
}
.sudoku-cell:first-child {
    border-left: solid;
}
.sudoku-cell:nth-child(3n) {
    border-right: solid;
}
.sudoku-row:first-child {
    border-top: solid;
}
.sudoku-row:nth-child(3n) td {
    border-bottom: solid;
}

.number-small {
    height: 1em;
    font-size: 0.8em;
    line-height: 1em;
}

.number-large {
    width: 100%;
    height: 100%;
    font-size: 2.2em;
    align-items: center;
    justify-content: center;
    display: flex;
}

.number-large.selected, .number-large.selected:hover {
    background-color: rgba(0, 0, 0, 0.3);
}

.number-list {
    position: absolute;
    left: 4px;
    right: 4px;
    top: 4px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    height: 1em;
}

.number {
    cursor: pointer;
}

.number:hover {
    background-color: rgba(0, 0, 0, 0.15);
}

.number-list:hover .number-off {
    color: #808080;
    visibility: initial;
}

.number-off {
    visibility: hidden;
}
</style>
