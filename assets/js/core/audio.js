// ============================================================================
// audio.js — reproduce el audio ambiente de la página en el primer click
// (los navegadores bloquean el autoplay con sonido).
// Antes esto era ~9 líneas repetidas en CADA Scripts/*.js.
//
// Uso en la página:  activarAudioAmbiente('audioAcerca', 0.12);
// ============================================================================

function activarAudioAmbiente(idAudio, volumen = 0.12) {
    const audio = document.getElementById(idAudio);
    if (!audio) return;

    audio.volume = volumen;

    function iniciar() {
        audio.play().catch(() => { });
        document.removeEventListener('click', iniciar);
    }
    document.addEventListener('click', iniciar);
}
