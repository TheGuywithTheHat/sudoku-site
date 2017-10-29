<template>
    <div>
        <sudoku></sudoku>
    </div>
</template>

<script>
import Sudoku from './Sudoku.vue';
import 'purecss/build/pure-min.css';

export default {
    components: {
        'sudoku': Sudoku
    }
};
</script>

<style>

</style>
