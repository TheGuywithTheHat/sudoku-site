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
import $ from "jquery";

export default {
    data() {
        return {
            cells: [],
            selected: { x: null, y: null },
        };
    },
    methods: {
        sendUpdate() {},
        toggle(x, y, index) {
            this.$set(
                this.cells[y][x].numbers,
                index, !this.cells[y][x].numbers[index]
            );
        },
        select(x, y) {
            if (this.selected.x != null && this.selected.y != null) {
                this.cells[this.selected.y][this.selected.x].selected = false;
            }
            if (x != null) {
                this.selected.x = x;
                this.selected.y = y;
                this.cells[y][x].selected = true;
            }
        },
        keypress(event) {
            if (event.key >= 1 && event.key <= 9 && this.selected.x != null && this.selected.y != null) {
                this.cells[this.selected.y][this.selected.x].number = event.key;
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
    padding: 4px 4px;
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
    width: 10%;
    height: 1em;
    font-size: 0.8em;
    text-align: center;
    line-height: 1em;
}

.number-large {
    width: 100%;
    height: 2em;
    font-size: 1.8em;
    text-align: center;
    line-height: 2em;
}

.number-large.selected {
    background-color: rgba(128, 128, 255, 0.3);
}

.number-list {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
}

.number {
    cursor: pointer;
}

.number:hover {
    background-color: rgba(0, 0, 0, 0.1);
}

.number-list:hover .number-off {
    color: #bbbbbb;
}

.number-off {
    color: transparent;
}
</style>
