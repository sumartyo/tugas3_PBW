Vue.component("ba-stock-table", {
    template: "#tpl-stock",
    props: ["items", "upbjjList", "kategoriList"],
    data() {
        return {
            filterUpbjj: "",
            filterKategori: "",
            filterReorder: false,
            sortBy: "",
            sortDir: "asc",
            editMode: false,
            editItem: null,
            newItem: this.emptyItem(),
            errors: {},
        };
    },
    computed: {
        // Dependent options: kategori hanya muncul jika upbjj dipilih
        showKategoriFilter() {
            return this.filterUpbjj !== "";
        },
        filteredItems() {
            let result = this.items.slice();
            if (this.filterUpbjj)
                result = result.filter((i) => i.upbjj === this.filterUpbjj);
            if (this.showKategoriFilter && this.filterKategori)
                result = result.filter(
                    (i) => i.kategori === this.filterKategori,
                );
            if (this.filterReorder)
                result = result.filter((i) => i.qty < i.safety || i.qty === 0);
            if (this.sortBy) {
                result.sort((a, b) => {
                    let va = a[this.sortBy],
                        vb = b[this.sortBy];
                    if (typeof va === "string")
                        ((va = va.toLowerCase()), (vb = vb.toLowerCase()));
                    return (
                        (va < vb ? -1 : va > vb ? 1 : 0) *
                        (this.sortDir === "asc" ? 1 : -1)
                    );
                });
            }
            return result;
        },
    },
    watch: {
        // Watcher 1: reset kategori saat upbjj berubah
        filterUpbjj() {
            this.filterKategori = "";
        },
        // Watcher 2: reset error saat form baru dibuka
        editMode() {
            this.errors = {};
        },
    },
    methods: {
        emptyItem() {
            return {
                kode: "",
                judul: "",
                kategori: "",
                upbjj: "",
                lokasiRak: "",
                harga: 0,
                qty: 0,
                safety: 0,
                catatanHTML: "",
            };
        },
        resetFilter() {
            this.filterUpbjj = "";
            this.filterKategori = "";
            this.filterReorder = false;
            this.sortBy = "";
            this.sortDir = "asc";
        },
        validate(item) {
            const e = {};
            if (!item.kode) e.kode = "Kode wajib";
            if (!item.judul) e.judul = "Judul wajib";
            if (!item.kategori) e.kategori = "Kategori wajib";
            if (!item.upbjj) e.upbjj = "UPBJJ wajib";
            if (!item.lokasiRak) e.lokasiRak = "Lokasi rak wajib";
            if (item.harga <= 0) e.harga = "Harga > 0";
            if (item.qty < 0) e.qty = "Qty >= 0";
            if (item.safety < 0) e.safety = "Safety >= 0";
            this.errors = e;
            return Object.keys(e).length === 0;
        },
        submitNew() {
            if (!this.validate(this.newItem)) return;
            this.$emit("add-item", { ...this.newItem });
            this.newItem = this.emptyItem();
        },
        startEdit(item) {
            this.editItem = { ...item };
            this.editMode = true;
        },
        submitEdit() {
            if (!this.validate(this.editItem)) return;
            this.$emit("update-item", { ...this.editItem });
            this.editMode = false;
            this.editItem = null;
        },
        confirmDelete(item) {
            this.$refs.modalConfirm.open(`Hapus bahan ajar ${item.kode}?`, () =>
                this.$emit("delete-item", item.kode),
            );
        },
    },
});
