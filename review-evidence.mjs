// A documentation example, not a media scanner or authenticity detector.
export function outcomeFor(requirement, observation) {
  if (!requirement || typeof requirement.scope !== 'string' || !requirement.scope.trim() ||
      typeof requirement.artifactVersion !== 'string' || !requirement.artifactVersion.trim()) {
    throw new TypeError('A nonempty scope and artifactVersion are required');
  }
  if (!observation || observation.observed !== true) return 'untested';
  if (observation.artifactVersion !== requirement.artifactVersion) return 'stale';
  if (observation.scope !== requirement.scope) return 'insufficient';
  if (observation.outcome === 'pass' || observation.outcome === 'fail') return observation.outcome;
  return 'unknown';
}
