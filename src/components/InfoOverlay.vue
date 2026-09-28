<script setup lang="ts">
defineProps<{
  /** First visit: show only the disclaimer with an accept button. */
  firstVisit: boolean
}>()

const emit = defineEmits<{ close: [] }>()
</script>

<template>
  <div class="backdrop" @click.self="!firstVisit && emit('close')">
    <div class="dialog" role="dialog" aria-modal="true" aria-labelledby="info-title">
      <h2 id="info-title">{{ firstVisit ? 'Bitte beachten' : 'Informationen' }}</h2>

      <section>
        <h3>Haftungshinweis</h3>
        <p>
          Die Parzellengrenzen auf dieser Karte wurden privat nach bestem Wissen eingezeichnet. Sie sind
          <strong>nicht amtlich</strong> und können von den tatsächlichen Reviergrenzen abweichen. Die
          Anzeige der Standortposition ist nur so genau wie das GPS deines Geräts.
        </p>
        <p>
          Maßgeblich sind ausschließlich die offiziellen Unterlagen des Fischereiberechtigten und deine
          Lizenzbedingungen. Für Fehler in der Karte oder Folgen ihrer Nutzung wird keine Haftung übernommen.
        </p>
      </section>

      <template v-if="!firstVisit">
        <section>
          <h3>Impressum</h3>
          <p>
            Bernhard Schaidhammer<br />
            83607 Holzkirchen<br />
            Deutschland
          </p>
          <p>Privates, nicht kommerzielles Projekt.</p>
        </section>

        <section>
          <h3>Datenschutz</h3>
          <ul>
            <li>
              Dein <strong>Standort</strong> wird nur im Browser verarbeitet und weder gespeichert noch an
              einen Server übertragen.
            </li>
            <li>
              Die Seite wird über <strong>GitHub Pages</strong> ausgeliefert. GitHub verarbeitet dabei deine
              IP-Adresse gemäß der
              <a href="https://docs.github.com/site-policy/privacy-policies/github-general-privacy-statement" target="_blank" rel="noopener">GitHub-Datenschutzerklärung</a>.
            </li>
            <li>
              Die Kartenkacheln stammen von <strong>basemap.at</strong>, der Verwaltungsgrundkarte Österreichs.
              Sie werden von Servern der Stadt Wien ausgeliefert, die dabei deine IP-Adresse erhalten
              (<a href="https://www.wien.gv.at/info/datenschutz/" target="_blank" rel="noopener">Datenschutzerklärung der Stadt Wien</a>).
            </li>
            <li>
              Es werden keine Cookies gesetzt und kein Tracking eingesetzt. Im lokalen Speicher deines Browsers
              wird nur vermerkt, dass du diesen Hinweis gelesen hast.
            </li>
          </ul>
        </section>

        <section class="source">
          Quellcode: <a href="https://github.com/BerniBurnsen/fishing-lake-plot" target="_blank" rel="noopener">github.com/BerniBurnsen/fishing-lake-plot</a>
        </section>
      </template>

      <button class="primary" autofocus @click="emit('close')">
        {{ firstVisit ? 'Verstanden' : 'Schließen' }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.backdrop {
  position: absolute;
  inset: 0;
  z-index: 2000;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}
.dialog {
  background: #fff;
  color: #222;
  border-radius: 10px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.4);
  padding: 18px 20px;
  width: min(480px, 100%);
  max-height: calc(100% - 32px);
  overflow-y: auto;
  font-size: 14px;
  line-height: 1.45;
}
h2 {
  margin: 0 0 12px;
  font-size: 18px;
}
h3 {
  margin: 14px 0 4px;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: #666;
}
p,
ul {
  margin: 0 0 8px;
}
ul {
  padding-left: 18px;
}
li {
  margin-bottom: 4px;
}
a {
  color: #1976d2;
}
.source {
  margin-top: 14px;
  font-size: 12px;
  color: #666;
}
.primary {
  display: block;
  width: 100%;
  margin-top: 16px;
  padding: 10px;
  border: none;
  border-radius: 6px;
  background: #1976d2;
  color: #fff;
  font-size: 15px;
  cursor: pointer;
}
</style>
