import Vue from "vue";

const Counter = ({
    dummyKey
}, mountingNode) => (new Vue({
    el: mountingNode,
    template: `
            <div class="vue-counter">
                <div class="counter-header">
                    <span>•••</span>
                    <h1>{{dummyKey}}</h1>
                    <span>•••</span>
                </div>
                <h1 class="counter-count">{{count}}</h1>
                <div class="controls-wrapper">
                    <button class="counter-btn" @click="down">
                        -
                    </button>
                    <button class="counter-btn" @click="up">
                        +
                    </button>
                </div>
            </div>
    `,
    data: {
        count: 0,
        dummyKey
    },
    methods: {
        up() {
            this.count++;
        },
        down() {
            this.count--;
        }
    }
}));
export default Counter;