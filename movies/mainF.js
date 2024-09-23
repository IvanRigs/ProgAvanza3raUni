const { createApp, ref } = Vue;

createApp({
    setup() {
        const email = ref('');
        return {
        email
        };
    }
}).mount('#app');

