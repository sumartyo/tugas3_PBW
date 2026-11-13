Vue.component("order-form", {
    template: "#tpl-order",
    props: ["paket", "ekspedisi"],
    data() {
        return { selectedPaket: "", selectedEkspedisi: "", nama: "", nim: "" };
    },
    computed: {
        detailPaket() {
            return (
                this.paket.find((p) => p.kode === this.selectedPaket) || null
            );
        },
    },
    methods: {
        submit() {
            if (
                !this.selectedPaket ||
                !this.selectedEkspedisi ||
                !this.nama ||
                !this.nim
            )
                return;
            this.$emit("created", {
                paket: this.selectedPaket,
                ekspedisi: this.selectedEkspedisi,
                nama: this.nama,
                nim: this.nim,
            });
            this.selectedPaket = "";
            this.selectedEkspedisi = "";
            this.nama = "";
            this.nim = "";
        },
    },
});
