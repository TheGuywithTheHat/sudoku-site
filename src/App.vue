<template>
    <div id="main">
        <div id="topbar" class="pure-menu pure-menu-horizontal">
            <router-link to="/" class="pure-menu-heading pure-menu-link">TGwTH</router-link>
            <ul class="pure-menu-list">
                <li class="pure-menu-item"><router-link to="/sudoku" class="pure-menu-link">Sudoku</router-link></li>
                <li class="pure-menu-item"><router-link to="/nfaaas" class="pure-menu-link">NFAaaS</router-link></li>
            </ul>
        </div>
        <keep-alive><router-view></router-view></keep-alive>
    </div>
</template>

<script>
import SudokuPage from './SudokuPage.vue';
import MainPage from './MainPage.vue';
import NFAaaS from './NFAaaS.vue';
import VueRouter from 'vue-router';
import 'purecss/build/pure-min.css';
import 'purecss/build/grids-responsive-min.css';

var router = new VueRouter({
    routes: [
        { path: '/', component: MainPage},
        { path: '/sudoku', component: SudokuPage},
        { path: '/nfaaas', component: NFAaaS},
    ],
});

export default { router };
</script>

<style>
html {
    box-sizing: border-box;
    background-color: #202020;
    color: #E0E0E0;
}

*, *::before, *::after {
    box-sizing: inherit;
}

input {
    border: 1px solid #E0E0E0;
    background-color: inherit;
    padding: 0.1em;
}

#content {
    flex-grow: 1;
    padding: 1em;
}

#main {
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
}
</style>
