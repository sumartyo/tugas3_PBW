Vue.component("do-tracking", {
    template: "#tpl-tracking",
    props: ["data", "pengirimanList", "paketList"],
    data() {
        return {
            search: "",
            newDO: {
                nim: "",
                nama: "",
                ekspedisi: "",
                paket: "",
                tanggalKirim: "",
            },
            progressInput: {},
            errors: {},
        };
    },
    computed: {
        hasilPencarian() {
            if (!this.search) return this.data;
            const q = this.search.toLowerCase();
            return this.data.filter(
                (d) => d.nomorDO.toLowerCase().includes(q) || d.nim.includes(q),
            );
        },
        selectedPaketDetail() {
            return (
                this.paketList.find((p) => p.kode === this.newDO.paket) || null
            );
        },
    },
    watch: {
        // Watcher: reset detail saat paket berubah
        "newDO.paket"() {
            this.errors = {};
        },
    },
    methods: {
        formatTanggal(tgl) {
            if (!tgl) return "-";
            const d = new Date(tgl);
            return d.toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
            });
        },
        onSearchEnter() {
            /* search sudah reaktif via computed */
        },
        clearSearch() {
            this.search = "";
        },
        generateDO() {
            const year = new Date().getFullYear();
            const seq = String(this.data.length + 1).padStart(3, "0");
            return `DO${year}-${seq}`;
        },
        submitDO() {
            const e = {};
            if (!this.newDO.nim) e.nim = "NIM wajib";
            if (!this.newDO.nama) e.nama = "Nama wajib";
            if (!this.newDO.ekspedisi) e.ekspedisi = "Ekspedisi wajib";
            if (!this.newDO.paket) e.paket = "Paket wajib";
            this.errors = e;
            if (Object.keys(e).length) return;
            const paket = this.paketList.find(
                (p) => p.kode === this.newDO.paket,
            );
            const doBaru = {
                nomorDO: this.generateDO(),
                nim: this.newDO.nim,
                nama: this.newDO.nama,
                status: "Dalam Perjalanan",
                ekspedisi: this.newDO.ekspedisi,
                tanggalKirim:
                    this.newDO.tanggalKirim ||
                    new Date().toISOString().slice(0, 10),
                paket: this.newDO.paket,
                total: paket.harga,
                perjalanan: [
                    {
                        waktu: new Date().toLocaleString("id-ID"),
                        keterangan: "DO dibuat",
                    },
                ],
            };
            this.$emit("add-tracking", doBaru);
            this.newDO = {
                nim: "",
                nama: "",
                ekspedisi: "",
                paket: "",
                tanggalKirim: "",
            };
        },
        addProgress(nomorDO) {
            const ket = this.progressInput[nomorDO];
            if (!ket) return;
            this.$emit("add-progress", {
                nomorDO,
                waktu: new Date().toLocaleString("id-ID"),
                keterangan: ket,
            });
            this.progressInput[nomorDO] = "";
        },
    },
});
