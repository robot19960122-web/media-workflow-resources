const scopes = Object.freeze({
  music: ['quiet-speech', 'important-effects', 'music-reduction', 'voice-artifacts', 'full-export-sync'],
  transparency: ['moving-alpha', 'web-playback', 'autoplay-fallback', 'reduced-motion', 'poster-fallback', 'replacement-version'],
  speech: ['quiet-syllables', 'every-speaker', 'room-tone', 'voice-artifacts', 'full-export-sync', 'target-player'],
  authenticity: ['media-access', 'sample-coverage', 'visual-observations', 'audio-availability', 'compression-context', 'independent-source']
});
export const workflows = Object.freeze(Object.keys(scopes));
export function createTemplate(workflow, artifactVersion) {
  if (!Object.hasOwn(scopes, workflow)) throw new TypeError('Unknown workflow');
  if (typeof artifactVersion !== 'string' || !artifactVersion.trim() || artifactVersion.length > 200) throw new TypeError('Expected explicit artifact version');
  return { schemaVersion: 1, workflow, requirements: scopes[workflow].map(scope => ({id:scope, scope, artifactVersion})), observations: [] };
}
