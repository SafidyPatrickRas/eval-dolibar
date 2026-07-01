<template>
    <div>
        <h1>Reinitialisation de la base</h1>
        <div>
            <button @click="runReset" :disabled="running">Reinitialiser</button>
            <pre v-if="output">{{ output }}</pre>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return { running: false, output: "" };
    },
    methods: {
        async runReset() {
            if (this.running) return; // guard double clicks
            this.running = true;
            this.output = "🚀 Vérification Docker...\n";
            try {
                const resp = await fetch("http://localhost:4000/reset", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({}),
                });
                if (!resp.ok) {
                    const text = await resp.text();
                    this.output += "\n🛑 Server error: " + resp.status + " - " + text;
                    return;
                }
                const reader = resp.body.getReader();
                const dec = new TextDecoder();
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    this.output += dec.decode(value);
                }
            } catch (err) {
                this.output += "\n🛑 Erreur: " + err;
            } finally {
                this.running = false;
            }
        },
    },
};
</script>

<style scoped>
pre {
    background: #111;
    color: #bfc;
    padding: 10px;
}
</style>
