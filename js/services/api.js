const ApiService = {
    async fetchData() {
        const res = await fetch("data/dataBahanAjar.json");
        if (!res.ok) throw new Error("Gagal memuat data");
        return await res.json();
    },
};
