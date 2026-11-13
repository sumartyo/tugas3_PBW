Vue.component("app-modal", {
    template: "#tpl-modal",
    data() {
        return { visible: false, message: "", onConfirm: null };
    },
    methods: {
        open(message, onConfirm) {
            this.message = message;
            this.onConfirm = onConfirm;
            this.visible = true;
        },
        confirm() {
            if (this.onConfirm) this.onConfirm();
            this.visible = false;
        },
        cancel() {
            this.visible = false;
        },
    },
});
