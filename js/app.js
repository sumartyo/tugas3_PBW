Vue.filter("currency", (val) => "Rp " + Number(val).toLocaleString("id-ID"));
Vue.filter("satuan", (val) => val + " buah");

new Vue({
    el: "#app",
    data: {
        tab: "stok",
        state: {
            stok: [],
            tracking: [],
            upbjjList: [],
            kategoriList: [],
            pengirimanList: [],
            paket: [],
        },
    },
    async created() {
        try {
            const data = await ApiService.fetchData();
            this.state.upbjjList = data.upbjjList;
            this.state.kategoriList = data.kategoriList;
            this.state.pengirimanList = data.pengirimanList;
            this.state.paket = data.paket;
            this.state.stok = data.stok;
            this.state.tracking = data.tracking;
        } catch (e) {
            console.error(e);
        }
    },
    methods: {
        handleAdd(item) {
            this.state.stok.push(item);
        },
        handleUpdate(updated) {
            const idx = this.state.stok.findIndex(
                (s) => s.kode === updated.kode,
            );
            if (idx > -1) this.$set(this.state.stok, idx, updated);
        },
        handleDelete(kode) {
            this.state.stok = this.state.stok.filter((s) => s.kode !== kode);
        },
        handleAddTracking(doBaru) {
            this.state.tracking.push(doBaru);
        },
        handleAddProgress({ nomorDO, waktu, keterangan }) {
            const d = this.state.tracking.find((t) => t.nomorDO === nomorDO);
            if (d) d.perjalanan.push({ waktu, keterangan });
        },
        handleNewDO(payload) {
            // Buat DO dari order-form
            const year = new Date().getFullYear();
            const seq = String(this.state.tracking.length + 1).padStart(3, "0");
            const paket = this.state.paket.find(
                (p) => p.kode === payload.paket,
            );
            this.state.tracking.push({
                nomorDO: `DO${year}-${seq}`,
                nim: payload.nim,
                nama: payload.nama,
                status: "Dalam Perjalanan",
                ekspedisi: payload.ekspedisi,
                tanggalKirim: new Date().toISOString().slice(0, 10),
                paket: payload.paket,
                total: paket.harga,
                perjalanan: [
                    {
                        waktu: new Date().toLocaleString("id-ID"),
                        keterangan: "DO dibuat",
                    },
                ],
            });
            this.tab = "tracking";
        },
    },
});
