<template>
    <div class="content">
        <input type="text" v-model="regex" placeholder="regular expression" @keyup.enter="getNFA"/>
        <div id="nfa-graph" class="content"></div>
    </div>
</template>

<script>
var currentId = 0;

/**
 * @param {Object[]} edges1
 * @param {Object[]} edges2
 * @return {boolean}
 */
function edgesEqual(edges1, edges2) {
    if(edges1.length != edges2.length) {

    }
}

function edgesSubset(edges1, edges2) {
    for(var i = 0; i < this.nodes.length; i++) {
        for(var j = 0; j < this.nodes.length; j++) {

        }
    }
}

class NFA {
    constructor(nodes) {
        this.nodes = nodes;
    }

    /**
     * @returns {Node}
     */
    get start() {
        return this.nodes[0];
    }

    /**
     * @returns {Node}
     */
    get end() {
        return this.nodes[this.nodes.length - 1];
    }

    minimize() {
        for(var i = 0; i < this.nodes.length; i++) {
            for(var j = i + 1; j < this.nodes.length; j++) {

            }
        }
    }
}

class Node {
    constructor() {
        this.id = currentId;
        currentId++;
        this.edges = [];
        this.color = 'white';
        this.border = 'white';
    }

    /**
     * @param {Node|number} to
     * @param {string} label
     */
    addEdge(to, label) {
        this.edges.push({
            from: this.id,
            to: (typeof to == 'object' ? to.id : to),
            label: label,
            arrows: 'to',
            font: {
                size: 24,
                color: 'white',
                strokeWidth: 0,
                align: 'top',
            },
            color: {
                color: 'white',
            }
        });
    }
}

/**
 * @param {string} char
 * @returns {NFA}
 */
function charNFA(char) {
    if(char.length == 0) {
        char = 'ϵ';
    }
    console.log(`charNFA ${char}`);
    var start = new Node();
    var end = new Node();
    start.addEdge(end, char);
    var nfa = new NFA([start, end]);
    return nfa;
}

/**
 * @param {string[]} strings
 * @returns {NFA}
 */
function union(strings) {
    console.log(`union ${strings}`);
    var start = new Node();
    var end = new Node();
    var nodes = [];
    for(var string of strings) {
        var newNFA = calcNFA(string);
        nodes = nodes.concat(newNFA.nodes);
        start.addEdge(newNFA.start, 'ϵ');
        newNFA.end.addEdge(end, 'ϵ');
    }
    var nfa = new NFA([start].concat(nodes).concat([end]));
    return nfa;
}

/**
 * @param {string[]} strings
 * @returns {NFA}
 */
function concat(strings) {
    console.log(`concat ${strings}`);
    var nfas = [];
    for(var string of strings) {
        nfas.push(calcNFA(string));
    }
    var nodes = [];
    for(var i = 0; i < nfas.length - 1; i++) {
        nfas[i].end.addEdge(nfas[i + 1].start, 'ϵ');
        nodes = nodes.concat(nfas[i].nodes);
    }
    nodes = nodes.concat(nfas[nfas.length - 1].nodes);
    var nfa = new NFA(nodes);
    return nfa;
}

/**
 * @param {string[]} strings
 * @returns {NFA}
 */
function star(string) {
    console.log(`star ${string}`);
    var start = new Node();
    var end = new Node();
    var newNFA = calcNFA(string);

    start.addEdge(newNFA.start, 'ϵ');
    start.addEdge(end, 'ϵ');
    newNFA.end.addEdge(newNFA.start, 'ϵ');
    newNFA.end.addEdge(end, 'ϵ');
    var nfa = new NFA([start].concat(newNFA.nodes).concat([end]));
    return nfa;
}

/**
 * @param {string} regex
 * @returns {NFA}
 */
function calcNFA(regex) {
    console.log(`calcNFA ${regex}`);
    var unions = [];
    var concats = [];
    var stars = [];
    var parens = [];

    var depth = 0;
    var opening = -1;
    for(var i = 0; i < regex.length; i++) {
        if(regex[i] == '(') {
            if(depth == 0) {
                opening = i;
            }
            depth++;
        } else if(regex[i] == ')') {
            if(opening == -1) {
                console.error('Unbalanced parens, extra closing at ' + i);
            } else {
                depth--;
                if(depth == 0) {
                    parens.push([opening, i]);
                    opening = -1;
                }
            }
        }
        if(depth == 0) {
            if(regex[i] == '*') {
                stars.push(i);
            } else if(regex[i] == '|') {
                unions.push(i);
            }
            if(![undefined, '|', '('].includes(regex[i]) && ![undefined, '|', ')', '*'].includes(regex[i + 1])) {
                concats.push(i + 1);
            }
        }
    }
    if(depth != 0) {
        console.error('Unbalanced parens, ' + depth + ' extra opening');
    }

    if(unions.length > 0) {
        var strings = [regex.slice(0, unions[0])];
        for(var i = 0; i < unions.length; i++) {
            strings.push(regex.slice(unions[i] + 1, unions[i + 1]));
        }
        return union(strings);
    } else if(concats.length > 0) {
        var strings = [regex.slice(0, concats[0])];
        for(var i = 0; i < concats.length; i++) {
            strings.push(regex.slice(concats[i], concats[i + 1]));
        }
        return concat(strings);
    } else if(stars.length > 0) {
        console.assert(stars.length == 1);
        return star(regex.slice(0, -1));
    } else if(parens.length > 0) {
        return calcNFA(regex.slice(1, -1));
    } else {
        return charNFA(regex);
    }
}

export default {
    data() {
        return {
            regex: '',
        }
    },
    methods: {
        getNFA() {
            var nfa = calcNFA(this.regex);
            /*var nodes = [];
            for(var node of nfa.nodes) {
                nodes.push({
                    id: node.id,
                });
            }*/

            var nodesSet = new vis.DataSet(nfa.nodes);

            var edges = [];
            for(var node of nfa.nodes) {
                edges = edges.concat(node.edges);
            }

            var edgesSet = new vis.DataSet(edges);

            var container = document.getElementById('nfa-graph');
            var data = {
                nodes: nodesSet,
                edges: edgesSet,
            };
            var options = {};
            var network = new vis.Network(container, data, options);
        },
    },
    created() {
        var visjs = document.createElement('script');
        visjs.setAttribute('src', 'https://cdnjs.cloudflare.com/ajax/libs/vis/4.21.0/vis.min.js');
        document.head.appendChild(visjs);
        var viscss = document.createElement('link');
        viscss.setAttribute('href', 'https://cdnjs.cloudflare.com/ajax/libs/vis/4.21.0/vis.min.css');
        viscss.setAttribute('rel', 'stylesheet');
        viscss.setAttribute('type', 'text/css');
        document.head.appendChild(viscss);
    }
}
</script>

<style>
.content {
    height: 100%;
}
</style>
